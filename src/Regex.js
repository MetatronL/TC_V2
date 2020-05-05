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

    // Aceasta functie determina daca setul curent de noduri contine un nod considerat ca pozitie finala #
    has_end_mark(arrPositionList)
    {
        return arrPositionList.some((index) => this.followList[index].item === "#");
    }

    // determina 2 vectori sunt ehivalenti
    same_arrays(arrQ, arrM)
    {
        if (arrQ.length != arrM.length) {
            return false;
        }

        return arrQ.every((value, index) => value === arrM[index]);
    }

    // Verifica daca un set se afla in lista Q de set-uri
    not_in(Q, arrQ)
    {
        return !Object.values(Q).some((arrM) => this.same_arrays(arrQ, arrM));
    }

    // Determina pozitia unui set in lista (daca exista)
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

    // Returneaza primul set de noduri care nu a fost deja verificat
    find_first_allowed(Q, found)
    {
        return Object.keys(Q).find((index) => !found.includes(index));
    }

    to_dfa({ debug = false } = {})
    {
        const found = []; // id-uri seturi verificate deja
        const Q = {}; // lista de tip [index : set] pentru seturile de noduri
        const alphabet = "abcdefghijklmnoprstuqvwxyz";
        const next = []; // lista de tranzitii de genul: next(1, "a") = 2
        const finalList = []; // id-uri seturi finale

        let index = 0;
        const add_to_queue = (Q, X) => { // adauga setul curent in lista
            ++index;
            Q[index] = X;

            return index;
        };

        // setul de start
        const q0 = this.root.arrFirst.sort();
        const index_q0 = add_to_queue(Q, q0);

        // daca setul de start este considerat de asemenea set de iesire
        // salvam id-ul in lista de set-uri de iesire
        if (this.has_end_mark(q0))
        {
            finalList.push(0); // index of q0
        }

        // cat exista, extragem starile neverificate
        // si construim starile consecutive
        while (Object.keys(Q).length > found.length)
        {
            // prima stare neverificata gasita
            const index_q = this.find_first_allowed(Q, found);
            const q = Q[index_q];

            // memoram ca l-am verificat
            found.push(index_q);

            // pentru fiecare symbol al alphabet-ului incercam sa cream stari noi
            for (const symbol of alphabet)
            {
                // pentru fiecare nod din set (starea curenta)
                // cautam tranzitiile disponibile prin symbol-ul current
                // si cream o stare noua
                let reunion = [];
                q
                    .filter((position) => this.followList[position].item === symbol) // selectam doar tranzitiile cu symbolul curent
                    .forEach((position) => { // reunim tranzitiile intr-un set bou
                        reunion = [...reunion, ...this.followList[position].list];
                    });
                
                // eliminam duplicatele
                const position_set = new Set(reunion);
                const U = [...position_set].sort();
                
                if (debug && U.length)
                {
                    console.log("step:", symbol, q, U);
                }

                // daca exista tranzitii (stare noua)
                if (U.length)
                {
                    let index_U = null;
                    // Daca starea este noua, o adaugam la lista de stari
                    // Altfel cautam index-ul starii

                    if (this.not_in(Q, U))
                    {
                        index_U = add_to_queue(Q, U);

                        // Daca starea curenta este considerata stare finala
                        // O adaugam la lista de stari finale
                        if (this.has_end_mark(U))
                        {
                            finalList.push(index_U);
                        }
                    }
                    else
                    {
                        index_U = this.get_position(Q, U);
                    }

                    // adaugam noua tranzitie din q in U prin symbolul curent
                    if(typeof next[index_q] === "undefined") {
                        next[index_q] = {};
                    }
                    next[index_q][symbol] = index_U;
                }
            }
        }

        // Returnam DFA-ul rezultat in urma calculelor
        return new DFA(Q, alphabet, next, index_q0, finalList);
    }
}

module.exports = Regex;