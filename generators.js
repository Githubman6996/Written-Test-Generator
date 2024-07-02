window.addEventListener("error", e => alert(e.message))

const genRandom = seed => sfc32(...cyrb128(seed));
export const seed = new URLSearchParams(window.location.search).get("code") || (window.location.href = "/?code=" + Date.now().toString(36));
console.log(seed)
Math.random = genRandom(seed);

const precidence = {
    "^": 4,
    "*": 3,
    "%": 3,
    "/": 3,
    "+": 2,
    "-": 2,
}
const fakePrecidences = [
    {
        "^": 1,
        "*": 1,
        "%": 1,
        "/": 1,
        "+": 1,
        "-": 1,
    },
    {
        "^": 2,
        "*": 3,
        "%": 3,
        "/": 3,
        "+": 4,
        "-": 4,
    }
]

const operations = [
    ["()", "[]"],
    ["!", "~"],
    ["(cast)", "new"],
    ["*", "/", "%"],
    ["-", "+"],
    ["<<", ">>"],
    ["<", "<=", ">", ">=", "instanceof"],
    ["==", "!="],
    ["&"],
    ["^"],
    ["|"],
    ["&&"],
    ["||"],
    ["?:"],
    ["=", "+=", "-=", "*=", "/=", "%=", "&=", "^=", "|=", "<<=", ">>=", ">>="],
    ["->"]
];

const operationVals = {};
for (let i = 0; i < operations.length; i++) {
    for (const op of operations[i]) {
        operationVals[op] = i;
    }
}

String.prototype.compareTo = function (str) {
    for (let i = 0; i < this.length && i < str.length; i++)
        if (str.charAt(i) != this.charAt(i))
            return this.charCodeAt(i) - str.charCodeAt(i);
    return this.length - str.length;
}

const genStr = () => randArr(["Aerell", "Jod", "UIL", "Gen", "Chapela", "Hershie", "Pookie", "Robbie", "Black", "Privilege", "Awesome", "CodeHS", "VSCode", "IDE", "2604", "CSHS", "CyWoodsSux", "IAmCool", "Javascript", "Java", "CompSci", "bruh"]);
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const parseNum = (n, digits) => n.toLocaleString(undefined, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
}).replace(/,/g, "");
const randArr = arr => arr[Math.floor(Math.random() * arr.length)];
const parseBase = (num, b) => num.toString(b) + "_" + b;
export const shuffle = arr => {
    for (let i = 0; i < arr.length - 1; i++) {
        let c = Math.floor(Math.random() * (arr.length - i)) + i;
        let t = arr[i];
        arr[i] = arr[c];
        arr[c] = t;
    }
    return arr;
}

function genMath(doubles) {
    const size = Math.floor(Math.random() * 2) + 3;
    let nums = [];
    for (let i = 0; i < size; i++)
        nums.push((Math.random() < 0.5 ? -1 : 1) * parseNum(Math.floor(Math.random() * 950) / 10, doubles ? 1 : 0))
    let str = "" + nums[0];
    for (let i = 1; i < size; i++) {
        str += " " + randArr(["+", "-", "*", "/"]) + " " + nums[i];
    }
    return str;
}

