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

    check_brackets: (strRegex) =>
	{
		let count = 0; // tinem minte numarul de paranteze deschise - inchise

		strRegex.split("").forEach((symbol) => {
			if (symbol === "(")
			{
				count = count + 1;
			}
			else if(symbol === ")")
			{
				count = count - 1;

				if (count < 0) {
					console.log("Regex: Inchidere incorecta de paranteze.");
					return false;
				}
			}
		});

		if (count > 0) {
			console.log("Regex: Inchidere incorecta de paranteze.");
			return false;
		}

		return true // Expresia regulata este valida daca toate parantezele sunt inchise
    },
}

module.exports = Validator;