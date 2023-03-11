# graph-stringify

Compact string representation of an object graph, one node per line

## Installation

```
npm install graph-stringify
```

```js
import stringify from "graph-stringify";
```

## stringify(obj)

Accepts a single object argument.

Basic primitives such as `undefined`, `null`, numbers, bigints, booleans, strings, and symbols are ignored when passed directly to this function.

If an object is received, its object graph is written with one node per line. Each line contains the node’s constructor name followed by a list of its properties in `name=value` format. Values that are primitive are written in place, but those that are objects (including arrays) are written in subsequent lines and referred to by a reference number.
