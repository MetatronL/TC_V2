class DFA
{
    constructor(Q, alphabet, next, q0, finalList)
    {
        this.Q = Q; // lista de noduri (generata din seturile de noduri NFA)
        this.alphabet = alphabet;
        this.next = next; // lista de tranzitii pentru stari
        this.q0 = q0; // starea initiala
        this.finalList = finalList; // lista de stari finale
    }

    run(word, debug)
    {
        let q = this.q0;

        // Pornind de la nodul initial
        // Pentru un cuvant dat parcurgem symbol-urile
        // Incercam sa gasim starea urmatoare specifica symbol-ului (daca exista)
        for(const symbol of word)
        {
            if (typeof this.next[q] === "undefined") {
                if (debug) {
                    console.log("Starea curenta nu are tranzitii.");
                }
                return false;
            }
            else if (typeof this.next[q][symbol] === "undefined") {
                if (debug) {
                    console.log(`Starea curenta nu are tranzitii pentru simbolul "${symbol}".`);
                }
                return false;
            }
            // mergem in starea urmatoare
            q = this.next[q][symbol];
        }

        // verificam daca nodul in care ne-am oprit nu este final
        if (!this.finalList.includes(q)) {
            if (debug) {
                console.log("Nu a fost atins un nod final.");
            }
            return false;
        }

        return true;
    }

    print(elementHTML = null) // Afisam tranzitiile
    {
        console.log("DFA states and transitions:");
        Object.keys(this.Q).forEach(element => {
            const isFinal = this.finalList.includes(Number.parseInt(element));
            console.log(`${element}:`, this.next[element] || "", isFinal ? "The end.." : "");

            if (element)
            {
                console.log(element);
                if (elementHTML)
                {
                    elementHTML.innerHTML = elementHTML.innerHTML +  `${element}: ${this.next[element] ? JSON.stringify(this.next[element]) : ""} ${isFinal ? "The end.." : ""}`; 
                    elementHTML.innerHTML += "</br>";
                }
            }
        });


        if (elementHTML)
        {
            elementHTML.innerHTML += "</br>";
        }

        console.log("");
    }
}

// export default DFA;