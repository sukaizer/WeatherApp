import React from 'react';
import './header.css';
import weatherImage from '../../assets/weather.png';

// Header component, display the title and the toggle buttons
const Header = (headerProps) => {
  const selector = ["Game", "Profile"];

  // Child component used to display the toggle buttons to switch between the home page, the game page and the profile page
  const ToggleButtons = () => {
    return (
      selector.map(selection => (
            <button 
              key={selection}
              className={`site__header-button site__header-button-${headerProps.content===selection ? "active" : "inactive"}`}
              onClick={() => {
                headerProps.changeContent(selection);
              }
              }>{ selection }</button>
          ))
    );
  };

  return (
    <div className='header'>
      <div className='header-content'>
        <p className='header--title'>Dress up !</p>
        <div className='header--center-buttons'>
          {headerProps.isLoggedIn && <ToggleButtons />}
        </div>
      </div>
      <div style={{ backgroundImage: `url(${weatherImage})` }} className="header--background-image"></div>
    </div>
  );
}

export default Header;
