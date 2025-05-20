// Import required dependencies
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

/**
 * FetchImg component - Versatile component for displaying recipe lists and ingredient lists
 * Handles multiple view types: category lists, ingredient lists, search results, and more
 */
function FetchImg() {
  // Extract URL parameters to determine what data to display
  const { category, name: ingredientName, query: searchQuery } = useParams();
  // State for storing fetched data
  const [data, setData] = useState([]);
  // State for tracking any fetch errors
  const [error, setError] = useState(null);

  // Determine the current view type based on URL parameters
  const isIngredientsView = category && category.toLowerCase() === "ingredients";
  const isIngredientPage = !!ingredientName;
  const isSearchPage = !!searchQuery;

  // Fetch data when component mounts or URL parameters change
  useEffect(() => {
    async function fetchData() {
      try {
        // Determine which API endpoint to use based on the current view
        let url = "http://localhost:4000/api/recipes/simple"; // Default: all recipes

        if (isSearchPage) {
          // Search results view
          url = `http://localhost:4000/api/recipes/search?query=${searchQuery}`;
        } else if (isIngredientsView) {
          // All ingredients list view
          url = "http://localhost:4000/api/recipes/ingredients";
        } else if (isIngredientPage) {
          // Recipes filtered by ingredient view
          url = `http://localhost:4000/api/recipes/by-ingredient/${ingredientName}`;
        } else if (category) {
          // Recipes filtered by category view
          url = `http://localhost:4000/api/recipes/by-category/${category}`;
        }

        // Fetch data from the API
        const res = await fetch(url);
        if (!res.ok) throw new Error("Failed to fetch");

        // Update state with fetched data
        const result = await res.json();
        setData(result);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      }
    }

    fetchData();
  }, [category, ingredientName, searchQuery]); // Re-fetch when these parameters change

  // For ingredients view: group ingredients by first letter
  const grouped = {};
  data.forEach((item) => {
    const firstLetter = item.name?.[0]?.toUpperCase();
    if (firstLetter) {
      if (!grouped[firstLetter]) grouped[firstLetter] = [];
      grouped[firstLetter].push(item);
    }
  });

  // Sort the grouped ingredients alphabetically
  const sortedGroups = Object.keys(grouped)
    .sort()
    .map((letter) => ({
      letter,
      ingredients: grouped[letter].sort((a, b) => a.name.localeCompare(b.name)),
    }));

  // Render recipe cards for non-ingredient views
  const renderRecipes = data.map((recipe, i) => (
    <div className="col-md-6 mb-4" key={i}>
      <Link
        to={`/recipes/${recipe.id}`}
        className="text-decoration-none text-dark"
        style={{ textDecoration: "none" }}
      >
        <div className="card h-100">
          {recipe.image_url && (
            <img
              src={`http://localhost:4000${recipe.image_url}`}
              className="card-img-top"
              alt={recipe.name}
              style={{ height: "200px", objectFit: "cover" }}
            />
          )}
          <div className="card-body">
            <h5 className="card-title">{recipe.name}</h5>
          </div>
        </div>
      </Link>
    </div>
  ));

  // Determine page title based on current view
  const pageTitle = isIngredientsView
    ? "Ingredients"
    : isIngredientPage
    ? `Recipes with ${ingredientName}`
    : isSearchPage
    ? `Search results for "${searchQuery}"`
    : category
    ? `${category} Recipes`
    : "Recipe List";

  return (
    <div className="container mt-4">
      {/* Page title */}
      <h1 className="headerTitle">{pageTitle}</h1>

      {/* Error message if fetch failed */}
      {error && <p className="text-danger">Error: {error}</p>}

      {/* Conditional rendering based on view type */}
      {isIngredientsView ? (
        // Ingredients view: alphabetical list grouped by first letter
        <div className="ingredient-groups">
          {sortedGroups.map((group) => (
            <div className="ingredient-section mb-4" key={group.letter}>
              <h3 className="ingredient-letter">{group.letter}</h3>
              <ul className="ingredient-list list-unstyled">
                {group.ingredients.map((ing, i) => (
                  <li key={i} className="ingredient-item">
                    <Link to={`/ingredient/${encodeURIComponent(ing.name)}`}>
                      {ing.name.charAt(0).toUpperCase() + ing.name.slice(1)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        // Recipe view: grid of recipe cards
        <div className="row">{renderRecipes}</div>
      )}

      {/* Message when no results are found */}
      {!data.length && !isIngredientsView && !error && (
        <p>No results found for this view.</p>
      )}
    </div>
  );
}

export default FetchImg;
