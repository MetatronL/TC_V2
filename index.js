// import Validator from "./src/Validator.js";

const Validator = require("./src/Validator.js");
const Regex = require("./src/Regex.js");


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
                    text: "abd",
                    response: false,
                },
                {
                    text: "ab",
                    response: true,
                },
            ],
        },
    ];


    tests.forEach((test) => {
        console.log("regex:", test.regex);
        console.log("");

        const generator = new Regex(test.regex);
        generator.run({ debug });
        const dfa = generator.to_dfa({ debug });

        if (debug)
        {
            dfa.print();
        }

        for(const input of test.inputs)
        {
            try
            {
                const response = dfa.run(input.text, { debug });
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
        console.log("");
    });
};


const __run__ = () => {
    //const regex = "(ab|c)#";

    //const regex = "((a|b)(c|d))#";
    // const regex = "(c(a|b)d)#";

    // console.log(regex);

    // const dfa_maker = new Regex(regex);
    // dfa_maker.run();
    // const regex_dfa = dfa_maker.to_dfa();

    // // console.log(dfa_maker);
    // // console.log(dfa_maker.root.children[0]);
    // // console.log(dfa_maker.root.children[1]);

    // // console.log(regex_dfa);
    // regex_dfa.print();

    // console.log(regex_dfa.run("cad"));
    // console.log(regex_dfa.run("cbd"));
    // console.log(regex_dfa.run("cabd"));

    const debug = false;
    runTest(debug);
};


__run__();