const patternDict = [{
        pattern : '\\b(?<greeting>Hi|Hello|Hey|Good morning|Good afternoon)\\b',
        intent : 'Hello'
    }, {
        pattern :'\\b(bye|exit)\\b',
        intent : 'Exit'
    },{
    pattern : '\\b(weather)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current weather'},
    {
    pattern : '\\b(weather)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current weather'
    },{
    pattern : '\\b(?<time>current)\\s\\b(weather)\\sin\\s\\b(?<city>[A-Za-z\\s]+)',
    intent : 'Current weather'

    },{
    pattern:'\\b(?<time>current)\\s\\b(weather)\\s\\b(?<city>[A-Za-z\\s]+)',
    intent : 'Current weather'
    },{
    pattern : '\\b(weather)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent : 'Forecast weather'
    },{
    pattern : '\\b(weather)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent : 'Forecast weather'
    },{
    pattern : '\\b(weather)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent :'Forecast weather'
    },{
    pattern : '\\b(weather)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent : 'Forecast weather'
    },{
    pattern : '\\b(temperature)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current temperature'
    },{
    pattern : '\\b(temperature)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current temperature'
    },{
    pattern : '\\b(?<time>current)\\s\\b(temperature)\\sin\\s\\b(?<city>[A-Za-z\\s]+)',
    intent : 'Current temperature'
    },{
    pattern : '\\b(?<time>current)\\s\\b(temperature)\\s\\b(?<city>[A-Za-z\\s]+)',
    intent : 'Current temperature'
    },{
    pattern : '\\b(temperature)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent : 'Forecast temperature'
    },{
    pattern :'\\b(temperature)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent : 'Forecast temperature'
    },{
    pattern : '\\b(temperature)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent : 'Forecast temperature'
    },{
    pattern : '\\b(temperature)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent : 'Forecast temperature'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current air pollution'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>now|today|currently)',
    intent : 'Current air pollution'
    },{
    pattern : '\\b(?<time>current)\\s\\b(air pollution)\\sin\\s\\b(?<city>[A-Za-z\\s]+)',
    intent :'Current air pollution'
    },{
    pattern : '\\b(?<time>current)\\s\\b(air pollution)\\s\\b(?<city>[A-Za-z\\s]+)',
    intent : 'Current air pollution'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent : 'Forecast tomorrow air pollution'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\s\\b(?<time>tomorrow)',
    intent :'Forecast tomorrow air pollution'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*in\\s\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent : 'Forecast air pollution'
    },{
    pattern : '\\b(air pollution)\\s(like\\s)*\\b(?<city>[A-Za -z]+([A-Za -z]+)?)\\sin\\s\\b(?<time>\\d)\\s(?<hrs>days|hours)',
    intent : 'Forecast air pollution'
}]

   
    
module.exports = patternDict;