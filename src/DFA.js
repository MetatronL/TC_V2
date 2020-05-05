

class DFA
{
    constructor(Q, alphabet, next, q0, finalList)
    {
        this.Q = Q;
        this.alphabet = alphabet;
        this.next = next;
        this.q0 = q0;
        this.finalList = finalList;
    }

    run(word, debug)
    {
        let q = this.q0;
        for(const symbol of word)
        {
            if (typeof this.next[q] === "undefined")
            {
                if (debug)
                {
                    console.log("Starea curenta nu are tranzitii.");
                }
                return false;
            }
            else if (typeof this.next[q][symbol] === "undefined")
            {
                if (debug)
                {
                    console.log(`Starea curenta nu are tranzitii pentru simbolul "${symbol}".`);
                }
                return false;
            }

            q = this.next[q][symbol];
        }

        if (!this.finalList.includes(q))
        {
            if (debug)
            {
                console.log("Nu a fost atins un nod final.");
            }
            return false;
        }

        return true;
    }


    print()
    {
        console.log("DFA states and transitions:");
        // console.log(this);
        Object.keys(this.Q).forEach(element => {
            const isFinal = this.finalList.includes(element);
            console.log(`${element}:`, this.next[element], isFinal ? "F" : "");
        });
    }
}

module.exports = DFA;