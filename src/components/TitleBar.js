import React from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from '../Logo Image.jpg';
import Hamburger from 'hamburger-react'; // For mobile menu hamburger icon
import { Link } from 'react-router-dom';
import pluralize from 'pluralize'; // For normalizing search terms

function TitleBar() {
  // State for mobile menu open/closed status
  const [isOpen, setOpen] = React.useState(false);
  // State for search input value
  const [searchTerm, setSearchTerm] = React.useState('');
  // Hook for programmatic navigation
  const navigate = useNavigate();

  /**
   * Handle search form submission
   * Normalizes search term and navigates to search results page
   */
  function handleSearch() {
    // Convert search term to singular form, trim whitespace, and convert to lowercase
    const normalized = pluralize.singular(searchTerm.trim().toLowerCase());
    if (normalized !== '') {
      // Navigate to search results page with encoded search term
      navigate(`/search/${encodeURIComponent(normalized)}`);
      // Clear search input after search
      setSearchTerm('');
    }
  }

  return (
    <nav className="navbar-fixed-top">
      <div className="container-fluid">
        <div className="row align-items-center border-bottom shadow-sm bg-white position-relative">

          {/* Mobile hamburger menu - only visible on small screens */}
          <div className="col-3 col-md-2 d-lg-none hamburger-wrapper">
            <div className="hamburger-scaler">
              <Hamburger
                toggled={isOpen}
                toggle={setOpen}
                color="orange"
                aria-expanded={isOpen}
                aria-controls="mobile-nav"
              />
            </div>
          </div>

          {/* Logo - links to homepage */}
          <div className="col-6 col-md-2 col-lg-2 logoImage">
            <Link to="/">
              <img src={Logo} className="img-fluid" alt="Logo" />
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="col-md-6 col-lg-8 searchBar d-md-block d-none">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search recipes..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') handleSearch();
                }}
                aria-label="Search"
              />
              <span
                className="input-group-text"
                style={{ cursor: 'pointer' }}
                onClick={handleSearch}
              >
                <i className="bi bi-search"></i>
              </span>
            </div>
          </div>

          {/* Social media icons */}
          <div className="col-3 col-md-2 col-lg-2 Icons">
            <a href="#"><i className="bi bi-github webIcon"></i></a>
            <a href="#"><i className="bi bi-linkedin webIcon"></i></a>
          </div>

          {/* Desktop navigation menu - hidden on mobile */}
          <div className="row bottomNav d-lg-block d-none">
            <div className="col-12">
              <Link to="/category/Breakfast">Breakfast</Link>
              <Link to="/category/Entree">Entree</Link>
              <Link to="/category/Snacks">Snacks</Link>
              <Link to="/category/Desserts">Desserts</Link>
              <Link to="/category/Drinks">Drinks</Link>
              <Link to="/category/Ingredients" className="ingredients-link">Ingredients</Link>
              <Link to="/add-recipe">Add Recipe</Link>
            </div>
          </div>

          {/* Mobile navigation menu - only shown when hamburger is clicked */}
          {isOpen && (
            <div id="mobile-nav" className="mobile-menu-fullwidth px-3 py-2">
              {/* Search bar at top of mobile nav */}
              <div className="mobile-search mb-3">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search recipes..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSearch();
                        setOpen(false); // Close menu after search
                      }
                    }}
                    aria-label="Search"
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      handleSearch();
                      setOpen(false); // Close menu after search
                    }}
                  >
                    <i className="bi bi-search"></i>
                  </span>
                </div>
              </div>

              {/* Mobile navigation links - each closes the menu when clicked */}
              <Link to="/category/Breakfast" onClick={() => setOpen(false)}>Breakfast</Link>
              <Link to="/category/Entree" onClick={() => setOpen(false)}>Entree</Link>
              <Link to="/category/Snacks" onClick={() => setOpen(false)}>Snacks</Link>
              <Link to="/category/Desserts" onClick={() => setOpen(false)}>Desserts</Link>
              <Link to="/category/Drinks" onClick={() => setOpen(false)}>Drinks</Link>
              <Link to="/category/Ingredients" className="ingredients-link" onClick={() => setOpen(false)}>Ingredients</Link>
              <Link to="/add-recipe" onClick={() => setOpen(false)}>Add Recipe</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default TitleBar;
