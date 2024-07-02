import { seed, shuffle, generate, specific } from "./generators.js";
let q = new URLSearchParams(window.location.search).get("q");
const questions = q ? specific(q) : generate();

function addProps(obj, props) {
    for (const prop in props)
        if (typeof props[prop] == "object") addProps(obj[prop], props[prop]);
        else obj[prop] = props[prop];
}
function addChildren(element, children) {
    for (const child of children) {
        if (Array.isArray(child)) addChildren(element, child);
        else child && element.append(child);
    }
}

function createElement(type, props, ...children) {
    const element = document.createElement(type);
    props && addProps(element, props);
    children.length && addChildren(element, children);
    return element;
}

document.body.appendChild(createElement("div", { className: "seed" }, `Code: ${seed}`, createElement("button", {
    className: "newCode",
    onclick: e => window.location.href = "/?code=" + Date.now().toString(36)
}, "New Code"), createElement("button", {
    className: "check",
    onclick: e => alert(check())
}, "Check"), createElement("form", {
    className: "specific",
    onsubmit: e => {
        console.log(e)
        const a = new URLSearchParams();
        a.set("q", e.target[0].value);
        a.set("code", Date.now().toString(36))
        window.location.href = "/?" + a;
        return false;
    }
}, createElement("input", {
    type: "tel",
    placeholder: "Question Number",
    value: q
}, "New Code"), createElement("button", {
    type: "submit"
}, "Set Question"))))

document.body.appendChild(createElement("div", {
    className: "uilPage"
}, questions.map(({que, ans, code, cor}, i) => {
    if (new Set(ans).size != ans.length) console.warn("Dupe Answers", i + 1, { que, ans, code })
    const question = createElement("div", {
        className: "question"
    }, que, createElement("div", {
        className: "answers",
        _question: i,
    }, [...ans].sort().map((x, i) => 
        createElement("div", {
            className: "answer",
            dataset: {
                letter: `${String.fromCharCode(65 + i)}) `,
                selected: false,
                correct: x == cor
            },
            _answer: x,
            onclick: e => {
                let selected = e.target.dataset.selected;
                e.target.style.color = null;
                for (const child of e.target.parentElement.children) {
                    child.dataset.selected = false;
                }
                e.target.dataset.selected = !eval(selected);
            }
        }, String(x))
    )))
    return createElement("div", {
        className: "questionContainer",
        dataset: {
            question: `Question ${i + 1}.`
        }
    }, code ? [question, createElement("div", { className: "code" }, code)] : question)
})))

window.check = function check() {
    let right = 0;
    let wrong = 0;
    for (const element of document.querySelectorAll(".answers:has(.answer[data-selected='true'])")) {
        const selected = element.querySelector("[data-selected='true']");
        selected.dataset.selected = false;
        if (selected.dataset.correct == "true") {
            right++;
            selected.style.color = "#0f0";
        } else {
            wrong++;
            selected.style.color = "red";
            element.querySelector("[data-correct='true']").style.color = "#0f0";
        }
    }
    return `${right * 6} - ${wrong * 2} = ${right * 6 - wrong * 2}`
}

// window.addEventListener("resize", async () => {
//     const size = Math.round(innerHeight / 2);
//     for (const element of document.querySelectorAll(".code")) {
//         let font = 16;
//         while (element.offsetWidth > size) {
//             element.fontSize = `${font--}px`
//             await new Promise(r => setTimeout(r))
//         }
//     }
// })