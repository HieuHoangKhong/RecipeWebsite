const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const daoClass = require('../../dao/recipesdao');
const dao = new daoClass();

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../../imgs'));
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

// Add a new recipe (with image)
router.post('/', upload.single('image'), (req, res) => {
  dao.addRecipe(req, res);
});

// Update a recipe (with optional image)
router.put('/:id', upload.single('image'), (req, res) => {
  dao.updateRecipe(req, res);
});

// Get all ingredients
router.get('/ingredients', (req, res) => {
  dao.getAllIngredients(req, res);
});

// Get recipes by ingredient name
router.get('/by-ingredient/:name', (req, res) => {
  dao.getRecipesByIngredient(req, res);
});

// Get recipes by category name
router.get('/by-category/:category', (req, res) => {
  dao.getRecipesByCategory(req, res);
});

// Get recipes by category ID
router.get('/by-category-id/:id', (req, res) => {
  dao.getRecipesByCategoryId(req, res);
});

// Get simplified recipe list
router.get('/simple', (req, res) => {
  dao.getSimpleInfo(req, res);
});

// Get all categories (excluding 'Ingredients')
router.get('/categories', (req, res) => {
  dao.pool.query(
    `SELECT id, name FROM categories WHERE name != 'Ingredients' ORDER BY name`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Search by recipe name or ingredient
router.get('/search', (req, res) => {
  dao.searchRecipes(req, res);
});

// Delete a recipe
router.delete('/:id', (req, res) => {
  dao.deleteRecipe(req, res);
});

// Get recipe by ID (must come last)
router.get('/:id', (req, res) => {
  dao.getRecipeById(req, res);
});

module.exports = router;
