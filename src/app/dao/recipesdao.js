const pool = require('../config/dbconfig');
const pluralize = require('pluralize');
const path = require('path');
const fs = require('fs');

class recipesDao {
  constructor() {
    this.pool = pool;
  }

  static getOrInsert(connection, table, column, value, cb) {
    if (!value || value.trim() === '') return cb(null, null);

    const normalized = value.trim().toLowerCase(); // Normalize input

    // Check if the value already exists
    connection.query(`SELECT id FROM ${table} WHERE ${column} = ?`, [normalized], (err, rows) => {
      if (err) return cb(err);
      if (rows.length > 0) return cb(null, rows[0].id);

      // Insert if not found
      connection.query(`INSERT INTO ${table} (${column}) VALUES (?)`, [normalized], (err, result) => {
        if (err) return cb(err);
        cb(null, result.insertId);
      });
    });
  }

// Add a new recipe
  addRecipe(req, res) {
    const { name, category_id, prep_time, cook_time, servings } = req.body;
    const image_filename = req.file?.filename || null;

    let instructions = [];
    let ingredients = [];

    try {
      instructions = JSON.parse(req.body.instructions || '[]');
      ingredients = JSON.parse(req.body.ingredients || '[]');
    } catch (e) {
      return res.status(400).json({ error: 'Invalid instructions or ingredients format' });
    }

    if (!name || !category_id || !instructions.length || !ingredients.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    this.pool.getConnection((err, connection) => {
      if (err) return res.status(500).json({ error: err.message });

      connection.beginTransaction(err => {
        if (err) return res.status(500).json({ error: err.message });

        // Check for existing dish with same name
        connection.query("SELECT id FROM dishes WHERE name = ?", [name], (err, rows) => {
          if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
          if (rows.length > 0) return connection.rollback(() => res.status(400).json({ error: 'Dish with this name already exists' }));

          connection.query("INSERT INTO dishes (name, category_id) VALUES (?, ?)", [name, category_id], (err, result) => {
            if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
            const dishId = result.insertId;

            connection.query("INSERT INTO recipes (dish_id, prep_time_minutes, cook_time_minutes, servings) VALUES (?, ?, ?, ?)", [dishId, prep_time, cook_time, servings], (err) => {
              if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

              const insertInstructions = instructions.map((step, i) => [dishId, i + 1, step]);
              connection.query("INSERT INTO instruction_steps (dish_id, step_number, content) VALUES ?", [insertInstructions], (err) => {
                if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                const handleIngredient = (i) => {
                  if (i >= ingredients.length) {
                    if (!image_filename) {
                      return connection.commit(err => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                        connection.release();
                        res.status(201).json({ message: 'Recipe created', dish_id: dishId });
                      });
                    }

                    connection.query("INSERT INTO dish_images (dish_id, image_filename) VALUES (?, ?)", [dishId, image_filename], (err) => {
                      if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                      connection.commit(err => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                        connection.release();
                        res.status(201).json({ message: 'Recipe created', dish_id: dishId });
                      });
                    });
                    return;
                  }

                  const { name, quantity, unit_id } = ingredients[i];
                  recipesDao.getOrInsert(connection, 'ingredients', 'name', name, (err, ingredient_id) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                    recipesDao.getOrInsert(connection, 'units', 'name', unit_id, (err, unit) => {
                      if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                      connection.query("INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, unit_id) VALUES (?, ?, ?, ?)", [dishId, ingredient_id, quantity, unit], (err) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                        handleIngredient(i + 1);
                      });
                    });
                  });
                };

                handleIngredient(0);
              });
            });
          });
        });
      });
    });
  }

  getAllIngredients(req, res) {
    this.pool.query("SELECT id, name FROM ingredients ORDER BY name;", (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    });
  }

  // Simple recipe info for list view
  getSimpleInfo(req, res) {
    this.pool.query(`
      SELECT 
        dishes.id,
        dishes.name,
        dish_images.image_filename
      FROM dishes
      INNER JOIN dish_images ON dishes.id = dish_images.dish_id
      ORDER BY dishes.id;`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const recipes = rows.map(row => ({
        id: row.id,
        name: row.name,
        image_url: row.image_filename ? `/imgs/${row.image_filename}` : null
      }));

      res.json(recipes);
    });
  }

  // Full recipe list with ingredients
  getFullRecipes(req, res) {
    const sql = `
      SELECT
        d.id AS dish_id,
        d.name AS recipe_name,
        di.image_filename,
        r.prep_time_minutes,
        r.cook_time_minutes,
        r.servings,
        r.instructions,
        ing.name AS ingredient_name,
        dish_ing.quantity,
        dish_ing.unit,
        c.name AS category_name
      FROM recipes r
      INNER JOIN dishes d ON r.dish_id = d.id
      INNER JOIN dish_images di ON d.id = di.dish_id
      INNER JOIN dish_ingredients dish_ing ON d.id = dish_ing.dish_id
      INNER JOIN ingredients ing ON dish_ing.ingredient_id = ing.id
      INNER JOIN categories c ON ing.category_id = c.id
      ORDER BY d.id, ingredient_name;
    `;

    this.pool.query(sql, (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const recipes = {};
      rows.forEach(row => {
        if (!recipes[row.dish_id]) {
          recipes[row.dish_id] = {
            id: row.dish_id,
            name: row.recipe_name,
            image_url: `/imgs/${row.image_filename}`,
            prep_time: row.prep_time_minutes,
            cook_time: row.cook_time_minutes,
            servings: row.servings,
            instructions: row.instructions,
            ingredients: []
          };
        }

        recipes[row.dish_id].ingredients.push({
          name: row.ingredient_name,
          quantity: row.quantity,
          unit: row.unit,
          category: row.category_name
        });
      });

      res.json(Object.values(recipes));
    });
  }

  getRecipesByCategory(req, res) {
    const { category } = req.params;

    this.pool.query(`
      SELECT 
        dishes.id,
        dishes.name,
        dish_images.image_filename
      FROM dishes
      INNER JOIN dish_images ON dishes.id = dish_images.dish_id
      INNER JOIN categories ON dishes.category_id = categories.id
      WHERE categories.name = ?
      ORDER BY dishes.id;
    `, [category], (err, rows) => {
      if (err) {
        console.error("SQL error:", err.message);
        return res.status(500).json({ error: err.message });
      }

      const recipes = rows.map(row => ({
        id: row.id,
        name: row.name,
        image_url: row.image_filename ? `/imgs/${row.image_filename}` : null
      }));

      res.json(recipes);
    });
  }

  getRecipesByIngredient(req, res) {
    const { name } = req.params;

    this.pool.query(`
      SELECT 
        dishes.id,
        dishes.name,
        dish_images.image_filename
      FROM dishes
      INNER JOIN dish_images ON dishes.id = dish_images.dish_id
      INNER JOIN dish_ingredients ON dishes.id = dish_ingredients.dish_id
      INNER JOIN ingredients ON dish_ingredients.ingredient_id = ingredients.id
      WHERE ingredients.name = ?
      GROUP BY dishes.id
      ORDER BY dishes.id;
    `, [name], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      const recipes = rows.map(row => ({
        id: row.id,
        name: row.name,
        image_url: row.image_filename ? `/imgs/${row.image_filename}` : null
      }));

      res.json(recipes);
    });
  }

  // Get a single recipe by ID
  getRecipeById(req, res) {
    const id = req.params.id;

    this.pool.query(`
      SELECT
        d.id AS dish_id,
        d.name AS recipe_name,
        d.category_id,                          
        di.image_filename,
        r.prep_time_minutes,
        r.cook_time_minutes,
        r.servings,
        ing.name AS ingredient_name,
        dish_ing.quantity,
        u.name AS unit_name,
        c.name AS category_name
      FROM recipes r
      INNER JOIN dishes d ON r.dish_id = d.id
      INNER JOIN dish_images di ON d.id = di.dish_id
      INNER JOIN dish_ingredients dish_ing ON d.id = dish_ing.dish_id
      INNER JOIN ingredients ing ON dish_ing.ingredient_id = ing.id
      INNER JOIN categories c ON d.category_id = c.id
      LEFT JOIN units u ON dish_ing.unit_id = u.id
      WHERE d.id = ?;
    `, [id], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      if (rows.length === 0) return res.status(404).json({ error: 'Recipe not found' });

      const base = rows[0];

      const recipe = {
        id: base.dish_id,
        name: base.recipe_name,
        category_id: base.category_id,                
        image_url: base.image_filename ? '/imgs/' + base.image_filename : null,
        prep_time: base.prep_time_minutes,
        cook_time: base.cook_time_minutes,
        servings: base.servings,
        instructions: [],
        ingredients: rows.map(row => ({
          name: row.ingredient_name,
          quantity: row.quantity,
          unit: row.unit_name || '',
          category: row.category_name
        }))
      };

      // Load instruction steps
      this.pool.query(
        `SELECT step_number, content FROM instruction_steps WHERE dish_id = ? ORDER BY step_number`,
        [id],
        (err2, stepRows) => {
          if (err2) return res.status(500).json({ error: err2.message });

          recipe.instructions = stepRows.map(step => step.content);
          res.json(recipe);
        }
      );
    });
  }

