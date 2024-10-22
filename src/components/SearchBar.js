import React, { useState } from 'react';


const SearchBar = ({ searchText }) => {
  const [query, setQuery] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  
  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setIsButtonEnabled(value.length > 0); 
    searchText(value);
  };

  const handleCancelClick = () => {
    setQuery(''); 
    setIsButtonEnabled(false); 
    searchText(''); 
  };

  return (
    <nav className="navbar">
      <form className="search-form">
        <input 
          className="search-input" 
          type="search" 
          placeholder="Search" 
          aria-label="Search" 
          value={query}
          onChange={handleInputChange} 
        />
        <button 
          className={`search-button ${!isButtonEnabled ? 'inactive' : ''}`} 
          type="button" 
          onClick={handleCancelClick}
          disabled={!isButtonEnabled} 
        >
          Cancel
        </button>
      </form>
    </nav>
  );
};

export default SearchBar;
