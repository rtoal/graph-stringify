# graph-stringify

A simple way to produce a compact string representation of an object graph, one node per line. Nodes are tagged with a unique id to properly handle nodes that appear multiple times, as well as cycles.

## Installation

Install via:

```
npm install graph-stringify
```

The sole function is available as the default:

```js
import stringify from "graph-stringify";
```

## Usage

### stringify(obj, keyProperty)

`obj` is the object to stringify. `keyProperty` is the property of the object that serves as its “type” for pretty printing. If omitted, the object’s constructor’s name is used.

Basic primitives such as `undefined`, `null`, numbers, bigints, booleans, strings, and symbols are ignored when passed directly to this function.

If an object is received, its object graph is written with one node per line. Each line contains the node’s type followed by a list of its properties in `name=value` format. Non-object values are output in place with `util.inspect`, function values are output as `<Function>`, and object values (including arrays) are written in subsequent lines and referred to by a reference number.

### Examples

When invoked without the `keyProperty` argument:

<table>
<tr><th>Source string</th><th>Stringified</th></tr>

<tr><td>

```
{x: 1, y: ["x", false], z: null}
```

</td><td>

```
   1 | Object x=1 y=['x',false] z=null
```

</td></tr>

<tr><td>

```
new Program([
  new Assignment("x", 3),
  new Break()
])
```

</td><td>

```
   1 | Program statements=[#2,#3]
   2 | Assignment target='x' source=3
   3 | Break
```

</td></tr>

<tr><td>

```
new Program([
  new Assignment(
    "y",
    new BinaryExpression(
      "*",
      new Call("hypot", [3, 5]), "x"
     )
  ),
])
```

</td><td>

```
1 | Program statements=[#2]
2 | Assignment target='y' source=#3
3 | BinaryExpression op='\*' left=#4 right='x'
4 | Call callee='hypot' args=[3,5]
```

</td></tr>

<tr><td>

```
let [a, b, c, d] = [
  new Node("A"),
  new Node("B"),
  new Node("C"),
  new Node("D")
];
a.successors = [b, c, d];
b.successors = [c];
c.successors = [b, c];
d.successors = [a, d];
```

</td><td>

```
   1 | Node name='A' successors=[#2,#3,#4]
   2 | Node name='B' successors=[#3]
   3 | Node name='C' successors=[#2,#3]
   4 | Node name='D' successors=[#1,#4]
```

</td></tr>
</table>

With the `keyProperty` argument, e.g. `stringify(obj, "kind")`:

<table>
<tr><th>Source string</th><th>Stringified</th></tr>

<tr><td>

```
{
  kind: "Program",
  statements: [
    { kind: "Assignment", target: "x", source: 3 },
    { kind: "Break" },
  ],
}
```

</td><td>

```
   1 | Program statements=[#2,#3]
   2 | Assignment target='x' source=3
   3 | Break
```

</td></tr>

<tr><td>

```
{
  kind: "Program",
  statements: [
    {
      kind: "Assignment",
      target: "y",
      source: {
        kind: "BinaryExpression",
        op: "*",
        left: { kind: "Call", callee: "hypot", args: [3, 5] },
        right: "x",
      },
    },
  ],
}
```

</td><td>

```
1 | Program statements=[#2]
2 | Assignment target='y' source=#3
3 | BinaryExpression op='\*' left=#4 right='x'
4 | Call callee='hypot' args=[3,5]
```

</td></tr>
</table>

Additional examples are found in the test folder.
