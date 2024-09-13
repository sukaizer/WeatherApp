const maxScoreCompute = (temperature, weather) => {
  if (temperature === 'cold') {
    if (weather === 'snow') {
      return 10;
    } else if (weather === 'rain') {
      return 10;
    } else if (weather === 'sun') {
      return 10;
    } else {
      return 8;
    }
  } else if (temperature === 'normal') {
    if (weather === 'snow') {
      return 10;
    } else if (weather === 'rain') {
      return 10;
    } else if (weather === 'sun') {
      return 10;
    } else {
      return 8;
    }
  } else {
    if (weather === 'snow') {
      return 8;
    } else if (weather === 'rain') {
      return 8;
    } else if (weather === 'sun') {
      return 8;
    } else {
      return 6;
    }
  }
}

const clothingScores = {
  tshirt: { cold: 0, normal: 1, hot: 2 },
  longsleeve: { cold: 1, normal: 2, hot: 1 },
  sweater: { cold: 2, normal: 1, hot: 0 },    
  jeans: { cold: 1, normal: 2, hot: 1 },
  shorts: { cold: 1, normal: 1 , hot: 2 },
  pants: { cold: 2, normal: 1, hot: 0 },
  boots: { conditions: ['snow','rain'] },
  shoes: { cold: 1, normal: 2, hot: 1 },
  slippers: { cold: 0, normal: 1, hot: 2},
  cap: { conditions: ['sun'] },
  beanie: { conditions: ['snow'] },
  umbrella: { conditions: ['rain'] },
  coat: { cold: 2, normal: 1, hot: -1},
  jacket: { cold: 1, normal: 2, hot: -1 },
};

const categorizeTemperature = (temperature) => {
  if (temperature < 9) {
    return 'cold';
  } else if (temperature >= 9 && temperature <= 19) {
    return 'normal';
  } else {
    return 'hot';
  }
}

export const computeScore = (temperature, weather, clothing) => {
  console.log(temperature, weather, clothing);
  const temperatureCategory = categorizeTemperature(temperature);
  let score = 0;
  const maxScore = maxScoreCompute(temperatureCategory, weather);

  clothing.forEach((item) => {
    if (clothingScores[item].hasOwnProperty('conditions')) {
      const conditions = clothingScores[item].conditions;
      if (conditions.includes(weather)) {
        score += 2;
      }
    }
    const itemScore = clothingScores[item].hasOwnProperty(temperatureCategory) ? clothingScores[item][temperatureCategory] : 0;
    score += itemScore;
  });
  score = Math.round((score / maxScore) * 100);
  
  let scoreMessage = '';
  if (score <= 30) {
    if (temperatureCategory === 'cold') {
      scoreMessage = 'Your score is very low, think about coats, sweaters and heat pants.';
    } else if (temperatureCategory === 'normal') {
      scoreMessage = 'Your score is very low, think about jackets, longsleeves and jeans.';
    } else {
      scoreMessage = 'Your score is very low, think about tshirts, shorts and slippers. Do not forget to wear a cap if it is sunny !';
    }
  } else if (score <= 65) {
    if (temperatureCategory === 'cold') {
      scoreMessage = 'Your score is average, but there is room for improvement ! You want to dress up with winter clothes in this cold weather.';
    } else if (temperatureCategory === 'normal') {
      scoreMessage = 'Your score is average, but there is room for improvement ! You want to dress up with clothes that are not too cold or hot in this weather.';
    } else {
      scoreMessage = 'Your score is average, but there is room for improvement ! You want to dress up with summer clothes in this hot weather.';
    }
  } else if (score <= 99) {
      scoreMessage = 'Your score is very good, keep going !';    
  } else if (score === 100){
    scoreMessage = 'Excellent score, your clothing choices are perfect!';
  }

  return { score, scoreMessage };
}
