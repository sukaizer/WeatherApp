import React, {useEffect, useState} from 'react';
import './game.css';
import axios from 'axios';
import MainGame from "./../../components/mainGame/MainGame";
import * as reader from '../../utils/reader';
import * as scoreCompute from '../../utils/scoreCompute';
import { images } from './import';
import { clothes } from './import';


// API KEYS
const apiKeyWeather = process.env.REACT_APP_WEATHER_WEATHER_KEY
const apiKeyGeoloc = process.env.REACT_APP_WEATHER_GEOLOC_KEY

// Game component, all the views are here
const Game = () => {

  // STATES
  const [data, setData] = useState(null); // Weather data (js object)
  const [sampleText, setSampleText] = useState(null); // Sample text for weather of the weather
  const [inputValue, setInputValue] = useState(''); // Input value for city
  const [city, setCity] = useState(''); // City name
  const [weatherImage, setWeatherImage] = useState(null); // Weather image
  const [weatherCategory, setWeatherCategory] = useState(null); // Weather category
  const [gameState, setGameState] = useState('introduction'); // Game state
  const [character, setCharacter] = useState(null); // Character image
  const [highlight, setHighlight] = useState(false); // Highlight image
  const [clothesList, setClothesList] = useState([ // List of clothes, false means picked up 
    { id: 'tshirt', type: 'top' , image: clothes.tshirt , pickable: true , left: '', top: ''},
    { id: 'longsleeve', type: 'top' , image: clothes.longsleeve , pickable: true , left: '', top: ''},
    { id: 'sweater', type: 'top' , image: clothes.sweater , pickable: true , left: '', top: '' },
    { id: 'jeans', type: 'bottom' , image: clothes.jeans , pickable: true , left: '', top: '' },
    { id: 'shorts', type: 'bottom' , image: clothes.shorts , pickable: true , left: '', top: '' },
    { id: 'pants', type: 'bottom' , image: clothes.pants , pickable: true , left: '', top: '' },
    { id: 'shoes', type: 'footwear' , image: clothes.shoes , pickable: true , left: '', top: '' },
    { id: 'slippers', type: 'footwear' , image: clothes.slippers , pickable: true , left: '', top: '' },
    { id: 'boots', type: 'footwear' , image: clothes.boots , pickable: true , left: '', top: '' },
    { id: 'beanie', type: 'headwear' , image: clothes.beanie , pickable: true , left: '', top: '' },
    { id: 'cap', type: 'headwear' , image: clothes.cap , pickable: true , left: '', top: '' },
    { id: 'umbrella', type: 'accessories' , image: clothes.umbrella , pickable: true , left: '', top: '' },
    { id: 'jacket', type: 'outwear' , image: clothes.jacket , pickable: true , left: '', top: '' },
    { id: 'coat', type: 'outwear' , image: clothes.coat , pickable: true , left: '', top: '' }
  ]);
  const [pickedClothes, setPickedClothes] = useState(null);
  const [score, setScore] = useState(0);

  useEffect(() => {
    //console.log("picking");
    const pickedClothes = clothesList
      .filter(cloth => cloth.pickable === false) // Get only the clothes that are picked up
      .map(cloth => cloth.id); // Get only the 'id' of these clothes
  
    setPickedClothes(pickedClothes); // Update the state with the new list
  }, [clothesList]);

  // Use useEffect to call postScore when gameState changes to 'results'
  useEffect(() => {
    if (gameState === 'results') {
      const timer = setTimeout(() => {
        postScore();
      }, 1000);
      return () => clearTimeout(timer); // Clean up on unmount
    }
  }, [gameState]);

  // HANDLERS
  const handleInputChange = (event) => {
  setInputValue(event.target.value);
  };
  
  const gameButton = () => {
    setGameState('weather');
    setSampleText(reader.toString(data));
    weatherImageHandler();
  }

  const setFinalScore = async () => {
    const finalScore = scoreCompute.computeScore(data.temperature.day, weatherCategory, pickedClothes);
    setScore(finalScore);
    setGameState('results');
  }

  // Set weather image
  const weatherImageHandler = () => {
    const rain = ['rain', 'drizzle', 'thunderstorm', 'squall', 'tornado'];
    const cloud = ['clouds', 'cloudy'];
    const sun = ['clear', 'sunny'];
    const snow = ['snow', 'snowy'];

    if (rain.some(value =>
      data.weather.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.rainImage);
      setWeatherCategory('rain');
    } else if (cloud.some(value =>
      data.weather.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.cloudImage);
      setWeatherCategory('clouds');
    } else if (sun.some(value =>
      data.weather.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.sunImage);
      setWeatherCategory('sun');
    } else if (snow.some(value =>
      data.weather.toLowerCase().includes(value)
    )) {
      setWeatherImage(images.snowImage);
      setWeatherCategory('snow');
    } else {
      setWeatherImage(null);
    }
  }

  const setCharacterGame = (character) => {
    setCharacter(character);
    setGameState('main-game');
  }

  // Component for displaying characters images
  const CharactersImages = () => {
    return (
      <div className='site__main'>
        <div className='game--selection--boys'>
          <img className='game--selection--boys--image' src={images.boys1} onClick={() => setCharacterGame("boys1")} alt="boys1" />
          <img className='game--selection--boys--image' src={images.boys2} onClick={() => setCharacterGame("boys2")} alt="boys2" />
          <img className='game--selection--boys--image' src={images.boys3} onClick={() => setCharacterGame("boys3")} alt="boys3" />
        </div>
        <div className='game--selection--girls'>
          <img className='game--selection--girls--image' src={images.girls1} onClick={() => setCharacterGame("girls1")} alt="girls1" />
          <img className='game--selection--girls--image' src={images.girls2} onClick={() => setCharacterGame("girls2")} alt="girls2" />
          <img className='game--selection--girls--image' src={images.girls3} onClick={() => setCharacterGame("girls3")} alt="girls3" />
        </div>
      </div>
    )
  }

  /**
   * Fetches weather data for a given city using Geoapify and OpenWeatherMap APIs.
   * @returns {void}
   */
  const fetchData = () => {
    var city = inputValue;
    const part = 'minutely,hourly,alerts';

    // Get city coordinates, first call of Geoapify API
    // limit = 10 -> 10 most popular results
    axios.get(`https://api.geoapify.com/v1/geocode/search?text=${city}&lang=en&limit=10&type=city&apiKey=${apiKeyGeoloc}`)
      .then(response => {
        console.log(response.data);
        if (response.data.features.length === 0) {
          alert('City not found ! There might be a typo in the city name.');
          setInputValue('');
          return;
        }
        const lon = response.data.features[0].geometry.coordinates[0];
        const lat = response.data.features[0].geometry.coordinates[1];
        city = response.data.features[0].properties.city;
        setCity(city);
        console.log(response.data);
        console.log(`City: ${city}, Latitude: ${lat}, Longitude: ${lon}`);

        // Get weather data, second call of OpenWeatherMap API
        axios.get(`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&lang=en&units=metric&exclude=${part}&appid=${apiKeyWeather}`)
        .then(response => {
          setData(reader.weatherJsonReader(response.data, city));
        })
        .catch(error => {
          console.error(error);
        });
    })
    .catch(error => {
        console.error(error);
    });
  }

  const postScore = async () => {
    const username = localStorage.getItem("username");
    console.log(username);
    try {
      const response = await axios.post('/api/score', { username : username , time : Date.now(), city : city, minTemperature : data.temperature.min, maxTemperature : data.temperature.max, weatherType : weatherCategory, clothes : pickedClothes, score : score.score, scoreMessage : score.scoreMessage });
      if (response.status === 200) {
        console.log('Score posted successfully!');
      } else {
        console.log('Score post failed!');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='game--container'>
      {
        gameState === 'introduction' &&
        <div className='game--intro'>
          <h2>Welcome {localStorage.getItem('username')} !</h2>
          <h3>Please pick a city</h3>
            <form className="game--form">
              <div>
                  <input type="text" className="game--form__field" placeholder="Enter City" value={inputValue} onChange={handleInputChange} />
                  <button type="button" className="game--btn" onClick={fetchData}>Change city !</button>
              </div>
            </form>
            <div className='game--maps-icon'>
              <img src={images.mapsImage} alt="Maps" />
            </div>
          {
            city !== '' && data !== null &&
            <>
              <div className='game--intro--weather'> 
                You are now in  <span onClick={() => gameButton()} className='game--city'>{city}</span>
                {/* <button className="game--btn__play" onClick={() => gameButton()}>PLAY</button> */}
              </div>
              
            </>
          }
        </div>
      }

      {
        gameState === 'weather' &&       
        <div className='game--weather'>
          <div className='game--main--row1'>
            <h2>Playing in {city}</h2>
            <img className='game--hint-image' draggable='false' src={weatherImage} alt="weaterHint" />
            <p> {'↓ ' + data.temperature.min + '℃ ↑ ' + data.temperature.max + '℃'}</p>
          </div>
            <p className='game--hint'>Hint : {sampleText}</p>
            <p className='game--hint--helper'>Remember to dress appropriately for the weather.</p>
            <p className='game--hint--helper'>Choose your outfit wisely to stay comfortable.</p>
            <button className="game--btn" onClick={() => setGameState('character-selection')}>Start Dressing !</button>
        </div>
      }

      {
        gameState === 'character-selection' &&
        <div className='game--character'>
          <h2>Choose your character</h2>
          <CharactersImages></CharactersImages>
        </div>
      }

      {
        gameState === 'main-game' && 
        <div className='game--main'>
          <div className='game--main--row1'>
            <h2>Playing in {city}</h2>
            <img className='game--hint-image' draggable='false' src={weatherImage} alt="weaterHint" />
            <p> {'↓ ' + data.temperature.min + '℃ ↑ ' + data.temperature.max + '℃'}</p>
          </div>
          <div id='gameArea' className='game--main--center'>
            <div className={`game--main--character--dropzone ${highlight ? 'game--main--highlighted' : ''}`} id='characterDropzone'>
              <img className='game--main--character' draggable='false' src={images[character]} alt="character"/>
            </div>
            <MainGame setHighlight={setHighlight} clothesList={clothesList} pickedClothes={pickedClothes} setClothesList={setClothesList} setScore={setFinalScore}></MainGame>
          </div>
        </div>
      }

      {
        gameState === 'results' &&
        <div>
            <div className='game--main--row1'>
              <h2>Playing in {city}</h2>
              <img className='game--hint-image' draggable='false' src={weatherImage} alt="weaterHint" />
              <p> {'↓ ' + data.temperature.min + '℃ ↑ ' + data.temperature.max + '℃'}</p>
            </div>
          <div className='game--results'>
            <h3>You scored {score.score} % !</h3>
            <p> {score.scoreMessage}</p>
          </div>
        </div>
      }

    </div>
  );
};

export default Game;
