const patternDict = [{
        pattern : '\\b(?<greeting>Hi|Hello|Hey)\\b',
        intent : 'Hello'
    }, {
        pattern :'\\b(bye|exit)\\b',
        intent : 'Exit'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s[a-z]+\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)\\s\\b(?<time>tomorrow|today)',
        intent : 'forecast weather'
    }, {
        pattern : '\\b((weather\\s(like\\s)?)|(is\\sit\\s[a-z]+\\s))in\\s\\b(?<city>[A-Za-z]+\\s?([A-Za-z]+)?)',
        intent : 'current weather'
    }];
    
module.exports = patternDict;