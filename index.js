
// import Regex from "./src/Regex.js";

// Am scris cateva teste pentru a verifica corectitudinea algoritmului


class test
{
    runTest(debug = false, element = null) {
        const tests = [
            {
                regex: "(c(a|b)d)#",
                inputs: [
                    {
                        text: "cad",
                        response: true,
                    },
                    {
                        text: "cbd",
                        response: true,
                    },
                    {
                        text: "cabd",
                        response: false,
                    },
                ],
            },
            {
                regex: "(h(a|b)(c|d)h)#",
                inputs: [
                    {
                        text: "hach",
                        response: true,
                    },
                    {
                        text: "hadh",
                        response: true,
                    },
                    {
                        text: "hbch",
                        response: true,
                    },
                    {
                        text: "hbdh",
                        response: true,
                    },
                    {
                        text: "hhhh",
                        response: false,
                    },
                ],
            },
            {
                regex: "(abc*)#",
                inputs: [
                    {
                        text: "abc",
                        response: true,
                    },
                    {
                        text: "abcccc",
                        response: true,
                    },
                    {
                        text: "abccccb",
                        response: false,
                    },
                    {
                        text: "abd",
                        response: false,
                    },
                    {
                        text: "ab",
                        response: true,
                    },
                ],
            },


            {
                regex: "(x((a|b)(c|d))*)#",
                inputs: [
                    {
                        text: "xac",
                        response: true,
                    },
                    {
                        text: "xad",
                        response: true,
                    },
                    {
                        text: "x",
                        response: true,
                    },
                    {
                        text: "xacac",
                        response: true,
                    },
                    {
                        text: "xacadbcbd",
                        response: true,
                    },
                ],
            },


            {
                regex: "(aaa|aab|aac)#",
                inputs: [
                    {
                        text: "aaa",
                        response: true,
                    },
                    {
                        text: "aab",
                        response: true,
                    },
                    {
                        text: "aac",
                        response: true,
                    },
                    {
                        text: "aad",
                        response: false,
                    },
                    {
                        text: "aaaa",
                        response: false,
                    },
                ],
            },
        ];


// aici
// sunt folosite clasele

        tests.forEach((test) => {
            console.log("regex:", test.regex);
            console.log("");

            if (element)
            {
                element.innerHTML += `regex: ${test.regex}`;
                element.innerHTML += "</br>";
                element.innerHTML += "</br>";
            }

            const generator = new Regex(test.regex, debug);
            generator.run({ debug });
            const dfa = generator.to_dfa({ debug });

            dfa.print(element);

            for(const input of test.inputs)
            {
                try
                {
                    const response = dfa.run(input.text, debug);
                    if (response === input.response)
                    {
                        console.log(`[good] "${input.text}" = ${response}`);

                        if (element)
                        {
                            element.innerHTML += `[good] "${input.text}" = ${response}`;
                            element.innerHTML += "</br>";
                        }
                    }
                    else
                    {
                        console.log(`[bad] "${input.text}" = ${response} !!!`);

                        if (element)
                        {
                            element.innerHTML += `[bad] "${input.text}" = ${response} !!!`;
                            element.innerHTML += "</br>";
                        }
                    }
                }
                catch (error)
                {
                    console.log(input.txt);
                    console.error(error);
                }
            }

            if (element)
            {
                element.innerHTML += "</br>";
                element.innerHTML += "</br>";
            }

            console.log("");
        });
    }


    __run__() {
        const debug = false;

        setTimeout(() => {
            let element = null;
            if (typeof document !== "undefined" && document && window)
            {
                if(document.querySelector && document.querySelector("._game_output_inner"))
                {
                    element = document.querySelector("._game_output_inner");
                }
            }
            console.log(element);
            this.runTest(debug, element);
        }, 500);
    };
}

const _test = new test();
_test.__run__();

var run_regex = (regex, word, debug = false) => 
{
    const generator = new Regex(regex, debug);
    generator.run({ debug });
    const dfa = generator.to_dfa({ debug });

    dfa.print();

    const response = dfa.run(word, debug);
    console.log(`"${word}" = ${response}`);
}


 // export default test;