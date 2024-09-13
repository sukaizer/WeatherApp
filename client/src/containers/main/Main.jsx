import React, { useState, useEffect } from 'react';
import './main.css';
import Login from "./../../components/login/Login";
import Profile from "./../profile/Profile";
import Game from "./../game/Game";

// main component, handles the views of the application
const Main = ({ content, isLoggedIn, onLogin }) => {
  // Child component used to display the main content of the application whether it is the home page, the game page or the profile page
  const MainContent = ({content}) => {
    const [data, setData] = useState(null);

    useEffect(() => {
      if (isLoggedIn) {
        fetch(`/api/scores/${localStorage.getItem("username")}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          setData(data);
        })
        .catch(error => {
          console.error('There has been a problem with your fetch operation:', error);
        });
      }
    }, [content]);

    return (
      <div className='site__main'>
        {
          content === "Game" && <Game />
        }
        {
          content === "Profile" && <Profile userData={data}/>
        }
      </div>
    )
  }

  return (
    <div>
      {isLoggedIn ? <MainContent content = {content}/> : <Login onLogin={onLogin} />}
    </div>
  );
}

export default Main;