// Delete a recipe and clean up related data
deleteRecipe(req, res) {
  // Get recipe ID from request parameters
  const dishId = req.params.id;

  // Get a database connection from the pool
  this.pool.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });

    // Start a transaction to ensure data consistency
    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 1: Get image filename and related ingredient/unit IDs
      connection.query(
        `
        SELECT 
          di.image_filename, 
          dii.ingredient_id, 
          dii.unit_id 
        FROM dish_images di
        LEFT JOIN dish_ingredients dii ON di.dish_id = dii.dish_id
        WHERE di.dish_id = ?
        `,
        [dishId],
        (err, rows) => {
          if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

          // Extract data from query results
          const image_filename = rows[0]?.image_filename;
          // Create arrays of unique ingredient and unit IDs
          const ingredientIds = [...new Set(rows.map(r => r.ingredient_id).filter(Boolean))];
          const unitIds = [...new Set(rows.map(r => r.unit_id).filter(Boolean))];

          // Define deletion steps in correct order to maintain referential integrity
          const deleteSteps = [
            `DELETE FROM instruction_steps WHERE dish_id = ?`,
            `DELETE FROM dish_ingredients WHERE dish_id = ?`,
            `DELETE FROM dish_images WHERE dish_id = ?`,
            `DELETE FROM recipes WHERE dish_id = ?`,
            `DELETE FROM dishes WHERE id = ?`
          ];

          // Execute each deletion step in sequence
          const executeStep = (i) => {
            if (i >= deleteSteps.length) return cleanupIngredients(0);
            connection.query(deleteSteps[i], [dishId], (err) => {
              if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
              executeStep(i + 1);
            });
          };

          // Step 2: Remove ingredients that are no longer used in any recipe
          const cleanupIngredients = (j) => {
            if (j >= ingredientIds.length) return cleanupUnits(0);
            const ingId = ingredientIds[j];
            // Check if ingredient is still used in other recipes
            connection.query(
              "SELECT COUNT(*) AS count FROM dish_ingredients WHERE ingredient_id = ?",
              [ingId],
              (err, result) => {
                if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                // If not used anywhere else, delete it
                if (result[0].count === 0) {
                  connection.query("DELETE FROM ingredients WHERE id = ?", [ingId], (err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                    cleanupIngredients(j + 1);
                  });
                } else {
                  cleanupIngredients(j + 1);
                }
              }
            );
          };

          // Step 3: Remove units that are no longer used in any recipe
          const cleanupUnits = (k) => {
            if (k >= unitIds.length) return finalize();
            const unitId = unitIds[k];
            // Check if unit is still used in other recipes
            connection.query(
              "SELECT COUNT(*) AS count FROM dish_ingredients WHERE unit_id = ?",
              [unitId],
              (err, result) => {
                if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                // If not used anywhere else, delete it
                if (result[0].count === 0) {
                  connection.query("DELETE FROM units WHERE id = ?", [unitId], (err) => {
                    if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                    cleanupUnits(k + 1);
                  });
                } else {
                  cleanupUnits(k + 1);
                }
              }
            );
          };

          // Step 4: Commit transaction and delete image file
          const finalize = () => {
            connection.commit(err => {
              if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

              // Delete the image file if it exists
              if (image_filename) {
                const imagePath = path.join(__dirname, '../../imgs', image_filename);
                console.log("Attempting to delete image at:", imagePath);
                fs.unlink(imagePath, (fsErr) => {
                  if (fsErr && fsErr.code !== 'ENOENT') {
                    console.warn('Image deletion error:', fsErr);
                  } else {
                    console.log("Image successfully deleted:", image_filename);
                  }
                });
              }

              // Release the connection and send success response
              connection.release();
              res.json({ message: 'Recipe and unused data deleted', dish_id: dishId });
            });
          };

          // Start the deletion process
          executeStep(0);
        }
      );
    });
  });
}


  // Search for recipes by name or ingredient
  searchRecipes(req, res) {
    // Extract search query from request
    const { query } = req.query;

    // Validate that a search term was provided
    if (!query || query.trim() === '') {
      return res.status(400).json({ error: "Search query is required" });
    }

    // Format search term for SQL LIKE query with wildcards
    const searchTerm = `%${query}%`;

    // SQL query to search in both recipe names and ingredient names
    const sql = `
      SELECT DISTINCT d.id, d.name, di.image_filename
      FROM dishes d
      LEFT JOIN dish_images di ON d.id = di.dish_id
      LEFT JOIN dish_ingredients dii ON d.id = dii.dish_id
      LEFT JOIN ingredients i ON dii.ingredient_id = i.id
      WHERE d.name LIKE ? OR i.name LIKE ?
      ORDER BY d.name
    `;

    // Execute the search query
    this.pool.query(sql, [searchTerm, searchTerm], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });

      // Format results for client
      const results = rows.map(row => ({
        id: row.id,
        name: row.name,
        image_url: row.image_filename ? `/imgs/${row.image_filename}` : null
      }));

      // Return search results
      res.json(results);
    });
  }

