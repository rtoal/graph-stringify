import assert from "assert/strict";
import stringify from "../index.js";

class Program {
  constructor(statements) {
    this.statements = statements;
  }
}

class Assignment {
  constructor(target, source) {
    Object.assign(this, { target, source });
  }
}

class Break {}

class BinaryExpression {
  constructor(op, left, right) {
    Object.assign(this, { op, left, right });
  }
}

class Call {
  constructor(callee, args) {
    Object.assign(this, { callee, args });
  }
}

const callMinOf1And2 = new Call("min", [1, 2]);

const selfRef = { x: 1 };
selfRef.y = selfRef;

const firstMutual = { name: "sodium" };
const secondMutual = { name: "chlorine", partner: firstMutual };
firstMutual.partner = secondMutual;

const fixture = [
  {
    scenario: "a basic object",
    source: { x: 1, y: 2 },
    expected: `   1 | Object x=1 y=2`,
  },
  {
    scenario: "an object with an array",
    source: { a: 3, b: [1, "dog"] },
    expected: "   1 | Object a=3 b=[1,'dog']",
  },
  {
    scenario: "an object with undefined and null and NaN",
    source: { a: undefined, b: null, c: NaN },
    expected: "   1 | Object a=undefined b=null c=NaN",
  },
  {
    scenario: "an object with more numbers",
    source: { a: 89n, b: 99.882571e5 },
    expected: "   1 | Object a=89n b=9988257.1",
  },
  {
    scenario: "an object with booleans",
    source: { a: true, b: false, c: 5.5e-1 },
    expected: "   1 | Object a=true b=false c=0.55",
  },
  {
    scenario: "an object with symbols",
    source: { a: Symbol("hello"), b: Symbol() },
    expected: "   1 | Object a=Symbol(hello) b=Symbol()",
  },
  {
    scenario: "an object with functions",
    source: { a: Math.sqrt, b: (x, y) => y - x },
    expected: "   1 | Object a=<Function> b=<Function>",
  },
  {
    scenario: "a simple AST",
    source: new Program([new Assignment("x", 3), new Break()]),
    expected: `   1 | Program statements=[#2,#3]
   2 | Assignment target='x' source=3
   3 | Break `,
  },
  {
    scenario: "a more complex AST",
    source: new Program([
      new Assignment(
        "y",
        new BinaryExpression("*", new Call("hypot", [3, 5]), "x")
      ),
    ]),
    expected: `   1 | Program statements=[#2]
   2 | Assignment target='y' source=#3
   3 | BinaryExpression op='*' left=#4 right='x'
   4 | Call callee='hypot' args=[3,5]`,
  },
  {
    scenario: "an object appearing multiple times",
    source: { a: callMinOf1And2, b: callMinOf1And2 },
    expected: `   1 | Object a=#2 b=#2
   2 | Call callee='min' args=[1,2]`,
  },
  {
    scenario: "a self-referential object",
    source: selfRef,
    expected: "   1 | Object x=1 y=#1",
  },
  {
    scenario: "mutual self-reference",
    source: firstMutual,
    expected: `   1 | Object name='sodium' partner=#2
   2 | Object name='chlorine' partner=#1`,
  },
];

describe("The stringify function", () => {
  for (const primitive of [undefined, null, false, 8, "dog"]) {
    it(`ignores the primitive value ${primitive}`, () => {
      assert.equal(stringify(primitive), "");
    });
  }
  for (const { scenario, source, expected } of fixture) {
    it(`correctly stringifies ${scenario}`, () => {
      assert.equal(stringify(source), expected);
    });
  }
});
