import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TitleBar from './components/TitleBar';
import FetchImg from './components/FetchImage';
import RecipeDetail from './components/RecipeDetail'; // your detailed view
import NewRecipeForm from './components/NewRecipeForm';
import EditRecipeForm from './components/EditRecipeForm';
import './style.css';

function App() {
  return (
    <Router>
      <div className="container">
        <TitleBar />
        <Routes>
          <Route path="/search/:query" element={<FetchImg />} />
          <Route path="/edit-recipe/:id" element={<EditRecipeForm />} />
          <Route path="/add-recipe" element={<NewRecipeForm />} />
          <Route path="/category/:category" element={<FetchImg />} />
          <Route path="/" element={<FetchImg />} />
          <Route path="/category/:category" element={<FetchImg />} />
          <Route path="/ingredient/:name" element={<FetchImg />} />
          <Route path="/recipes/:id" element={<RecipeDetail />} />
          <Route path="/add-recipe" element={<NewRecipeForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

