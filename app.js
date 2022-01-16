'use strict';

const { Console } = require('console');
var jp = require('jsonpath');

const Readline = require('readline'); // for including readline module in app
const rl = Readline.createInterface({ // for reading inputs
    input : process.stdin,
    output : process.stdout,
    terminal : false
});

const matcher = require('./matcher'); // matcher module
const weather = require('./weather'); // weather module
const airPollutionLevels = ["Good", "Fair", "Moderate","Poor","Very Poor"]; //used for air pollution requests

rl.setPrompt('> ');
console.log("\x1b[33m",'\n--- Welcome user! How can I help you today? ---\n',"\x1b[0m");
rl.prompt();
rl.on('line', reply => {
    matcher(reply , cb => {
        switch(cb.intent){

            case 'Hello':
                console.log(`${cb.entities.greeting} there ! Feel free to ask me about the temperature, weather or UV indice of any cities`);
                break;

            case 'Exit':
                console.log('You have successfully left the channel');
                process.exit();

            case 'Current temperature':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    var temp = res.main.temp - 273.15;
                    var temp_style = getTemperatureStyle(temp);

                    console.log(`It is \x1b[1m\x1b[5m${getTemperatureExpression(temp)} in ${res.name}, with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m.\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            
            case 'Forecast temperature':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {

                    var date = getDate(cb.entities.time);
                    var temp = jp.query(res, `$.list[?(@.dt_txt == "${date}")].main.temp`)[0]; // jsonpath query
                    temp = temp - 273.15;
                    var temp_style = getTemperatureStyle(temp);

                    console.log(`In ${res.city.name} ${cb.entities.time}, it will be \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m (data from ${date})\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;

            case 'Forecast weather':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {

                    var date = getDate(cb.entities.time);
                    var desc = jp.query(res, `$.list[?(@.dt_txt == "${date}")].weather.*.description`)[0]; // jsonpath query
                    var sep = desc[-1] == 's' ? '' : 'a ';

                    var temp = jp.query(res, `$.list[?(@.dt_txt == "${date}")].main.temp`)[0]; // jsonpath query
                    temp = temp - 273.15;
                    
                    var temp_style = getTemperatureStyle(temp);

                    console.log(`In ${res.city.name} ${cb.entities.time}, the temperature is  \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with (\x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m). There will be \x1b[1m\x1b[5m${sep}${desc}\x1b[0m. (data from ${date})\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            case 'Current weather':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    //var date = getDate(cb.entities.time);
                    var desc = res.weather.description 
                
                    var temp = res.main.temp - 273.15;
                    var temp_style = getTemperatureStyle(temp);
                    console.log(res.weather['description'])
                    console.log(`It is \x1b[1m\x1b[5m${getTemperatureExpression(temp)} in ${res.name}, with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m.\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            case 'uv index':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                   // var date = getDate(cb.entities.time);
                    var long = res.coord.lon
                    var lat = res.coord.lat
                
                    weather.getUVindex(lat,long).then(res =>{
                    console.log(res.daily[0].uvi)
                    // var desc = jp.query(res, `$.list[?(@.dt_txt == "${date}")].daily.uvi`)[0]; // jsonpath query
                    // var sep = desc[-1] == 's' ? '' : 'a ';

                    // console.log(`In ${res.city.name}, the UV ${sep}${desc}\x1b[0m. (data from ${date})\n`);
        
                    })
                    rl.setPrompt('> ');
                    rl.prompt(); 
        
                
                });
                break;
            case 'Current air pollution':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {
                    

                    //var date = getDate(cb.entities.time);
                    var long = res.coord.lon
                    var lat = res.coord.lat
                    weather.getAirpollution(lat,long).then(res =>{
                    
                    var pollution=airPollutionLevels[res.list[0].main.aqi-1]
                    var timestamp = res.list[0].dt*1000
                    var date = new Date(timestamp);
                    console.log(`In ${cb.entities.city}, the air pollution is ${pollution}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                    rl.setPrompt('> ');
                    rl.prompt(); 
                     })

                
                });
                case 'Forecast tomorrow air pollution':
                    rl.setPrompt('');
                    weather.getWeather(cb.entities.city).then(res => {
                        
                        var long = res.coord.lon
                        var lat = res.coord.lat
                        
                        weather.getAirpollution(lat,long).then(res =>{
                     
                        var pollution=airPollutionLevels[res.list[24].main.aqi-1] // we check the pollution for 24h after the current time research
                        var timestamp = res.list[24].dt*1000
                        var date = new Date(timestamp);
                        console.log(`In ${cb.entities.city}, the air pollution is ${pollution}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                        rl.setPrompt('> ');
                        rl.prompt(); 
                    
                         })
    
                    });   
                break;
                case 'Forecast air pollution':
                    rl.setPrompt('');
                    weather.getWeather(cb.entities.city).then(res => {
                        
                        var long = res.coord.lon
                        var lat = res.coord.lat
                        var pollutionIndex =0 
                        if (cb.entities.hrs=='days'){
                            pollutionIndex=24*cb.entities.time ;
                        }
                        else {
                            pollutionIndex=cb.entities.time
                        }
                        weather.getAirpollution(lat,long).then(res =>{
                     
                        var pollution=airPollutionLevels[res.list[pollutionIndex].main.aqi-1] // we check the pollution for 24h after the current time research
                        var timestamp = res.list[pollutionIndex].dt*1000
                        var date = new Date(timestamp);
                        console.log(`In ${cb.entities.city}, the air pollution is ${pollution}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                        rl.setPrompt('> ');
                        rl.prompt(); 
                    
                         })
    
                    });   
                break;
            default:
                console.log('I did not understand your resquest, please try again. accepted: [feature] [in] [city name]');
        }
    });
    rl.prompt();
});

let getTemperatureExpression = (temp) => {
    if (temp < -20){
        return "\x1b[36mfreezing\x1b[0m";
    } else if (temp < 0){
        return "\x1b[36mvery cold\x1b[0m";
    } else if (temp < 10){
        return "\x1b[34mcold\x1b[0m";
    } else if (temp < 20){
        return "\x1b[32mcool\x1b[0m";
    } else if (temp < 25){
        return "\x1b[32mwarm\x1b[0m";
    } else if (temp < 30){
        return "\x1b[33mhot\x1b[0m";
    } else {
        return "\x1b[31mvery hot\x1b[0m";
    }
}

let getDate = (str) => {

    // new Date object
    let date_ob = new Date();

    var stamp;

    if (str == 'today'){
        stamp = 0 
    } else if (str == 'tomorrow'){
        stamp = 1
    } else {
        stamp = 40 // a redéfinir, cas ou l'utilisateur ne rentre ni today ni tomorrow (in x days par ex)
    }

    // adjust 0 before single digit date
    let day = ("0" + (date_ob.getDate() + stamp) % 30).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1 + Math.floor((date_ob.getDate() + stamp)/30))).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = ("0" + (date_ob.getHours() + 3 - (date_ob.getHours() % 3))).slice(-2)

    if (parseInt(hours) > 24)
    {
        hours = "00";
        day = ("0" + (parseInt(day) + 1)).slice(-2);
    }

    return `${year}-${month}-${day} ${hours}:00:00`
}

let getTemperatureStyle = (temp) => {
    if (temp < -20){
        return "\x1b[36m";
    } else if (temp < 0){
        return "\x1b[36m";
    } else if (temp < 10){
        return "\x1b[34m";
    } else if (temp < 20){
        return "\x1b[32m";
    } else if (temp < 25){
        return "\x1b[32m";
    } else if (temp < 30){
        return "\x1b[33m";
    } else {
        return "\x1b[31m";
    }
}
