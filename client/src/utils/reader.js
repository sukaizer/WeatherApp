/*
    function toString(obj)
    @param obj: object from the weatherJsonReader function
    @return: string of the weather information
    This function takes in the json object from the weather api and returns a string of the weather information.
    The string is formatted as follows:
    The weather in {city} at {time} is {weather} with a temperature of {temperature}°C.
*/
export function toString(obj) {
  const timeString = obj.time;
  const weatherString = obj.weather;
  const temperatureString = obj.temperature;
  const cityString = obj.city;
  //const rain = obj.rain; precipitation
  //const humidity = obj.humidity;
  const finalString = `The weather in ${cityString} today on ${timeString} is ${weatherString} with a minimum temperature of ${temperatureString.min}°C and maximum of ${temperatureString.max}°C.`;

  return finalString;
}

export function weatherJsonReader(json, city = "") {
  console.log(json);
  const weather = json;
  const timeString = formatUnixTime(weather.daily[0].dt); //this is the time at 12:00 / midday
  const weatherString = weather.daily[0].weather[0].description;
  const temperature = weather.daily[0].temp;
  const cityString = city ? `${city}` : "";
  const rain = weather.daily[0].rain ? weather.daily[0].rain : 0;
  const humidity = weather.daily[0].humidity;
  const weatherObj = {
    time: timeString, //string
    weather: weatherString, //string
    temperature: temperature, //object
    city: cityString, //string
    rain: rain, //number
    humidity: humidity, //number
  };
  console.log(weatherObj);
  return weatherObj;
}

/*
    function formatUnixTime(unixTime)
    @param unixTime: unix time in seconds
    @return: string of the formatted time
    This function takes in a unix time in seconds and returns a string of the formatted time.
    The string is formatted as follows:
    {hour}:{minutes}, {day} {month} {year}
    Example: 12:00, 1 January 1970
*/
export function formatUnixTime(unixTime, hour = false) {
  const date = new Date(unixTime * 1000);
  const year = date.getFullYear();
  const month = date.toLocaleString("default", { month: "long" });
  const day = date.getDate();
  if (hour) {
    const hour = date.getHours();
    const minutes = date.getMinutes();
    return `${hour}:${
      minutes < 10 ? "0" + minutes : minutes
    }, ${day} ${month} ${year}`;
  } else {
    return `${day} ${month} ${year}`;
  }
}