const generators = [
    function gen1() {
        const base = randInt(2, 16);
        if (Math.random() < 0.5) {
            // Arithmetic
            let num1 = randInt(2, 50);
            let num2 = randInt(2, 50);
            let ans, base2 = randInt(2, 16);
            const operation = randArr(["*", "/", "+", "-"]);
            let bases = [base]
            while (bases.length < 6)
                bases.push(randInt(2, 16));
            shuffle(bases);
            switch (operation) {
                case "*": {
                    ans = num1 * num2;
                    break;
                }
                case "/": {
                    if (num2 > num1) [num1, num2] = [num2, num1];
                    ans = Math.floor(num1 / num2);
                    break;
                }
                case "+": {
                    ans = num1 + num2;
                    break;
                }
                case "-": {
                    if (num2 > num1) [num1, num2] = [num2, num1];
                    ans = num1 - num2;
                    break;
                }
            }
            const wrongs = new Set([ans]);
            while (wrongs.size < 5)
                wrongs.add(ans + randInt(-4, 4));
            return {
                ans: [...wrongs].map((x, i) => parseBase(x, bases[i])),
                cor: parseBase(ans, bases[0]),
                que: `Evaluate ${parseBase(num1, base)} ${operation} ${parseBase(num2, base2)}`
            }
        }
        // Conversion
        let num1 = randInt(10, 128);
        let ans = num1;
        const wrongs = new Set([ans]);
        let bases = new Set([base]);
        while (wrongs.size < 5)
            wrongs.add(num1 + randInt(-4, 4));
        while (bases.size < 6)
            bases.add(randInt(2, 16));
        bases = [...bases];
        return {
            que: `Which of the following is equivalent to ${parseBase(num1, base)}`,
            cor: parseBase(ans, bases[1]),
            ans: [...wrongs].map((x, i) => parseBase(x, bases[i + 1]))
        }
    },
    function gen2() {
        const size = Math.floor(Math.random() * 2) + 3;
        let nums = [];
        for (let i = 0; i < size; i++)
            nums.push((Math.random() < 0.5 ? -1 : 1) * Math.floor(Math.random() * 95) + 2);
        let str = "" + nums[0];
        // let wrongs = Array(4).fill("" + nums[0] + Math.floor(Math.random() * 10));
        for (let i = 1; i < size; i++) {
            str += " " + randArr(["+", "-", "*", "/"]) + " " + nums[i];
            // for (let j = 0; j < wrongs.length; j++) wrongs[j] += ` ${randArr(["+", "-", "*", "/"])} ${nums[i] + Math.floor(Math.random() * 10)}`;
        }
        let ans = evaluatePolish(polishNotation(str));
        const anss = [ans].concat(fakePrecidences.map(x => evaluatePolish(polishNotation(str, x))));
        const wrongs = new Set(anss);
        console.log([...wrongs])
        while (wrongs.size < 5) wrongs.add(+randArr(anss) + Math.floor(Math.random() * 10) - 5);
        console.log(wrongs)
        return {
            que: "What is the output of the code segment to the right?",
            code: `out.print(${str});`,
            ans: [...wrongs],
            cor: ans
        }
    },
    function gen3() {
        const method = randArr(["printf", "print"]);
        switch (method) {
            case "printf":
                const formats = {
                    int: ["d"],
                    double: [".2f", ".1f", ".3f"],
                    String: ["s", "S"]
                }
                const variables = shuffle("abcdefghijklmnopqrstuvwxyz".split("")).slice(0, Math.floor(Math.random() * 3) + 3).map(x => {
                    const type = randArr(["int", "double", "String"]);
                    return { type, x, format: randArr(formats[type]), value: type == "String" ? genStr() : +parseNum(Math.floor(Math.random() * 950) / 10, type == "double")};
                });
                const code = variables.map(({type, x, value}) => {
                    if (type == "String") return `String ${x} = "${value}";`;
                    return `${type} ${x} = ${value};`;
                }).join("\n") + `\n\nout.printf("${shuffle(variables).map(({type, x, format}) => `%${format}`).join(" ")}", ${variables.map(x => x.x).join(", ")});`;
                const ans = variables.map(v => {
                    if (v.type == "double") switch(v.format) {
                        case ".3f": return parseNum(v.value, 3);
                        case ".2f": return parseNum(v.value, 2);
                        case ".1f": return parseNum(v.value, 1);
                        default: return v.value;
                    }
                    if (v.type == "String" && v.format == "S") return v.value.toUpperCase();
                    return v.value
                }).join(" ");
                const wrongs = new Set([ans]);
                let tries = 20;
                while (wrongs.size < 5 && tries-- > 0) {
                    wrongs.add(variables.map(v => {
                        if (v.type == "double") return parseNum(v.value, Math.floor(Math.random() * 4));
                        if (v.type == "String" && Math.random() < 0.5) return v.value.toUpperCase();
                        return v.value
                    }).join(" "));
                }
                if (tries < 0) return gen3();
                return {
                    que: "What is the output of the code segment to the right?",
                    code,
                    ans: [...wrongs],
                    cor: ans
                }
            case "print": {
                let code = "";
                let ans = "";
                const strings = [];
                const count = Math.floor(Math.random() * 3) + 3;
                for (let i = 0; i < count; i++) {
                    const ln = Math.random() < 0.5;
                    const type = randArr(["String", "int", "double", "char"]);
                    switch (type) {
                        case "String": {
                            const str = strings[i] = genStr();
                            code += `out.print${ln ? "ln" : ""}("${str}");\n`;
                            ans += str + (ln ? "\n" : "");
                            break;
                        }
                        case "int":
                        case "double": {
                            const num = strings[i] = parseNum(Math.floor(Math.random() * 950) / 10, type == "double");
                            code += `out.print${ln ? "ln" : ""}(${num});\n`;
                            ans += num + (ln ? "\n" : "");
                            break;
                        }
                        case "char": {
                            if (Math.random() < 0.333333333) {
                                const char1 = randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charCodeAt(0);
                                const char2 = randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charCodeAt(0);
                                const num = char1 + char2;
                                strings[i] = [char1 + char2, String.fromCharCode(char1) + String.fromCharCode(char2)];
                                code += `out.print${ln ? "ln" : ""}('${String.fromCharCode(char1)}' + '${String.fromCharCode(char2)}');\n`;
                                ans += num + (ln ? "\n" : "");
                                break;
                            }
                            if (Math.random() < 0.5) {
                                if (Math.random() < 0.5) {
                                    let char1 = randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charCodeAt(0);
                                    let char2 = +parseNum(randInt(10, 1000) / 10, Math.random() < 0.5);
                                    const num = char1 + char2;
                                    strings[i] = [char1 + char2, String.fromCharCode(char1) + char2];
                                    code += `out.print${ln ? "ln" : ""}('${String.fromCharCode(char1)}' + ${char2});\n`;
                                    ans += num + (ln ? "\n" : "");
                                    break;
                                }
                                let char2 = randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charCodeAt(0);
                                let char1 = +parseNum(randInt(10, 1000) / 10, Math.random() < 0.5);
                                const num = char1 + char2;
                                strings[i] = [char1 + char2, char1 + String.fromCharCode(char2)];
                                code += `out.print${ln ? "ln" : ""}(${char1} + '${String.fromCharCode(char2)}');\n`;
                                ans += num + (ln ? "\n" : "");
                                break;
                            }
                            const num = randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
                            strings[i] = [num, num.charCodeAt(0)];
                            code += `out.print${ln ? "ln" : ""}('${num}');\n`;
                            ans += num + (ln ? "\n" : "");
                            break;
                        }
                    }
                }
                const wrongs = new Set([ans.trim()]);
                let tries = 20;
                while (wrongs.size < 5 && tries-- > 0) {
                    let ans = "";
                    for (let i = 0; i < count; i++) {
                        const ln = Math.random() < 0.5;
                        // if (Array.isArray(strings[i])) alert(JSON.stringify(strings[i]))
                        if (Array.isArray(strings[i])) ans += randArr(strings[i]) + (ln ? "\n" : "");
                        else ans += strings[i] + (ln ? "\n" : "");
                    }
                    wrongs.add(ans.trim());
                }
                if(wrongs.size < 5) return gen3()
                return { 
                    que: "What is the output of the code segment to the right?",
                    code, ans: [...wrongs], cor: ans.trim()
                }
            }
        }
    },
    function gen4() {
        const method = randArr(["compareTo", "indexOf", "lastIndexOf", "substring"]);
        switch (method) {
            case "compareTo": {
                const str1 = genStr();
                const str2 = genStr();
                const ans = str1.compareTo(str2);
                return {
                    que: "What is the output of the code segment to the right?",
                    code: `out.print("${str1}".compareTo("${str2}"));`,
                    ans: Array(5).fill(ans).map((x, i) => x + i - 2),
                    cor: ans
                }
            }
            case "indexOf": {
                const str1 = genStr();
                const letter = randArr(str1.split(""));
                if (Math.random() < 0.5) {
                    const cor = str1.indexOf(letter);
                    const ans = new Set([cor]);
                    let tries = 20;
                    while (ans.size < 5 && tries-->0) ans.add(Math.floor(Math.random() * (str1.length + 1)) - 1)
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.print("${str1}".indexOf("${letter}"));`,
                        ans: [...ans],
                        cor
                    }
                }
                const ind = Math.floor(Math.random() * (str1.length - 1)) + 1;
                const cor = str1.indexOf(letter, ind);
                const ans = new Set([cor]);
                let tries = 20;
                while (ans.size < 5 && tries-->0) ans.add(Math.floor(Math.random() * (str1.length + 1)) - 1)
                return {
                    que: "What is the output of the code segment to the right?",
                    code: `out.print("${str1}".indexOf("${letter}", ${ind}));`,
                    ans: [...ans],
                    cor
                }
            }
            case "lastIndexOf": {
                const str1 = genStr();
                const letter = randArr(str1.split(""));
                if (Math.random() < 0.5) {
                    const cor = str1.lastIndexOf(letter);
                    const ans = new Set([cor]);
                    let tries = 20;
                    while (ans.size < 5 && tries-->0) ans.add(Math.floor(Math.random() * (str1.length + 1)) - 1)
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.print("${str1}".lastIndexOf("${letter}"));`,
                        ans: [...ans],
                        cor
                    }
                }
                const ind = Math.floor(Math.random() * (str1.length - 1)) + 1;
                const cor = str1.lastIndexOf(letter, ind);
                const ans = new Set([cor]);
                let tries = 20;
                while (ans.size < 5 && tries-->0) ans.add(Math.floor(Math.random() * (str1.length + 1)) - 1)
                return {
                    que: "What is the output of the code segment to the right?",
                    code: `out.print("${str1}".lastIndexOf("${letter}", ${ind}));`,
                    ans: [...ans],
                    cor
                }
            }
            case "substring": {
                const str1 = genStr();
                let i = Math.floor(Math.random() * (str1.length - 1)) + 1;
                console.log(str1)
                if (Math.random() < 0.5) {
                    const cor = str1.slice(i);
                    const ans = new Set([cor]);
                    let tries = 20;
                    while (ans.size < 5 && tries-->0) ans.add(str1.slice(Math.floor(Math.random() * (str1.length - 1)) + 1));
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.print("${str1}".substring(${i}));`,
                        ans: [...ans],
                        cor
                    }
                }
                let j = i;
                while (i == j) j = Math.floor(Math.random() * (str1.length + 1));
                if (i > j) [i, j] = [j, i];
                const cor = str1.slice(i, j);
                const ans = new Set([cor]);
                let tries = 20;
                while (ans.size < 5 && tries-->0) {
                    let i = Math.floor(Math.random() * (str1.length - 1)) + 1;
                    let j = i;
                    while (i == j) j = Math.floor(Math.random() * (str1.length + 1));
                    if (i > j) [i, j] = [j, i];
                    ans.add(str1.slice(i, j));
                }
                return {
                    que: "What is the output of the code segment to the right?",
                    code: `out.print("${str1}".substring(${i}, ${j}));`,
                    ans: [...ans],
                    cor
                }
            }
        }
    },
    function gen5() {
        const size = Math.floor(Math.random() * 3) + 2;
        let nums = [];
        for (let i = 0; i < size; i++)
            nums.push(Math.round(Math.random()));
        let str = "" + (!!nums[0]).toString();
        for (let i = 1; i < size; i++) {
            str += " " + randArr(["&&", "&", "||", "|", "^"]) + " " + (!!nums[i]).toString();
        }
        return {
            que: "What is the output of the code segment to the right?",
            code: `out.print(${str});`,
            ans: [true, false],
            cor: !!eval(str)
        }
    },
    function gen6() {
        function gen() {
            const method = randArr(["abs", "ceil", "floor", "max", "min", "round", "signum"]);
            switch (method) {
                case "abs": {
                    const str = genMath();
                    const ans = Math.abs(evaluatePolish(polishNotation(str)));
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.abs(${str}));`,
                        cor: ans
                    }
                }
                case "ceil": {
                    const str = genMath(true);
                    const ans = Math.ceil(evaluatePolish(polishNotation(str))) + ".0";
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.ceil(${str}));`,
                        cor: ans
                    }
                }
                case "floor": {
                    const str = genMath(true);
                    const ans = Math.floor(evaluatePolish(polishNotation(str))) + ".0";
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.floor(${str}));`,
                        cor: ans
                    }
                }
                case "max": {
                    const n1 = Math.floor(Math.random() * 101);
                    let n2 = n1;
                    while (n2 == n1) n2 = Math.floor(Math.random() * 101);
                    const ans = Math.max(n1, n2);
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.max(${n1}, ${n2}));`,
                        cor: ans
                    }
                }
                case "min": {
                    const n1 = Math.floor(Math.random() * 101);
                    let n2 = n1;
                    while (n2 == n1) n2 = Math.floor(Math.random() * 101);
                    const ans = Math.min(n1, n2);
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.min(${n1}, ${n2}));`,
                        cor: ans
                    }
                }
                case "round": {
                    const str = genMath(true);
                    const ans = Math.round(evaluatePolish(polishNotation(str))) + ".0";
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.round(${str}));`,
                        cor: ans
                    }
                }
                default:
                case "signum": {
                    const str = genMath(true);
                    const ans = Math.sign(evaluatePolish(polishNotation(str))) + ".0";
                    const wrongs = new Set([ans]);
                    while (wrongs.size < 5) wrongs.add(parseNum(parseFloat(ans) + Math.floor(Math.random() * 10) - 5, 1));
                    return {
                        que: "What is the output of the code segment to the right?",
                        code: `out.println(Math.signum(${str}));`,
                        cor: ans,
                        ans: [...wrongs]
                    }
                }
            }
        }
        const a = gen();
        const ans = new Set([a.cor]);
        if (!a.ans) {
            if (String(a.cor).includes(".")) while (ans.size < 5) ans.add(parseNum(parseFloat(a.cor) + Math.floor(Math.random() * 100) / 10 - 5, 1));
            else while (ans.size < 5) ans.add(parseNum(+a.cor + Math.floor(Math.random() * 10) - 5));
            a.ans = [...ans];
        }
        return a;
    },
    function gen7() {
        function gen() {
            const size = Math.floor(Math.random() * 3) + 3;
            const variables = shuffle("abcdefghijklmnopqrstuvwxyz".split("")).slice(0, size).map(x => {
                const type = randArr(["int", "int", "double", "double", "char"]);
                const value = type == "char" ? randArr("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ").charCodeAt(0) : +parseNum(Math.floor(Math.random() * 950) / 10, type == "double");
                return { type, x, value };
            });
            let nums = [];
            for (let i = 0; i < size; i++)
                nums.push(variables[i].x);
            let str = "" + nums[0];
            const va = variables.find(x => x.x == nums[0]);
            let str2 = parseNum(va.value, va.type == "double");
            for (let i = 1; i < size; i++) {
                const op = randArr(["+", "-", "*", "/"])
                str += " " + op + " " + nums[i];
                const va = variables.find(x => x.x == nums[i]);
                str2 += " " + op + " " + parseNum(va.value, va.type == "double");
            }
            const ans = evaluatePolish(polishNotation(str2));
            return {
                que: "What is the output of the code segment to the right?",
                code: variables.map(({type, x, value}) => `${type} ${x} = ${type == "char" ? `'${String.fromCharCode(value)}'` : parseNum(value, type == "double")};`).join("\n") + `\n\nout.println(${str});`,
                cor: String(ans)
            }
        }
        let a = gen();
        while (String(a.cor).length > 5) a = gen();
        const ans = new Set([a.cor]);
        if (String(a.cor).includes(".")) while (ans.size < 5) ans.add(parseNum(+a.cor + Math.floor(Math.random() * 100) / 10 - 5), 1);
        else while (ans.size < 5) ans.add(parseNum(+a.cor + Math.floor(Math.random() * 10) - 5));
        a.ans = [...ans];
        return a;
    },
    function gen8() {
        const genComp = () => randArr("< > <= >= == !=".split(' '));
        const genCondition = variables => {
            let nums = variables.filter(a => a.type == "int" || a.type == "double");
            let condition = ""
            for (let i = 0; i < nums.length; i++) {
                const va = nums[i].x
                const vb = ++i < nums.length ? nums[i].x : randArr([Math.floor(Math.random() * 950) / 10, Math.floor(Math.random() * 95) + 2]);
                condition += `${i == 1 ? "" : " else "}if (${va} ${genComp()} ${vb}) {\n    ${randArr([
                    `out.print(${randArr([`"${genStr()}"`, randArr(["++" + va, va, va + "++"]), randArr(["++" + vb, vb, vb + "++"]), randArr(["--" + va, va, va + "--"]), randArr(["--" + vb, vb, vb + "--"])])})`,
                    `${va} += ${vb}`,
                    `${va} -= ${vb}`,
                    `${va}++`,
                    `${va}--`,
                ])};\n}`;
            }
            const [{x: va}, {x: vb}] = shuffle([...variables]);
            return condition + ` else {\n    ${randArr([
                `out.print(${randArr([`"${genStr()}"`, randArr(["++" + va, va, va + "++"]), randArr(["++" + vb, vb, vb + "++"]), randArr(["--" + va, va, va + "--"]), randArr(["--" + vb, vb, vb + "--"])])})`,
                `${va} += ${vb}`,
                `${va} -= ${vb}`,
                `${va}++`,
                `${va}--`,
            ])};\n}`;
        }
        return randArr([
            () => {
                const variables = shuffle("abcdefghijklmnopqrstuvwxyz".split("")).slice(0, Math.floor(Math.random() * 3) + 3).map(x => {
                    const type = randArr(["int", "double"]);
                    const value = +parseNum(Math.floor(Math.random() * 950) / 10, type == "double");
                    return { type, x, value };
                });
                const script = variables.map(({type, x, value}) => `${type} ${x} = ${type == "char" ? `'${String.fromCharCode(value)}'` : value};`).join("\n") + "\n\n" + genCondition(variables);
                const printf = Math.random() < 0.5;
                const res = eval("(() => {\nlet res = '';\n" + script.replace(/int |double /g, "let ").replace(/out\.print\((.+?)\)/g, "res += $1") + `\nreturn res + ${variables.map(x => `${(x.type == "int" || !printf) ? "+" : ""}${x.x}.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                })`).join(` + " " + `)}\n})()`);
                return {
                    que: "What is the output of the code segment to the right?",
                    code: script + "\n\n" + (printf ? `out.printf("${variables.map(x => x.type == "int" ? "%d" : "%.2f").join(' ')}", ${variables.map(x => x.x).join(", ")});` : `out.print(${variables.map(x => x.x).join(` + " " + `)});`),
                    ans: [res],
                    cor: res
                }
            }
        ])();
    },
    function gen9() {
        let first = Math.floor(Math.random() * 51);
        let inc = Math.floor(Math.random() * 5) + 1;
        let second = Math.floor(Math.random() * 33 * inc) + first;
        const v = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
        const num = Math.floor(Math.random() * 3) + 1;
        let ans = 0;
        for (let i = first; i <= second; i += inc) ans += num;
        const ans2 = ((Math.ceil((second - first) / inc) + ((second - first) % inc == 0)) * num);
        const wrongs = new Set([ans]);
        while (wrongs.size < 5) wrongs.add(ans + Math.floor(Math.random() * 10) - 5);
        const sym = randArr(["*", ".", "#", "@"]);
        return {
            que: `How many ${sym}'s are printed by the code to the right?`,
            code: `for (int ${v} = ${first}; ${v} <= ${second}; ${v} += ${inc}) {\n    out.print("${sym.repeat(num)}");\n}`,
            cor: ans, ans: [...wrongs]
        }
    },
    function gen10() {
        const arr = shuffle(new Array(Math.floor(Math.random() * 6) + 5).fill().map((x, i) => i));
        const arr2 = [...arr];
        const genMut = () => {
            const ind = Math.floor(Math.random() * (arr2.length + 2)) - 1;
            if (ind == -1) return `arr[arr.length - 1]`;
            if (ind == arr2.length) return `arr[${genMut()}]`;
            return `arr[${ind}]`;
        }
        let src = "";
        for (let i = 0; i < Math.floor(Math.random() * 3) + 3; i++) {
            src += `arr[${Math.floor(Math.random() * arr.length)}] = ${genMut()};\n`;
        }
        // console.log(src)
        eval(src.replace(/arr/g, "arr2"));
        const ans = `[${arr2.join(", ")}]`;
        const wrongs = new Set([ans]);
        let tries = 20;
        while (wrongs.size < 5) {
            if (--tries < 0) return gen10();
            eval(`${genMut()} = ${genMut()}`.replace(/arr/g, "arr2"));
            wrongs.add(`[${arr2.join(", ")}]`);
        }
        return {
            que: "What is the output of the code segment to the right?",
            code: `int[] arr = {${arr.join(", ")}};\n${src}\nout.println(Arrays.toString(arr));`,
            cor: ans,
            ans: [...wrongs]
        }
    },
    function gen11() {
        return {
            que: "just skip this one",
            ans: ["Scanner & File Class"],
            cor: "Scanner & File Class"
        }
    },
    function gen12() {
        function gen() {
            const method = randArr(["summation", "product"]);
            switch(method) {
                case "summation": {
                    const type = randArr(["+=i", "+=x", "+=i ++", "+=x ++"]);
                    switch (type) {
                        case "+=i": {
                            const x = Math.pow(2, Math.floor(Math.random() * 6) + 3);
                            let c = 0;
                            for (let i = 0; i < x; i++) c += i;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 0;\nfor (int i = 0; i < ${x}; i++) {\n    c += i;\n}`,
                                cor: c
                            }
                        }
                        case "+=x": {
                            const x = Math.floor(Math.pow(2, Math.random() * 6 + 3));
                            let c = 0;
                            for (let i = 1; i <= x; i += i) c += i;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 0;\nfor (int i = 1; i <= ${x}; i += i) {\n    c += i;\n}`,
                                cor: c
                            }
                        }
                        case "+=i ++": {
                            const x = Math.pow(2, Math.floor(Math.random() * 6) + 3);
                            let c = 0;
                            for (let i = 0; i < x; i++) c++;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 0;\nfor (int i = 0; i < ${x}; i++) {\n    c++;\n}`,
                                cor: c
                            }
                        }
                        case "+=x ++": {
                            const x = Math.floor(Math.pow(2, Math.random() * 6 + 3));
                            let c = 0;
                            for (let i = 1; i <= x; i += i) c++;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 0;\nfor (int i = 1; i <= ${x}; i += i) {\n    c++;\n}`,
                                cor: c
                            }
                        }
                    }
                }
                case "product": {
                    const type = randArr(["+=i", "+=x"]);
                    switch (type) {
                        case "+=i": {
                            const x = Math.pow(2, Math.floor(Math.random() * 3) + 1);
                            let c = 1;
                            for (let i = 1; i < x; i++) c *= i;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 1;\nfor (int i = 1; i < ${x}; i++) {\n    c *= i;\n}`,
                                cor: c
                            }
                        }
                        case "+=x": {
                            const x = Math.pow(2, Math.floor(Math.random() * 3) + 1);
                            let c = 1;
                            for (let i = 1; i <= x; i += i) c *= i;
                            return {
                                que: "What is the output of the code segment to the right?",
                                code: `int c = 1;\nfor (int i = 1; i <= ${x}; i += i) {\n    c *= i;\n}`,
                                cor: c
                            }
                        }
                    }
                }
            }
        }
        let a = gen();
        const wrongs = new Set([a.cor]);
        while (wrongs.size < 5) wrongs.add(a.cor + Math.floor(Math.random() * 10) - 5);
        a.ans = [...wrongs];
        return a;
    },
    function gen13() {
        if (Math.random() < 0.3333333333) {
            let str = "" + randInt(0, 80);
            for (let i = 1; i < Math.floor(Math.random() * 4) + 3; i++)
                str += " " + randArr(["*", "/", "%", "-", "+"]) + " " + randInt(0, 80) * Math.sign(Math.random() - 0.1);
            const cor = evaluatePolish(polishNotation(str));
            const ans = new Set([cor]);
            while (ans.size < 5) ans.add(+cor + randInt(-5, 5));
            return {
                que: "What is the output of the code segment to the right?",
                code: `out.print(${str});`,
                cor, ans: [...ans]
            }
        }
        if (Math.random() < 0.5) {
            let str = "" + randInt(0, 80);
            for (let i = 1; i < Math.floor(Math.random() * 4) + 3; i++)
                str += " " + randArr(["<<", ">>", "&", "|", "^", "-", "+", "%"]) + " " + randInt(0, 80);
            const cor = eval(str);
            const ans = new Set([cor]);
            while (ans.size < 5) ans.add(+cor + randInt(-5, 5));
            return {
                que: "What is the output of the code segment to the right?",
                code: `out.print(${str});`,
                cor, ans: [...ans]
            }
        }
        const ops = shuffle([...operations]);
        const c = Math.floor(Math.random() * 2) + 3
        const picks = ops.slice(0, c).map(x => randArr(x));
        const ans = [...picks].sort((a, b) => operationVals[a] - operationVals[b]).map(x => {
            const ind = picks.indexOf(x);
            return ind == 3 ? "IV" : "I".repeat(ind + 1)
        }).join(" ");
        const wrongs = new Set([ans]);
        const perms = shuffle(permute(Array.from({ length: c }, (x, i) => i == 3 ? "IV" : "I".repeat(i + 1))));
        while (wrongs.size < 3) {
            wrongs.add(perms.pop().join(" "))
        }
        return {
            que: "What is the correct order of operations for the operators listed on the right?",
            code: picks.map((x, i) => (i == 3 ? "IV" : "I".repeat(i + 1)) + ". " + x).join("\n"),
            cor: ans,
            ans: [...wrongs]
        }
    }
]

function recursive(results, result, nums) {
    if (result.length === nums.length) return results.push(result.slice());
    for (var i = 0; i < nums.length; i++) {
        if (result.includes(nums[i])) continue;
        result.push(nums[i]);
        recursive(results, result, nums);
        result.pop();
    }
}

function permute(nums) {
    const results = [];
    recursive(results, [], nums);
    return results;
};


export function generate(d = 0) {
    if (d == 50) return console.log("bruh")
    try {
        return generators.map((x, i) => {
            let a = x();
            console.log(a);
            return a;
        });
    } catch (e) {
        console.error(e.message)
        return generate(d + 1);
    }
}

export function specific(q, d=0) {
    if (d == 50) return console.log("bruh")
    try {
        if (generators[q - 1]) return Array(15).fill(generators[q - 1]).map((x, i) => {
            let a = x();
            console.log(a);
            return a;
        });
        return generate(d);
    } catch (e) {
        console.error(e.message)
        return specific(q, d + 1);
    }
}

function sfc32(a, b, c, d) {
    return function() {
      a |= 0; b |= 0; c |= 0; d |= 0; 
      var t = (a + b | 0) + d | 0;
      d = d + 1 | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    h1 ^= (h2 ^ h3 ^ h4), h2 ^= h1, h3 ^= h1, h4 ^= h1;
    return [h1>>>0, h2>>>0, h3>>>0, h4>>>0];
}

function evaluatePolish(arr) {
    arr.reverse();
    const ans = [];
    // console.log(arr);
    while (arr.length) {
        const token = arr.pop();
        // console.log(token)
        if (!isNaN(parseFloat(token))) ans.push(token);
        else {
            let n2 = ans.pop(),
                n1 = ans.pop();
            let val;
            let isDouble = n1.indexOf(".") != -1 || n2.indexOf(".") != -1;
            n1 = parseFloat(n1);
            n2 = parseFloat(n2);
            switch (token) {
                case "^": val = Math.pow(n1, n2); break;
                case "*": val = n1 * n2; break;
                case "%": val = n1 % n2; break;
                case "/": val = isDouble ? n1 / n2 : Math.sign(n1 * n2) * Math.floor(Math.abs(n1 / n2)); break;
                case "+": val = n1 + n2; break;
                case "-": val = n1 - n2; break;
                default: throw new Error("bad operator: " + token);
            }
            ans.push(parseNum(val, isDouble));
        }
    }
    return parseFloat(ans[0]);
}

function polishNotation(string, prec = precidence) {
    string = string.split(" ").reverse();
    const output = [];
    const operators = [];
    while (string.length) {
        const token = string.pop();
        if (!isNaN(parseFloat(token))) output.push(token);
        else if (/[a-zA-Z_]+/.test(token)) operators.push(token);
        else if (token in prec || /\*|\/|\+|-|\^/.test(token)) {
            let o2;
            while (
                operators.length && (o2 = operators[operators.length - 1]) != "("
                && (prec[o2] > prec[token] || prec[o2] == prec[token] && token != "^")
            )
                output.push(operators.pop());
            operators.push(token);
        } else if (token == ",") {
            while (operators[operators.length - 1] != "(")
                output.push(operators.pop());
        } else if (token == "(") operators.push("(");
        else if (token == ")") {
            while (operators[operators.length - 1] != "(") {
                if (operators.length == 0) throw new Error("bad math expression");
                output.push(operators.pop());
            }
            if (operators[operators.length - 1] == "(") //throw new Error("bad math expression");
                operators.pop();
            
            if (operators.length && /[a-zA-Z_]+/.test(operators[operators.length - 1])) output.push(operators.pop());
        }
        // console.log(output, operators, token);
    }
    while (operators.length) if (operators[operators.length - 1] != "(") output.push(operators.pop());
    return output;
}