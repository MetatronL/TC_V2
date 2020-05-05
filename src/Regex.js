const RegexNode = require("./RegexNode.js");

class Regex
{
    constructor(strRegularExpression)
    {
        this.root = new RegexNode(strRegularExpression);
        this.followList = [];
        this.run();
    }

    run()
    {
        this.root.build();
    }

    has_end_mark(arrPositionList)
    {
        return arrPositionList.some((index) => this.followList[index].item === "#");
    }

    different_arrays(arrQ, arrM)
    {
        if (arrQ.length != arrM.length) {
            return false;
        }

        return arrQ.every((value, index) => value === arrM[index]);
    }

    not_in(M, arrQ)
    {
        return M.some((arrM) => !this.different_arrays(arrQ, arrM));
    }

    get_position(M, arrQ)
    {
        return M.findIndex((arrM) => !this.different_arrays(arrQ, arrM));
    }

    find_first_allowed(Q, M)
    {
        for (const arrQ of Q)
        {
            if (!this.not_in(M, arrQ))
            {
                continue;
            }

            return arrQ;
        }

        return null;
    }

    to_dfa()
    {
        const M = [];
        const Q = [];
        const V = "abc";
        const next = []
        const F = [];

        const q0 = this.root.arrFirst.sort();

        Q.push(q0);

        if (this.has_end_mark(q0))
        {
            F.push(0); // index of q0
        }

        while (Q.length > M.length)
        {
            const q = this.find_first_allowed(Q, M);

            // d append

            M.push(q);

            for (const symbol of V)
            {
                let reunion = [];
                q
                    .filter((position) => this.followList[position].item === symbol)
                    .forEach((position) => {
                        reunion = [...U, ...this.followList[position].list];
                    });
                const position_set = new Set(reunion);
                const U = [...position_set].sort();
                
                if (U.length)
                {
                    if (this.not_in(Q, U))
                    {
                        Q.push(U);
                        if (this.has_end_mark(U))
                        {
                            F.push(U);
                        }
                    }


                }
            }



        }


    }
}