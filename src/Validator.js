const Validator = {

    is_operator: (strSymbol) => {
        return "().|*".indexOf(strSymbol) !== -1;
    },

    is_letter: (strSymbol) => {
        return "().|*".indexOf(strSymbol) === -1;
    },

    is_concat: (strSymbol) => {
        return ".|*)".indexOf(strSymbol) === -1;
    },

    get_closing_bracket_position: (regex, index) => {
        let count = 1;
        index = index + 1;

        while(count !== 0 && index < regex.length)
        {
            if (regex[index] === "(") {
                ++count;
            }
            else if (regex[index] === ")") {
                --count;
            }

            ++index;
        }

        return index;
    },

    check_brackets: (strRegex, debug = false) =>
	{
		let count = 0; // tinem minte numarul de paranteze deschise - inchise

        for(const symbol of strRegex)
        {
            if (symbol === "(")
			{
				count = count + 1;
			}
			else if(symbol === ")")
			{
                count = count - 1;
                
                if (count < 0) {
                    if (debug)
                    {
                        console.log("Regex: Inchidere incorecta de paranteze. (count < 0)", strRegex);
                    }
                    return false;
                }
            }
        }

		if (count > 0) {
            if (debug)
            {
                console.log("Regex: Inchidere incorecta de paranteze. (count > 0)", strRegex);
            }
			return false;
		}

		return true // Expresia regulata este valida daca toate parantezele sunt inchise
    },
}

module.exports = Validator;