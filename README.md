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

### stringify(obj)

Accepts a single object argument.

Basic primitives such as `undefined`, `null`, numbers, bigints, booleans, strings, and symbols are ignored when passed directly to this function.

If an object is received, its object graph is written with one node per line. Each line contains the node’s constructor name followed by a list of its properties in `name=value` format. Non-object values are output in place with `util.inspect`, function values are output as `<Function>`, and object values (including arrays) are written in subsequent lines and referred to by a reference number.

### Examples

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
</table>

Additional examples are found in the test folder.
