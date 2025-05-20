// Import required dependencies
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import pluralize from 'pluralize'; // For normalizing ingredient names


function NewRecipeForm() {
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for form data with default empty values
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    instructions: [''], // Start with one empty instruction
    ingredients: [{ name: '', quantity: '', unit: '' }] // Start with one empty ingredient
  });

  // State for recipe categories (loaded from API)
  const [categories, setCategories] = useState([]);
  // State for image file upload
  const [imageFile, setImageFile] = useState(null);

  // Load categories when component mounts
  useEffect(() => {
    fetch('http://localhost:4000/api/recipes/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error("Error loading categories:", err));
  }, []);

  /**
   * Handle changes to basic form fields
   */
  const handleChange = event => {
    const { name, value } = event.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  /**
   * Handle changes to instruction steps
   */
  const handleInstructionChange = (index, value) => {
    const updated = [...form.instructions];
    updated[index] = value;
    setForm(prev => ({ ...prev, instructions: updated }));
  };

  /**
   * Add a new empty instruction step
   */
  const addInstruction = () => {
    setForm(prev => ({ ...prev, instructions: [...prev.instructions, ''] }));
  };

  /**
   * Remove an instruction step
   */
  const removeInstruction = (index) => {
    const updated = [...form.instructions];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, instructions: updated }));
  };

  /**
   * Capitalize the first letter of a string
   */
  const capitalizeFirst = str => str.charAt(0).toUpperCase() + str.slice(1);

  /**
   * Handle changes to ingredient fields
   * Automatically capitalizes ingredient names
   */
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...form.ingredients];
    // Capitalize ingredient names but not quantities or units
    newIngredients[index][field] = field === 'name' ? capitalizeFirst(value) : value;
    setForm(prev => ({ ...prev, ingredients: newIngredients }));
  };

  /**
   * Add a new empty ingredient
   */
  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit: '' }]
    }));
  };

  /**
   * Remove an ingredient
   */
  const removeIngredient = (index) => {
    const newIngredients = [...form.ingredients];
    newIngredients.splice(index, 1);
    setForm(prev => ({ ...prev, ingredients: newIngredients }));
  };

  /**
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clean and validate instruction steps
    const cleanedInstructions = form.instructions.map(step => step.trim()).filter(Boolean);

    // Validate required fields
    if (!form.name || !form.category_id || !cleanedInstructions.length || !form.ingredients.length) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format data for submission
    const recipe = {
      ...form,
      instructions: cleanedInstructions,
      // Normalize ingredient names (singular form, lowercase)
      ingredients: form.ingredients.map(ing => ({
        name: pluralize.singular(ing.name.trim().toLowerCase()),
        quantity: ing.quantity,
        unit_id: ing.unit
      }))
    };

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('name', recipe.name);
    formData.append('category_id', recipe.category_id);
    formData.append('prep_time', recipe.prep_time);
    formData.append('cook_time', recipe.cook_time);
    formData.append('servings', recipe.servings);
    formData.append('instructions', JSON.stringify(recipe.instructions));
    formData.append('ingredients', JSON.stringify(recipe.ingredients));
    if (imageFile) formData.append('image', imageFile);

    try {
      // Send POST request to create the recipe
      const response = await fetch('http://localhost:4000/api/recipes', {
        method: 'POST',
        body: formData
      });

      // Handle response
      if (response.ok) {
        const result = await response.json();
        alert("Recipe added successfully!");
        navigate(`/recipes/${result.dish_id}`); // Navigate to new recipe page
      } else {
        const error = await response.json();
        alert("Failed to add recipe: " + (error.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Error submitting recipe:", err);
      alert("An error occurred while adding the recipe.");
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 tagesschrift-regular">Add New Recipe</h2>
      <form onSubmit={handleSubmit}>

        {/* Recipe Name */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Recipe Name</h5></div>
          <div className="card-body">
            <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
          </div>
        </div>

        {/* Image Upload */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Image</h5></div>
          <div className="card-body">
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(event) => setImageFile(event.target.files[0])}
            />
          </div>
        </div>

        {/* Category Selection */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Category</h5></div>
          <div className="card-body">
            <select className="form-select" name="category_id" value={form.category_id} onChange={handleChange} required>
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category.id} value={category.id}>{category.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Times and Servings */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Prep, Cook Time & Servings</h5></div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-4 mb-3">
                <label>Prep Time (min)</label>
                <input type="number" className="form-control" name="prep_time" value={form.prep_time} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Cook Time (min)</label>
                <input type="number" className="form-control" name="cook_time" value={form.cook_time} onChange={handleChange} />
              </div>
              <div className="col-md-4 mb-3">
                <label>Servings</label>
                <input type="number" className="form-control" name="servings" value={form.servings} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Instructions</h5></div>
          <div className="card-body">
            {/* Render each instruction step with remove button */}
            {form.instructions.map((step, index) => (
              <div className="row mb-3 align-items-center" key={index}>
                <div className="col-12 mb-1">
                  <label className="form-label fw-bold">Step {index + 1}</label>
                </div>
                <div className="col">
                  <input
                    className="form-control"
                    value={step}
                    onChange={event => handleInstructionChange(index, event.target.value)}
                    placeholder="Enter instruction step"
                  />
                </div>
                <div className="col-auto">
                  <button
                    type="button"
                    className="btn btn-outline-danger"
                    onClick={() => removeInstruction(index)}
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
            {/* Button to add new instruction step */}
            <button type="button" className="btn btn-outline-secondary" onClick={addInstruction}>+ Add Step</button>
          </div>
        </div>

        {/* Ingredients */}
        <div className="card mb-4">
          <div className="card-header"><h5 className="mb-0">Ingredients</h5></div>
          <div className="card-body">
            {/* Render each ingredient with remove button */}
            {form.ingredients.map((ingredient, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-4">
                  <input className="form-control" placeholder="Name" value={ingredient.name} onChange={event => handleIngredientChange(index, 'name', event.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Quantity" value={ingredient.quantity} onChange={event => handleIngredientChange(index, 'quantity', event.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Unit" value={ingredient.unit} onChange={event => handleIngredientChange(index, 'unit', event.target.value)} />
                </div>
                <div className="col-md-2 text-md-end">
                  <button type="button" className="btn btn-outline-danger" onClick={() => removeIngredient(index)}>✕</button>
                </div>
              </div>
            ))}
            {/* Button to add new ingredient */}
            <button type="button" className="btn btn-outline-secondary" onClick={addIngredient}>+ Add Ingredient</button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <button type="submit" className="submit-outline-btn">Add Recipe</button>
        </div>
      </form>
    </div>
  );
}

export default NewRecipeForm;
