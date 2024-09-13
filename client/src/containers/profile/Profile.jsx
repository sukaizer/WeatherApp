import React, { useState, useEffect } from 'react';
import './profile.css';
import GameSummary from '../../components/gameSummary/GameSummary';
import { images } from '../../containers/game/import';
import { clothes } from '../../containers/game/import';

// Profile component, display the user's games
const Profile = (props) => {
  const [selectedGame, setSelectedGame] = useState(null);
  const [weatherImage, setWeatherImage] = useState(null); // Weather image

  const handleGameClick = (game) => {
    setSelectedGame(game);
  };

  // Set weather image
  const weatherImageHandler = () => {
    const rain = ['rain', 'drizzle', 'thunderstorm', 'squall', 'tornado'];
    const cloud = ['clouds', 'cloudy'];
    const sun = ['clear', 'sunny'];
    const snow = ['snow', 'snowy'];

    if (rain.some(value =>
      selectedGame.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.rainImage);
    } else if (cloud.some(value =>
      selectedGame.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.cloudImage);
    } else if (sun.some(value =>
      selectedGame.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.sunImage);
    } else if (snow.some(value =>
      selectedGame.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.snowImage);
    } else {
      setWeatherImage(null);
    }
  }

  useEffect(() => {
    try {
      weatherImageHandler();
    } catch (error) {}
  }, [selectedGame]);

  return (
    <div className='profile--container'>
      <div className='profile--desc'>Hi {localStorage.getItem('username')} click on a square to get more details</div>
      <div className='profile--content'>
        <div className='profile__games'>
          {props.userData && props.userData.slice().reverse().map((game, index) => <GameSummary key={index} game={game} onGameClick={() => handleGameClick(game)} isSelected={game === selectedGame ? true : false}/>)}
        </div>
        <div className='profile__stats'>
          {selectedGame ? (
            <>
              <div className='profile__stats--content'>
                <h2>{selectedGame.city}</h2>
                <img src={weatherImage} />
                <p> {'↓ ' + selectedGame.minTemperature + '℃ ↑ ' + selectedGame.maxTemperature + '℃'}</p>
              </div>
              <div className='profile__stats--description'>
                <p> You scored {selectedGame.score} %</p>
                <p> {selectedGame.scoreMessage} </p>
                <div>
                  This is what you chose to wear:
                  <div className='profile__stats--clothes'>
                    {JSON.parse(selectedGame.clothes).map(cloth => {
                      return (
                        <div key={cloth}>
                          <img src={clothes[cloth]} />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            </>
          ) : (
            'Select a game to see its details'
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
