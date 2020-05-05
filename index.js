const Validator = require("./src/Validator.js");
const Regex = require("./src/Regex.js");

// Am scris cateva teste pentru a verifica corectitudinea algoritmului

const runTest = (debug = false) => {
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


    tests.forEach((test) => {
        console.log("regex:", test.regex);
        console.log("");

        const generator = new Regex(test.regex, debug);
        generator.run({ debug });
        const dfa = generator.to_dfa({ debug });

        
        dfa.print();

        for(const input of test.inputs)
        {
            try
            {
                const response = dfa.run(input.text, debug);
                if (response === input.response)
                {
                    console.log(`[good] "${input.text}" = ${response}`);
                }
                else
                {
                    console.log(`[bad] "${input.text}" = ${response} !!!`);
                }
            }
            catch (error)
            {
                console.log(input.txt);
                console.error(error);
            }
        }

        console.log("");
    });
};


const __run__ = () => {
    const debug = false;
    runTest(debug);
};


__run__();