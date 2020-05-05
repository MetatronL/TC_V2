const validator = require("./Validator.js");


class RegexNode
{
    constructor(regex)
    {
        this.optional = false;
        this.arrFirst = [];
        this.arrLast = [];
        this.item = null;
        this.position = null;
        this.children = [];

        this.create(regex);
    }

    trim(regex)
    {
        if (regex[0] === "(" && regex[regex.length - 1] === ")")
        {
            const sub_regex = regex.substring(1, regex.length - 1);

            if(validator.check_brackets(sub_regex))
            {
                return this.trim(sub_regex);
            }
        }

        return regex;
    }


    create(regex)
    {
        if (regex.length === 1 && validator.is_letter(regex))
        {
            this.item = regex;
            return;
        }

        regex = this.trim(regex);

        let conjuction = null;
        let disjunction = null;
        let kleene = null;

        const length = regex.length;
        let index = 0;

        while(index < length)
        {
            if (regex[index] === "(")
            {
                index = validator.get_closing_bracket_position(regex, index);
            }
            else
            {
                ++index;
            }

            if (index === length) {
                break; // the end..
            }

            if (validator.is_concat(regex[index]))
            {
                if (conjuction === null)
                {
                    conjuction = index;
                }
                continue;
            }
            else if (regex[index] === "*")
            {
                if (kleene === null)
                {
                    kleene = index;
                }
                continue;
            }
            else if (regex[index] === "|")
            {
                if (disjunction === null)
                {
                    disjunction = index;
                }
                continue; 

                // return ??
            }
        }

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
        else if (kleene !== null) {
            this.item = "*";
            this.children.push(new RegexNode(regex.substring(0, disjunction)));
        }
    }


    build(nPositionIndex, followList)
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

            return nPositionIndex + 1;
        }

        for (const child of this.children)
        {
            nPositionIndex = child.build(nPositionIndex, followList);
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

        return nPositionIndex;
    }
}

module.exports = RegexNode;