
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';



const RecipeDetail = () => {
  // Get recipe ID from URL parameters
  const { id } = useParams();
  // Hook for programmatic navigation
  const navigate = useNavigate();

  // State to store recipe data with default empty values
  const [recipe, setRecipe] = useState({
    name: '',
    image_url: '',
    prep_time: '',
    cook_time: '',
    servings: '',
    instructions: [],
    ingredients: []
  });

  // Fetch recipe data when component mounts or ID changes
  useEffect(() => {
    fetch(`http://localhost:4000/api/recipes/${id}`)
      .then(res => res.ok ? res.json() : Promise.reject("Not found"))
      .then(setRecipe)
      .catch(console.error);
  }, [id]);

  /**
   * Handle recipe deletion with confirmation
   */
  const handleDelete = async () => {
    // Show confirmation dialog before deleting
    const confirmed = window.confirm("Are you sure you want to delete this recipe?");
    if (!confirmed) return;

    // Send delete request to API
    const res = await fetch(`http://localhost:4000/api/recipes/${id}`, {
      method: 'DELETE'
    });

    // Handle response
    if (res.ok) {
      alert("Recipe deleted.");
      navigate('/'); // Return to home page after deletion
    } else {
      alert("Failed to delete recipe.");
    }
  };

  /**
   * Navigate to edit page for this recipe
   */
  const handleEdit = () => {
    navigate(`/edit-recipe/${id}`);
  };

  return (
    <div className="container recipe-detail mt-4 pb-5">
      {/* Recipe title */}
      <h1 className="headerTitle">{recipe.name}</h1>

      {/* Recipe image - only shown if available */}
      {recipe.image_url && (
        <div className="image-wrapper text-center mb-4">
          <img
            src={`http://localhost:4000${recipe.image_url}`}
            alt={recipe.name}
            className="img-fluid rounded"
          />
        </div>
      )}

      {/* Recipe metadata - prep time, cook time, servings */}
      <div className="row text-center metadata mb-4">
        <div className="col-md-4 mb-2">
          <strong>Prep Time:</strong> {recipe.prep_time || 'N/A'} mins
        </div>
        <div className="col-md-4 mb-2">
          <strong>Cook Time:</strong> {recipe.cook_time || 'N/A'} mins
        </div>
        <div className="col-md-4 mb-2">
          <strong>Servings:</strong> {recipe.servings || 'N/A'}
        </div>
      </div>

      {/* Ingredients list */}
      <div className="section mb-4">
        <h4>Ingredients</h4>
        <ul className="list-group">
          {recipe.ingredients.map((ingredient, index) => (
            <li className="list-group-item" key={index}>
              {ingredient.quantity} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions list */}
      <div className="section mb-4">
        <h4>Instructions</h4>
        {recipe.instructions?.length > 0 ? (
          <ul className="list-group">
            {recipe.instructions.map((step, index) => (
              <li className="list-group-item" key={index}>
                <strong>Step {index + 1}:</strong> {step}
              </li>
            ))}
          </ul>
        ) : (
          <p>No instructions available.</p>
        )}
      </div>

      {/* Edit and Delete buttons */}
      <div className="text-center mt-4 d-flex justify-content-center gap-3">
        <button className="btn editbtn px-4" onClick={handleEdit}>
          Edit
        </button>
        <button className="btn deletebtn px-4" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default RecipeDetail;
