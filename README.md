## Description
The `guard` function helps to verify an input parameters and result of your
functions.
You can use it as follow

```js
   const fun = guard(guards, fn);
```

where:
* `guards` is a list of validator functions, e.g. `[g1, g2, gR]` where `g1` is function (guard) for variable `x1`, function `g2` for `x2` and `gR` is guard for result of `fn`,
* `fn` is your function.


## Usage

```js
> import * as G from './guards';

> const tenDividedBy = guard([notZero, isLess(4)], (x) => 10 / x);
> tenDividedBy(2) // 5
> tenDividedBy(0) // Error: The value is zero!
> tenDividedBy(5) // Error: The value is less than 4!


> const add = G.guard([G.notZero, G.isLess(1), G.isGreater(3)], (x, y) => x + y);
> add(2, 0) // ... try it yourselves
```

## Test
* all files
```bash
npm run test
```

* single file, e.g. guards.test.js
```bash
npm test -t Guard
```

## Dependencies
```node
"devDependencies": {
    "check-types": "^11.1.2",
    "fast-check": "^1.23.0",
    "jest": "25.1.0",
    "ramda": "^0.27.0"
}
```