// Update an existing recipe with new information
updateRecipe(req, res) {
  // Extract basic recipe information from request
  const { name, category_id, prep_time, cook_time, servings } = req.body;
  const dishId = req.params.id;
  // Handle image filename from either file upload or existing image
  const image_filename = req.file?.filename || req.body.image_filename || null;

  // Initialize arrays for instructions and ingredients
  let instructions = [];
  let ingredients = [];

  // Parse JSON strings from request body
  try {
    instructions = JSON.parse(req.body.instructions || '[]');
    ingredients = JSON.parse(req.body.ingredients || '[]');
  } catch (e) {
    return res.status(400).json({ error: 'Invalid instructions or ingredients format' });
  }

  // Validate required fields
  if (!name || !category_id || !instructions.length || !ingredients.length) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Get a database connection from the pool
  this.pool.getConnection((err, connection) => {
    if (err) return res.status(500).json({ error: err.message });

    // Start a transaction to ensure data consistency
    connection.beginTransaction(err => {
      if (err) return res.status(500).json({ error: err.message });

      // Step 1: Update basic dish information
      connection.query("UPDATE dishes SET name = ?, category_id = ? WHERE id = ?", 
        [name, category_id, dishId], (err) => {
        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

        // Step 2: Update recipe details
        connection.query("UPDATE recipes SET prep_time_minutes = ?, cook_time_minutes = ?, servings = ? WHERE dish_id = ?", 
          [prep_time, cook_time, servings, dishId], (err) => {
          if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

          // Step 3: Replace instruction steps (delete old ones first)
          connection.query("DELETE FROM instruction_steps WHERE dish_id = ?", [dishId], (err) => {
            if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

            // Insert new instruction steps
            const steps = instructions.map((step, i) => [dishId, i + 1, step]);
            connection.query("INSERT INTO instruction_steps (dish_id, step_number, content) VALUES ?", 
              [steps], (err) => {
              if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

              // Step 4: Get list of current ingredient IDs before deletion for cleanup later
              connection.query("SELECT ingredient_id FROM dish_ingredients WHERE dish_id = ?", 
                [dishId], (err, oldRows) => {
                if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                const oldIngredientIds = oldRows.map(row => row.ingredient_id);

                // Step 5: Delete all existing ingredients for this recipe
                connection.query("DELETE FROM dish_ingredients WHERE dish_id = ?", [dishId], (err) => {
                  if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                  // Step 6: Insert updated ingredients recursively
                  const handleIngredient = (i) => {
                    if (i >= ingredients.length) {
                      return cleanupUnusedIngredients();
                    }

                    // Process current ingredient
                    const { name, quantity, unit_id } = ingredients[i];
                    
                    // Get or insert ingredient record
                    recipesDao.getOrInsert(connection, 'ingredients', 'name', name, (err, ingredient_id) => {
                      if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                      // Get or insert unit record
                      recipesDao.getOrInsert(connection, 'units', 'name', unit_id, (err, unit) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                        // Insert dish-ingredient relationship
                        connection.query(
                          "INSERT INTO dish_ingredients (dish_id, ingredient_id, quantity, unit_id) VALUES (?, ?, ?, ?)",
                          [dishId, ingredient_id, quantity, unit],
                          (err) => {
                            if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                            // Process next ingredient
                            handleIngredient(i + 1);
                          }
                        );
                      });
                    });
                  };

                  // Step 7: Clean up ingredients that are no longer used in any recipe
                  const cleanupUnusedIngredients = () => {
                    if (!oldIngredientIds.length) return finalize();
                    const placeholders = oldIngredientIds.map(() => '?').join(',');

                    // Check which ingredients are still used in other recipes
                    connection.query(
                      `SELECT ingredient_id FROM dish_ingredients WHERE ingredient_id IN (${placeholders})`,
                      oldIngredientIds,
                      (err, usedRows) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                        // Find ingredients that are no longer used
                        const stillUsed = new Set(usedRows.map(r => r.ingredient_id));
                        const toDelete = oldIngredientIds.filter(id => !stillUsed.has(id));

                        // Delete unused ingredients recursively
                        const deleteNext = (j) => {
                          if (j >= toDelete.length) return finalize();
                          connection.query("DELETE FROM ingredients WHERE id = ?", [toDelete[j]], (err) => {
                            if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                            deleteNext(j + 1);
                          });
                        };

                        deleteNext(0);
                      }
                    );
                  };

                  // Step 8: Update image and commit transaction
                  const finalize = () => {
                    // Get current image filename
                    connection.query("SELECT image_filename FROM dish_images WHERE dish_id = ?", 
                      [dishId], (err, rows) => {
                      if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                      // Delete old image file if it's being replaced
                      const oldFilename = rows[0]?.image_filename;
                      if (oldFilename && oldFilename !== image_filename) {
                        const oldPath = path.join(__dirname, '../../src/imgs', oldFilename);
                        fs.unlink(oldPath, err => {
                          if (err && err.code !== 'ENOENT') console.warn('Failed to delete old image:', err);
                        });
                      }

                      // Update or insert image record
                      const query = rows.length > 0
                        ? "UPDATE dish_images SET image_filename = ? WHERE dish_id = ?"
                        : "INSERT INTO dish_images (dish_id, image_filename) VALUES (?, ?)";
                      const params = rows.length > 0
                        ? [image_filename, dishId]
                        : [dishId, image_filename];

                      connection.query(query, params, (err) => {
                        if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));

                        // Commit transaction and return success
                        connection.commit(err => {
                          if (err) return connection.rollback(() => res.status(500).json({ error: err.message }));
                          connection.release();
                          res.json({ message: 'Recipe updated', dish_id: dishId });
                        });
                      });
                    });
                  };

                  // Start processing ingredients
                  handleIngredient(0);
                });
              });
            });
          });
        });
      });
    });
  });
}


}

module.exports = recipesDao;
