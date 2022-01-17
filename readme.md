
# Weather Chatbot vanilla

## Introduction 

This goal of this project is to simulate a Weather Chatbot. The elaboration of the chatbot should be done through node.js and follows the guidelines provided in the PW2. The team was composed of Antoine BLANOT, Raphael BRETHES and Hugo Bessis.

## API

We decided to use the website https://openweathermap.org/ which allowed us to extract some interesting informations about everythings related to the weather.
Through the API we use the current weather, forecast, air pollution and the onecall requests where we could easily extract the UV index.
We connected the API thanks to the library axios. The city name was needed for most of the calls so we had to declare it in the requets.

## Patterns

We established some patterns that were looking for :
- the presence of the method that we want to use (air quality, weather, temperature...)
- the city's name
- In case of forecasting, the number of days or hours.

We also made several patterns with the same intent to facilitate our work around the use of Regex expressions.

## app.js : communicate the results
After matching a specific pattern and called the API we were able to specify which attributes we wanted to show.
We added some colors and meaning behind the numbers that we got such as the UV score levels or air quality.

## Final remarks

It was an interesting project and specially because we were not familiar with either node.js or the chatbot concept. Also implementing some patterns recognition with Regex was challenging.

### Thank you for your reading. 
