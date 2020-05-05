const RegexNode = require("./RegexNode.js");
const DFA = require("./DFA.js");

class Regex
{
    constructor(strRegularExpression)
    {
        this.root = new RegexNode(strRegularExpression);
        this.followList = [];
    }

    run({ debug = false } = {})
    {
        this.root.build(0, this.followList, debug);
        if (debug)
        {
            console.log(this);
        }
    }

    has_end_mark(arrPositionList)
    {
        return arrPositionList.some((index) => this.followList[index].item === "#");
    }

    same_arrays(arrQ, arrM)
    {
        if (arrQ.length != arrM.length) {
            return false;
        }

        return arrQ.every((value, index) => value === arrM[index]);
    }

    not_in(Q, arrQ)
    {
        return !Object.values(Q).some((arrM) => this.same_arrays(arrQ, arrM));
    }

    get_position(Q, array_to_compare)
    {
        for(const [key, value] of Object.entries(Q))
        {
            if (this.same_arrays(array_to_compare, value))
            {
                return Number.parseInt(key);
            }
        }

        return null;
    }

    find_first_allowed(Q, found)
    {
        return Object.keys(Q).find((index) => !found.includes(index));
    }

    to_dfa({ debug = false } = {})
    {
        const found = [];
        const Q = {};
        const alphabet = "abcdefghijklmnoprstuqvwxyz";
        const next = [];
        const finalList = [];

        let index = 0;
        const add_to_queue = (Q, X) => {
            ++index;
            Q[index] = X;

            return index;
        };

        const q0 = this.root.arrFirst.sort();

        const index_q0 = add_to_queue(Q, q0);

        if (this.has_end_mark(q0))
        {
            finalList.push(0); // index of q0
        }

        while (Object.keys(Q).length > found.length)
        {
            const index_q = this.find_first_allowed(Q, found);
            const q = Q[index_q];

            // d append

            found.push(index_q);

            for (const symbol of alphabet)
            {
                let reunion = [];
                q
                    .filter((position) => this.followList[position].item === symbol)
                    .forEach((position) => {
                        reunion = [...reunion, ...this.followList[position].list];
                    });
                const position_set = new Set(reunion);
                const U = [...position_set].sort();
                
                if (debug && U.length)
                {
                    console.log("step:", symbol, q, U);
                }

                if (U.length)
                {
                    let index_U = null

                    if (this.not_in(Q, U))
                    {
                        index_U = add_to_queue(Q, U);

                        if (this.has_end_mark(U))
                        {
                            finalList.push(index_U);
                        }
                    }
                    else
                    {
                        index_U = this.get_position(Q, U);
                    }

                    if(typeof next[index_q] === "undefined") {
                        next[index_q] = {};
                    }

                    next[index_q][symbol] = index_U;
                }
            }
        }

        return new DFA(Q, alphabet, next, 1, finalList);
    }
}

module.exports = Regex;