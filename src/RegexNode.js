const validator = require("./Validator.js");


class RegexNode
{
    constructor(regex, debug = false)
    {
        this.regex = regex;

        this.optional = false; // marcheaza nodul ca fiind optional (kleene *)
        this.arrFirst = []; // nodurile initiale
        this.arrLast = []; // nodurile finale
        this.item = null; // symbol-ul (alphabet sau operator)
        this.position = null; // index-ul nodului (daca symbolul face parte din alphabet)
        this.children = []; // subarborii nodului curent

        this.create(regex, debug);
    }

    // Eleminam parantezele inutile, ex: (((a\b))) => a|b
    trim(regex, debug)
    {
        let _regex = regex;

        while(true)
        {
            // Daca cuvantul este inchis in paranteze, eliminam parantezele si veificam ca noul cuvant sa fie valid
            if (_regex[0] === "(" && _regex[_regex.length - 1] === ")")
            {
                const sub_regex = _regex.substring(1, _regex.length - 1);
                if (validator.check_brackets(sub_regex, debug)) // ex: "(a|x)(b|y)"" => "a|x)(b|y" este invalid
                {
                    _regex = sub_regex;
                    continue;
                }
            }
            break;
        }
        return _regex;
    }


    create(regex, debug = false)
    {
        if (regex.length === 1 && validator.is_letter(regex))
        {
            // Daca nodul este o frunza (symbol din alphabet) tinem minte symbol-ul si ne oprim
            this.item = regex;
            return;
        }

        // verificam corectitudinea parantezelor
        if (!validator.check_brackets(regex))
        {
            console.error("bad:", regex);
        }

        // eleiminam parantezele suplimentare
        regex = this.trim(regex, debug);

        let conjuction = null; // marcheaza o operatie de concatenare ex: ab, (b|c)a sau a(b|c)
        let disjunction = null; // marcheaza o operatie de disjunctie b|c
        let kleene = null; // zero or more, a* sau (a|b)*
        let paranthesis = null; // caz-ul parantezelelor (a)(b)

        const length = regex.length;
        let index = 0;

        // pentru fiecare symbol din regex
        while(index < length)
        {
            // daca gasim o zona noua, o vom folosi ca sub-arbore stang, deci o parcurgem la pasul curent
            if (regex[index] === "(")
            {
                // calculam pozitia unde se termina zona gsita
                index = validator.get_closing_bracket_position(regex, index);

                // daca avem cazul (a|b)(x|y)
                if (paranthesis === null && regex[index - 1] === "(")
                {
                    paranthesis = index - 1;
                }
            }
            else
            {
                // altfel mergem mai departe
                // nota: primul caracter este omis (operandul stang)
                ++index;
            }

            if (index === length) {
                break; // the end... to be continued...
            }

            // Daca avem un symbol din alphabet sau "(" (o zona noua) semnalam nevoia de concatenare
            if (validator.is_concat(regex[index]))
            {
                if (conjuction === null)
                {
                    conjuction = index;
                }
                continue;
            } // operatorul de zero_or_more (kleene)
            else if (regex[index] === "*")
            {
                if (kleene === null)
                {
                    kleene = index;
                }
                continue;
            }
            else if (regex[index] === "|") // disjunctie
            {
                if (disjunction === null)
                {
                    disjunction = index;
                }
                continue; 
            }
        }

        // Verificam cazurile dupa prioritate: disjunctie, concatenare, kleene
        if (disjunction !== null) {
            this.item = "|";
            this.children.push(new RegexNode(regex.substring(0, disjunction)));
            this.children.push(new RegexNode(regex.substring(disjunction + 1)));
        }
        else if (conjuction !== null) {
            this.item = ".";
            this.children.push(new RegexNode(regex.substring(0, conjuction)));
            this.children.push(new RegexNode(regex.substring(conjuction)));
        }
        else if (paranthesis !== null) { // un sub caz la concatenare
            this.item = ".";
            this.children.push(new RegexNode(regex.substring(0, paranthesis + 1)));
            this.children.push(new RegexNode(regex.substring(paranthesis)));
        }
        else if (kleene !== null) {
            this.item = "*";
            this.children.push(new RegexNode(regex.substring(0, kleene)));
        }
    }


    build(nPositionIndex, followList, debug)
    {
        if (validator.is_letter(this.item))
        {
            this.arrFirst = [nPositionIndex];
            this.arrLast = [nPositionIndex];
            this.position = nPositionIndex;

            followList[nPositionIndex] = {
                item: this.item,
                list: new Set(),
            };

            if (debug)
            {
                console.log(this.position, this);
            }

            return nPositionIndex + 1;
        }

        for (const child of this.children)
        {
            nPositionIndex = child.build(nPositionIndex, followList, debug);
        }

        if (this.item === ".")
        {
            if (this.children[0].optional) 
            {
                const reunion = [...this.children[0].arrFirst, ...this.children[1].arrFirst];
                const reunion_set = new Set(reunion);
                this.arrFirst = [...reunion_set];
            }
            else
            {
                this.arrFirst = [...this.children[0].arrFirst];
            }


            if (this.children[1].optional) 
            {
                const reunion = [...this.children[0].arrLast, ...this.children[1].arrLast];
                const reunion_set = new Set(reunion);
                this.arrLast = [...reunion_set];
            }
            else
            {
                this.arrLast = [...this.children[1].arrLast];
            }

            this.optional = this.children[0].optional && this.children[1].optional;

            for (const i of this.children[0].arrLast)
            {
                for (const j of this.children[1].arrFirst)
                {
                    followList[i].list.add(j);
                }  
            }
        }
        else if (this.item === "|")
        {
            const first_reunion = [...this.children[0].arrFirst, ...this.children[1].arrFirst];
            this.arrFirst = [...(new Set(first_reunion))];
            const last_reunion = [...this.children[0].arrLast, ...this.children[1].arrLast];
            this.arrLast = [...(new Set(last_reunion))];

            this.optional = this.children[0].optional || this.children[1].optional;
        }
        else if (this.item === "*")
        {
            this.arrFirst = [...this.children[0].arrFirst];
            this.arrLast = [...this.children[0].arrLast];

            this.optional = true;

            for (const i of this.children[0].arrLast)
            {
                for (const j of this.children[0].arrFirst)
                {
                    followList[i].list.add(j);
                }  
            }
        }

        if (debug)
        {
            console.log(this.position, this);
        }

        return nPositionIndex;
    }
}

module.exports = RegexNode;