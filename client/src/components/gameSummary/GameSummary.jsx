import React, {useState, useEffect} from 'react';
import './gameSummary.css';
import * as reader from '../../utils/reader';
import { images } from '../../containers/game/import';

// Pannel for each game
const GameSummary = (props) => {
  const [weatherImage, setWeatherImage] = useState(null); // Weather image
  const [scoreStyle, setScoreStyle] = useState(null); // Score style

  // Set weather image
  const weatherImageHandler = () => {
    const rain = ['rain', 'drizzle', 'thunderstorm', 'squall', 'tornado'];
    const cloud = ['clouds', 'cloudy'];
    const sun = ['clear', 'sunny'];
    const snow = ['snow', 'snowy'];

    if (rain.some(value =>
      props.game.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.rainImage);
    } else if (cloud.some(value =>
      props.game.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.cloudImage);
    } else if (sun.some(value =>
      props.game.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.sunImage);
    } else if (snow.some(value =>
      props.game.weatherType.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.snowImage);
    } else {
      setWeatherImage(null);
    }
  }

  // Set score style
  const scoreStyleHandler = () => {
    if (props.game.score <= 30) {
      setScoreStyle('worst');
    } else if (props.game.score <= 65) {
      setScoreStyle('average');
    } else if (props.game.score <= 99) {
      setScoreStyle('good');
    } else if (props.game.score === 100){
      setScoreStyle('best');
    }
  }

  useEffect(() => {
    weatherImageHandler();
    scoreStyleHandler();
  }, []);

  return (
    <div onClick={props.onGameClick} className={`game__summary ${scoreStyle} ${props.isSelected ? 'game__summary--selected' : ""}`}>
      <div className='game__summary--city'>{props.game.city}</div>
      <div className='game__summary--date'>{reader.formatUnixTime(props.game.time/1000)}</div>
      <div className="game__summary--image">
        <img src={weatherImage} />
      </div>
    </div>
  )
}

export default GameSummary;