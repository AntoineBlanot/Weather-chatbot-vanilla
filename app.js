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
const airqualityLevels = ["Good", "Fair", "Moderate","Poor","Very Poor"]; //used for air quality requests
const uvLevels=["Weak","Weak","Moderate","Moderate","Moderate","High","High","Very High","Very High","Very High","Extreme"]

rl.setPrompt('> ');
console.log("\x1b[33m",'\n--- Welcome user! Through this application you can learn about---\n - the temperature\n  - the weather\n - the air quality\n - the UV index\n and thus for the coming days !\n Enter help for accessing the available queries',"\x1b[0m");
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
            
            case 'help':
                console.log("\x1b[33m",'For every features you should precise the [feature] [in] [city name] [today|tomorrow] or specified the [in] [dd] [days|hours]\n Also please be aware that for some functions can only forecast to 5-7 days and therefore we are not always able to provide contents for specific hours',"\x1b[33m");
                break; 
            case 'Current temperature':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    var temp = res.main.temp - 273.15; // Convert to Celsius °C
                    var temp_style = getTemperatureStyle(temp);

                    console.log(`It is \x1b[1m\x1b[5m${getTemperatureExpression(temp)} in ${res.name}, with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m.\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
                case 'Forecast tomorrow temperature':
                    rl.setPrompt('');
                    weather.getForecast(cb.entities.city).then(res => {
                      
                        var date = res.list[8].dt_txt
                        var temp = res.list[8].main.temp - 273.15
                        var temp_style = getTemperatureStyle(temp);
                    
                        console.log(`In ${res.city.name} tomorrow, the temperature will be \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m (data from ${date})\n`);
                        
                        rl.setPrompt('> ');
                        rl.prompt();
                    });
                    break;
            case 'Forecast temperature':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {
                    var forecast_days_hours=cb.entities.time // used for the console.log to match days/hours
                    var forecast_index=cb.entities.time

                    if (cb.entities.hrs == 'days'){ // It means that 'entities.time' corresonds to the number of days 

                        var forecast_index = (cb.entities.time*8)  // Incrementing the index by 1 is equal to increasing the datetime by 3 hours so +8 equals 24 hours
                    }
                    else { 
                        if (cb.entities.time<120){                   
                            if (forecast_index %3!=0)
                           {
                            var forecast_index = parseInt(cb.entities.time/3)
                            forecast_days_hours=(forecast_index)*3
                            console.log(`Time was adjusted from ${cb.entities.time}h to ${forecast_index*3}h in order to  match the available temperature forecast (updated every 3 hours)`)
                           }
                        }
                        
                        else {
                            console.log("Warning ! This API only provides the temperature for the 5 coming days, please reconsider your request");
                            return;
                        }                       
                    }
                    var date = res.list[forecast_index].dt_txt
                    var temp = res.list[forecast_index].main.temp - 273.15
                    var temp_style = getTemperatureStyle(temp);
                
                    console.log(`In ${res.city.name}, in ${forecast_days_hours} ${cb.entities.hrs}, the temperature will be \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m (data from ${date}).\n`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;

            case 'Forecast tomorrow weather':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {
                 
                    var date = res.list[8].dt_txt    // List[0].dt current datetime and list[8] give the current datetime +24h
                    var description = res.list[8].weather[0].description 
                    var temp = res.list[8].main.temp - 273.15
                    var temp_style = getTemperatureStyle(temp);
                    var humidity = res.list[8].main.humidity 
                
                    console.log(`In ${res.city.name} tomorrow, the temperature will be \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m \n There will be \x1b[1m\x1b[5m${description}\x1b[0m. (data from ${date})\n Finally, the atmosphere is ${getHumidityExpression(humidity)} with score ${humidity}`);

                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            case 'Forecast weather':
                rl.setPrompt('');
                weather.getForecast(cb.entities.city).then(res => {

                    var forecast_days_hours=cb.entities.time
                    var forecast_index=cb.entities.time/3

                    if (cb.entities.hrs == 'days'){ // It means that 'entities.time' corresonds to the number of days 

                        var forecast_index = (cb.entities.time*8)  // Incrementing the index by 1 is equal to increasing the datetime by 3 hours so +8 equals 24 hours
                    }
                    else { 
                        if (cb.entities.time<120){                   
              
                            if (cb.entities.time%3!=0)
                           {
                            var forecast_index = parseInt(cb.entities.time/3)
                            forecast_days_hours=forecast_index
                            console.log(`Time was adjusted from ${cb.entities.time}h to ${(forecast_index)*3}h in order to  match the available weather forecast (updated every 3 hours)`)
                           }
                        }
                        
                        else {
                            console.log("Warning ! This API only provides the weather for the 5 coming days, please reconsider your request");
                            return;
                        }                       
                    }
                    var date = res.list[forecast_index].dt_txt
                    var description = res.list[forecast_index].weather[0].description 
                    var temp = res.list[forecast_index].main.temp - 273.15
                    var temp_style = getTemperatureStyle(temp);
                    var humidity =res.list[forecast_index].main.humidity
                
                    console.log(`In ${res.city.name}, in ${forecast_days_hours} ${cb.entities.hrs}, the temperature will be \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m \n There will be \x1b[1m\x1b[5m${description}\x1b[0m. (data from ${date})\nFinally, the atmosphere is ${getHumidityExpression(humidity)} with score ${humidity}`);
                    
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            case 'Current weather':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {
                                                             // current one is the first query in the API answer
                    var date = new Date()
                    var description = res.weather[0].description 
                    var temp = res.main.temp - 273.15
                    var temp_style = getTemperatureStyle(temp);
                    var humidity = res.main.humidity 

                    console.log(`In ${cb.entities.city} today, the temperature is \x1b[1m\x1b[5m${getTemperatureExpression(temp)} with \x1b[1m\x1b[5m${temp_style}${temp.toFixed(1)}°C\x1b[0m \n There is \x1b[1m\x1b[5m${description}\x1b[0m. (data from ${date})\n Finally, the atmosphere is ${getHumidityExpression(humidity)} with score ${humidity}`);
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
            case 'Current uv index':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    var long = res.coord.lon
                    var lat = res.coord.lat
                
                    weather.getUVindex(lat,long).then(res =>{
                    var uv = res.current.uvi
                    var timestamp = res.current.dt*1000
                    var date = new Date(timestamp)
                    var uvLevel=uvLevels[uv-1] // match corresponding label 
                    var uv_style = getUvLevelStyle(uv)

                    console.log(`In ${cb.entities.city}, the UV score is \x1b[1m\x1b[5m${uv_style}${uv.toFixed(1)}\x1b[0m which is \x1b[1m\x1b[5m${getUvLevelsExpression(uvLevel)}. (data from ${date.toLocaleString()})\n`);
                    rl.setPrompt('> ');
                    rl.prompt(); 
                    })           
                });
                break;
            case 'Forecast tomorrow uv index':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    var long = res.coord.lon
                    var lat = res.coord.lat
                
                    weather.getUVindex(lat,long).then(res =>{
                    var uv = res.hourly[24].uvi
                    var timestamp = res.hourly[24].dt*1000
                    var date = new Date(timestamp)
                    var uvLevel=uvLevels[uv-1] 
                    var uv_style = getUvLevelStyle(uv)

                    console.log(`In ${cb.entities.city} tomorrow, the UV score will be \x1b[1m\x1b[5m${uv_style}${uv.toFixed(1)}\x1b[0m which is \x1b[1m\x1b[5m${getUvLevelsExpression(uvLevel)}. (data from ${date.toLocaleString()})\n`);
                    rl.setPrompt('> ');
                    rl.prompt(); 
                    })           
                });
                break;
            case 'Forecast uv index':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {

                    var long = res.coord.lon
                    var lat = res.coord.lat
                    var uvIndex = cb.entities.time
                    weather.getUVindex(lat,long).then(res =>{

                    if (cb.entities.hrs == 'days'){

                        if (uvIndex>7){
                            console.log(' This API can only forecastes the UV score to the next 7 days.')
                            uvIndex=7;
                        }
                        var uv = res.daily[parseInt(uvIndex)].uvi
                        var timestamp = res.daily[parseInt(uvIndex)].dt*1000
                        var date = new Date(timestamp) ;
                    }
                    else { 
                        if (uvIndex<25){                   
                        var uv = res.hourly[parseInt(uvIndex)].uvi
                        var timestamp = res.hourly[parseInt(uvIndex)].dt*1000
                        var date = new Date(timestamp)
                        }
                        else {
                            
                            console.log(" This Api only provides the UV score from 0 to the next 24 hours, after that you need to use days");
                            return;
                        }                       
                    }
                         var uvLevel=uvLevels[uv-1]
                         var uv_style=getUvLevelStyle(uv)
                        console.log(`In ${cb.entities.city}, in ${uvIndex} ${cb.entities.hrs} the UV score will be \x1b[1m\x1b[5m${uv_style}${uv.toFixed(1)}\x1b[0m which is \x1b[1m\x1b[5m${getUvLevelsExpression(uvLevel)}. (data from ${date.toLocaleString()})\n`);
                        rl.setPrompt('> ');
                        rl.prompt(); 
                    })           
                });
                break;
            case 'Current air quality':
                rl.setPrompt('');
                weather.getWeather(cb.entities.city).then(res => {
                    
                    var long = res.coord.lon
                    var lat = res.coord.lat
                    weather.getAirquality(lat,long).then(res =>{
                    
                        var quality = airqualityLevels[res.list[0].main.aqi-1]
                        var timestamp = res.list[0].dt*1000
                        var date = new Date(timestamp);
                        console.log(`In ${cb.entities.city}, the air quality is ${getAirQualityExpression(quality)}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                        rl.setPrompt('> ');
                        rl.prompt(); 
                     })
                });
                case 'Forecast tomorrow air quality':
                    rl.setPrompt('');
                    weather.getWeather(cb.entities.city).then(res => {
                        
                        var long = res.coord.lon
                        var lat = res.coord.lat
                        
                        weather.getAirquality(lat,long).then(res =>{
                     
                            var quality=airqualityLevels[res.list[24].main.aqi-1] // we check the quality for 24h after the current time research
                            var timestamp = res.list[24].dt*1000
                            var date = new Date(timestamp);
                            console.log(`In ${cb.entities.city} ${cb.entities.time}, the air quality will be ${getAirQualityExpression(quality)}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                            rl.setPrompt('> ');
                            rl.prompt(); 
                         })
                    });   
                break;
                case 'Forecast air quality':
                    rl.setPrompt('');
                    weather.getWeather(cb.entities.city).then(res => {
                        
                        var long = res.coord.lon
                        var lat = res.coord.lat
                        var qualityIndex =0
                        var quality_days_hours= cb.entities.time
                                   //for the print
                    
                        if (cb.entities.hrs == 'days'){
                            qualityIndex = 24*cb.entities.time ;
                                                                     // for matching hours days print + correction if hours >117
                        }
                        else {
                            qualityIndex=cb.entities.time
                        }
                        if (qualityIndex>117)
                        {
                            qualityIndex=117
                            quality_days_hours= 117
                            console.log("API can't predict the air quality in 5 days but only in 117 hours")
                        }
                        weather.getAirquality(lat,long).then(res =>{
                        
                            var quality = airqualityLevels[res.list[qualityIndex].main.aqi-1] // we check the quality for 24h after the current time research
                            var timestamp = res.list[qualityIndex].dt*1000
                            var date = new Date(timestamp);
                            console.log(`In ${cb.entities.city}, in ${quality_days_hours} ${cb.entities.hrs} the air quality will be ${getAirQualityExpression(quality)}\x1b[0m. (data from ${date.toLocaleString()})\n`);
                            rl.setPrompt('> ');
                            rl.prompt(); 
                           1 
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

let getAirQualityExpression = (quality) =>{
    if (quality = 'Good'){
        return "\x1b[32mGood\x1b[0m";

    } else if (quality = 'Fair'){
        return "\x1b[90mFair\x1b[0m";

    } else if (quality = 'Moderate'){
        return "\x1b[93mModerate\x1b[0m";

    } else if (quality = "Poor"){
        return "\x1b[33mPoor\x1b[0m";

    }else if (quality= "Very Poor"){
        return "\x1b[31mVery Poor\x1b[0m";
    }
    }
let getUvLevelStyle = (uv) =>{
    if (0< uv<= 2){
        return "\x1b[32m";

    } else if ( 3 <= uv <=5){
        return "\x1b[90m";

    } else if (uv <8){
        return "\x1b[33m";
    
    }else if (uv <=10){
        return "\x1b[31m";

    }else if (uv= 11){
        return "\x1B[30m";
    }
    }
let getUvLevelsExpression = (uv) =>{
    if (uv = 'Weak'){
        return "\x1b[32mWeak\x1b[0m";

    } else if (uv = 'Moderate'){
        return "\x1b[90mModerate\x1b[0m";

    } else if (uv = "High"){
        return "\x1b[33mHigh\x1b[0m";

    }else if (uv= "Very High"){
        return "\x1b[31mVery High\x1b[0m";

    }else if (uv= "Extreme"){
        return "\x1B[30mExtreme\x1b[0m";
    }
    }
let getHumidityExpression = (humidity) =>{
    if (humidity<=20){
        return "\x1b[31mVery dry air\x1b[0m";

    } else if (20<humidity<=40){
        return "\x1b[33mDry air\x1b[0m";

    } else if (40<humidity<=60){
        return "\x1b[36mAlmost normal\x1b[0m";

    }else if (60<humidity<80){
        return "\x1b[34mHumid\x1b[0m";

    }else if (80<=humidity<100){
        return "\x1B[30mVery Humid\x1b[0m";
    }
}

