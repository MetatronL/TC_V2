// import Validator from "./src/Validator.js";

const Validator = require("./src/Validator.js");
const Regex = require("./src/Regex.js");


const runTest = () => {

};


const __run__ = () => {
    //const regex = "(ab|c)#";

    //const regex = "((a|b)(c|d))#";
    const regex = "(c(a|b)d)#";

    console.log(regex);

    const dfa_maker = new Regex(regex);
    dfa_maker.run();
    const regex_dfa = dfa_maker.to_dfa();

    // console.log(dfa_maker);
    console.log(dfa_maker.root.children[0]);
    console.log(dfa_maker.root.children[1]);

    // console.log(regex_dfa);
    regex_dfa.print();

    console.log(regex_dfa.run("cad"));
    console.log(regex_dfa.run("cbd"));
    console.log(regex_dfa.run("cbd"));
};


__run__();