import { ap, apply, curry, head, init, last, map, splitEvery, zip } from 'ramda';
import check from 'check-types';


// Description
// ----------------------------------------------------------------------------
// The `guard` function helps to verify an input parameters and result of your
// functions.
// You can use it as follow

//    const fun = guard(guards, fn);

// where:
//  `guards` is a list of validator functions,
//  `fn` is your function.
//
// Example
// ----------------------------------------------------------------------------
// > const tenDividedBy = guard([notZero, isLess(4)], (x) => 10 / x);
// > tenDividedBy(2) // 5
// > tenDividedBy(0) // Error: The value is zero!
// > tenDividedBy(5) // Error: The value is less than 4!
//
// Note
// ----------------------------------------------------------------------------
// This implementation of guard function is now for the case of a list
//
//    const fun = guard([g1, g2, gR], (x1, x2) => x1 + x2);

// where function g1 is guard for x1, function g2 for x2 and gR is guard for
// result of function (x1, x2).
//
// Also guard can be implemented as an object
//
//    const fun = guard({ pre: { x: g1, y: g2 }, post: gR }, (x, y) => x + y);
//


//  Guards

export function guard(guards, fn) {
  if (!(isListFunctions(guards) && isFunction(fn) && guards.length == arguments[1].length + 1)) {
    throw new Error('Size of validators list has to be same as a number of fn arguments.');
  }

  return (...args) => {
    const a = splitEvery(1, [...args]);
    const f = splitEvery(1, init(guards));

    map((e) => (ap(head(e), last(e))), zip(f, a));

    return apply(last(guards), [fn(...args)]);
  };
}


// Validators

export function notZero(v) {
  if (check.zero(v)) {
    throw new Error('The value is zero!');
  }

  return v;
}

export function notEmptyString(v) {
  if (check.emptyString(v)) {
    throw new Error('The string is empty!');
  }

  return v;
}

export function isList(v) {
  if (check.not.array(v)) {
    throw new Error('The value is not a list!');
  }

  return v;
}

export function isEmptyList(v) {
  if (check.emptyArray(v)) {
    throw new Error('The list is an empty!');
  }

  return v;
}


export function isInteger(v) {
  if (check.not.integer(v)) {
    throw new Error('The value is not an integer!');
  }

  return v;
}

export function isFloat(v) {
  if (check.not.float(v)) {
    throw new Error('The value is not a float!');
  }

  return v;
}

export function isNumber(v) {
  if (check.not.number(v)) {
    throw new Error('The value is not a number!');
  }

  return v;
}

export const isLess = curry((x0, v) => {
  if (check.less(v, x0)) {
    throw new Error('The value is less than ' + x0 + '!');
  }

  return v;
});

export const isLessOrEqual = curry((x0, v) => {
  if (check.lessOrEqual(v, x0)) {
    throw new Error('The value is less or equal to ' + x0 + '!');
  }

  return v;
});

export const isGreater = curry((x0, v) => {
  if (check.greater(v, x0)) {
    throw new Error('The value is greater than ' + x0 + '!');
  }

  return v;
});

export const isGreaterOrEqual = curry((x0, v) => {
  if (check.greaterOrEqual(v, x0)) {
    throw new Error('The value is  greater or equal to ' + x0 + '!');
  }

  return v;
});

export const inRange = curry((min, max, v) => {
  if (check.not.inRange(min, max, v)) {
    throw new Error('The value is not in range [' + min + ',' + max + ']!');
  }

  return v;
});

export const between = curry((min, max, v) => {
  if (check.not.between(min, max, v)) {
    throw new Error('The value is not in range (' + min + ',' + max + ')!');
  }

  return v;
});


// Helpers

export function isFunction(fn) {
  if (check.not.function(fn)) {
    throw new Error('The value is not function!');
  }

  return true;
}

export function isListFunctions(listFn) {
  if (check.any(check.map(listFn, check.not.function))) {
    throw new Error('The list does not contain functions!');
  }

  return true;
}
