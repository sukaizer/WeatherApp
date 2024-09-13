import React from 'react';
import './footer.css';
import git from '../../assets/git.svg';

// Footer component, logout and github link
const Footer = (loginProps) => {
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    loginProps.onLogin(false);
  }

  return (
    <div className='footer'>
      <button className="game--btn footer1" onClick={logout}>Log out</button>
      <a href='https://github.com/sukaizer' target="_blank" rel='noreferrer' className="game--btn footer2">
        <img src={git} alt="git" />
      </a>
    </div>
    
  );
};

export default Footer;