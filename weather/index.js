"use strict ";
const axios = require("axios");
const apikey = "c70baf0d17017c73b02836e1a8839975"; // your api key to the api generated by the website

const getWeather = location => {
    return new Promise(async(resolve, reject) => {
        try {
            const weatherConditions = await axios.get('https://api.openweathermap.org/data/2.5/weather',

            {
                params : {
                    q: location,
                    appid: apikey
            }
        });

        resolve(weatherConditions.data) // returns back the results to the chatbot
        
    }
    catch (error) {
        reject(error);
    }
  }); 
}

const getForecast = (location, n_forecast = 0) => {
    return new Promise(async(resolve, reject) => {
        try {
            const weatherConditions = await axios.get('https://api.openweathermap.org/data/2.5/forecast',

            {
                params : {
                    q: location,
                    cnt: n_forecast, // number of forecasts (1 forecast every 3h, max 5 days of forecast), if 0 then equal 40 (max)
                    appid: apikey
            }
        });

        resolve(weatherConditions.data) // returns back the results to the chatbot
        
    }
    catch (error) {
        reject(error);
    }
});
}
    const getUVindex = (latitude,longitude) => {
        return new Promise(async(resolve, reject) => {
            try {
                const weatherConditions = await axios.get('https://api.openweathermap.org/data/2.5/onecall',
    
                {
                    params : {
                        lat: latitude,
                        lon: longitude, 
                        appid: apikey
                }
            });
    
            resolve(weatherConditions.data) // returns back the results to the chatbot
            
        }
        catch (error) {
            reject(error);
        }
  });
}
  const getAirpollution = (latitude,longitude) => {
    return new Promise(async(resolve, reject) => {
        try {
            const weatherConditions = await axios.get('http://api.openweathermap.org/data/2.5/air_pollution?',

            {
                params : {
                    lat: latitude,
                    lon: longitude, 
                    appid: apikey
            }
        });

        resolve(weatherConditions.data) // returns back the results to the chatbot
        
    }
    catch (error) {
        reject(error);
    }
}); 
  } 

module.exports = { 
    getWeather, getForecast, getUVindex, getAirpollution 
};