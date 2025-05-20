// Import required dependencies
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pluralize from 'pluralize'; // For normalizing ingredient names

/**
  EditRecipeForm component - Form for editing existing recipes
  Allows users to modify all aspects of a recipe including name, image, category,
  preparation details, instructions, and ingredients
 */
const EditRecipeForm = () => {
  // Get recipe ID from URL parameters
  const { id } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State for recipe categories (loaded from API)
  const [categories, setCategories] = useState([]);
  // State for new image file upload
  const [imageFile, setImageFile] = useState(null);

  // State for form data with default empty values
  const [form, setForm] = useState({
    name: '',
    category_id: '',
    image_filename: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    instructions: [''],
    ingredients: []
  });

  // Load categories and recipe data when component mounts
  useEffect(() => {
    // Fetch available recipe categories
    fetch('http://localhost:4000/api/recipes/categories')
      .then(res => res.json())
      .then(setCategories)
      .catch(err => console.error('Failed to load categories', err));

    // Fetch current recipe data
    fetch(`http://localhost:4000/api/recipes/${id}`)
      .then(res => res.json())
      .then(data => {
        // Format recipe data for the form
        setForm({
          name: data.name,
          category_id: data.category_id || '',
          image_filename: data.image_url?.split('/').pop() || '',
          prep_time: data.prep_time || '',
          cook_time: data.cook_time || '',
          servings: data.servings || '',
          // Remove "Step X:" prefix from instructions
          instructions: (data.instructions || ['']).map(step =>
            step.replace(/^Step\s*\d+:\s*/i, '')
          ),
          // Format ingredients for the form
          ingredients: data.ingredients.map(ing => ({
            name: ing.name,
            quantity: ing.quantity,
            unit_id: ing.unit || ''
          }))
        });
      })
      .catch(err => console.error('Failed to load recipe', err));
  }, [id]);

  /**
   * Handle changes to basic form fields
   */
  const handleChange = (event) => {
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
   * Handle changes to ingredient fields
   */
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...form.ingredients];
    updatedIngredients[index][field] = value;
    setForm(prev => ({ ...prev, ingredients: updatedIngredients }));
  };

  /**
   * Add a new empty ingredient
   */
  const addIngredient = () => {
    setForm(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, { name: '', quantity: '', unit_id: '' }]
    }));
  };

   /*  
     Remove an ingredient
   */
  const removeIngredient = (index) => {
    const updated = [...form.ingredients];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, ingredients: updated }));
  };

  /*
   * Handle form submission
   */
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Clean and validate instruction steps
    const cleanedInstructions = form.instructions.map(step => step.trim()).filter(Boolean);

    // Validate required fields
    if (!form.name || !form.category_id || cleanedInstructions.length === 0 || form.ingredients.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    // Format data for submission
    const cleanedForm = {
      ...form,
        instructions: cleanedInstructions,
      // Normalize ingredient names (singular form, lowercase)
      ingredients: form.ingredients.map(ing => ({
        name: pluralize.singular(ing.name.trim().toLowerCase()),
        quantity: ing.quantity,
        unit_id: ing.unit_id
      }))
    };

    // Create FormData object for file upload
    const formData = new FormData();
    formData.append('name', cleanedForm.name);
    formData.append('category_id', cleanedForm.category_id);
    formData.append('prep_time', cleanedForm.prep_time);
    formData.append('cook_time', cleanedForm.cook_time);
    formData.append('servings', cleanedForm.servings);
    formData.append('instructions', JSON.stringify(cleanedForm.instructions));
    formData.append('ingredients', JSON.stringify(cleanedForm.ingredients));
    formData.append('image_filename', form.image_filename);
    if (imageFile) formData.append('image', imageFile);

    try {
      // Send PUT request to update the recipe
      const response = await fetch(`http://localhost:4000/api/recipes/${id}`, {
        method: 'PUT',
        body: formData
      });

      // Handle response
      if (response.ok) {
        alert('Recipe updated successfully!');
        navigate(`/recipes/${id}`); // Navigate to recipe detail page
      } else {
        const err = await response.json();
        alert(`Error: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      alert('Failed to connect to the server.');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4 tagesschrift-regular">Edit Recipe</h2>
      <form onSubmit={handleSubmit} >

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
            {/* Show current image if available */}
            {form.image_filename && (
              <div className="text-center mb-3">
                <img
                  src={`http://localhost:4000/imgs/${form.image_filename}`}
                  alt="Current"
                  className="img-fluid rounded"
                  style={{ maxWidth: '200px', maxHeight: '150px', objectFit: 'cover' }}
                />
              </div>
            )}
            {/* File input for new image */}
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
            {form.ingredients.map((ing, index) => (
              <div className="row mb-2" key={index}>
                <div className="col-md-4">
                  <input className="form-control" placeholder="Name" value={ing.name} onChange={event => handleIngredientChange(index, 'name', event.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Quantity" value={ing.quantity} onChange={event => handleIngredientChange(index, 'quantity', event.target.value)} />
                </div>
                <div className="col-md-3">
                  <input className="form-control" placeholder="Unit" value={ing.unit_id} onChange={event => handleIngredientChange(index, 'unit_id', event.target.value)} />
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
          <button type="submit" className="submit-outline-btn">Save Changes</button>
        </div>
      </form>
    </div>
  );
};

export default EditRecipeForm;
