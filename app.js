'use strict';

const Readline = require('readline'); // for including readline module in app
const rl = Readline.createInterface({ // for reading inputs
    input : process.stdin,
    output : process.stdout,
    terminal : false
});

const matcher = require('./matcher'); // matcher module
const weather = require('./weather'); // weather module

rl.setPrompt('> ');
rl.prompt();
rl.on('line', reply => {
    matcher(reply , cb => {
        switch(cb.intent){

            case 'Hello':
                console.log(`${cb.entities.greeting} there`);
                break;

            case 'Exit':
                console.log('You want to exit');
                process.exit();

            case 'get weather':
                console.log(`Weather in ${cb.entities.city} at ${cb.entities.time} is :`);
                break;

            case 'current weather':
                rl.setPrompt('');
                weather(cb.entities.city).then(res => {
                    var temp = res.main.temp - 273.15;
                    console.log(`It is ${getTemperatureExpression(temp)} in ${res.name}, with ${temp.toFixed(1)}°C.`);
                    rl.setPrompt('> ');
                    rl.prompt();
                });
                break;
    
            default:
                console.log('I did not understand your resquest, please try again');
        }
    });
    rl.prompt();
});

let getTemperatureExpression = (temp) => {
    if (temp < -10){
        return "glacial";
    } else if (temp < 0){
        return "very cold";
    } else if (temp < 10){
        return "cold";
    } else if (temp < 20){
        return "agreable";
    } else if (temp < 30){
        return "hot";
    } else if (temp < 40){
        return "very hot";
    } else {
        return "extremely hot";
    }
}