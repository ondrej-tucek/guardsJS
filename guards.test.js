import fc from 'fast-check';
import * as G from './guards';


describe('Guard function', () => {
  test('should throw an error because of bad input arguments', () => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.constant([2]), fc.constant((x) => x), fc.constant(5), fc.constant([G.notZero])
        ),
        fc.oneof(
          fc.constant([2]), fc.constant((x) => x), fc.constant("f"), fc.constant(5)
        ),
        (guards, f) => {
          expect(() => {
            G.guard(guards, f);
          }).toThrow();
        }
      )
    ), { verbose: true }
  });

  test(`with guards: [notZero, isLess(5)] and 'fn(x) => 10 / x'
              should return value or throw an error`, () => {
    const fun = G.guard([G.notZero, G.isLess(5)], (x) => 10 / x);

    fc.assert(
      fc.property(
        fc.oneof(fc.double(), fc.constant(0), fc.integer()),
        fc.oneof(fc.double(), fc.string(), fc.integer()),
        (v1, v2) => {

          try {
            expect(fun(v1, v2)).toBeLessThan(5);
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    )
  });

  test(`with guards: [notZero, isLess, isGreater(3)] and 'fn(x, y) => x + y'
              should return value or throw an error`, () => {
    const fun = G.guard([G.notZero, G.isLess(1), G.isGreater(3)], (x, y) => x + y);

    fc.assert(
      fc.property(
        fc.oneof(fc.double(), fc.constant(0), fc.integer()),
        fc.oneof(fc.double(), fc.string(), fc.integer()),
        (v1, v2) => {

          try {
            expect(fun(v1, v2)).toBeGreaterThan(3);
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    )
  });
});


describe('Validator function', () => {
  test.each([
    ["notZero/1", G.notZero],
    ["notEmptyString/1", G.notEmptyString],
    ["notEmptyList/1", G.isEmptyList],
    ["isList/1", G.isList],
    ["isInteger/1", G.isInteger],
    ["isFloat/1", G.isFloat],
    ["isNumber/1", G.isNumber]
  ])('%s should return value or throw an error', (_fnName, fn) => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.string(),
          fc.integer(),
          fc.double(),
          fc.constantFrom([], 0),
          fc.array(fc.double())
        ), expected => {
          try {
            expect(fn(expected)).toBe(expected);
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    );
  });

  test.each([
    ["isLess/2", G.isLess],
    ["isLessOrEqual/2", G.isLessOrEqual],
    ["isGreater/2", G.isGreater],
    ["isGreaterOrEqual/2", G.isGreaterOrEqual]
  ])('%s should return value or throw an error', (_fnName, fn) => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.double(), fc.string(), fc.constantFrom([])),
        fc.oneof(fc.integer(), fc.double(), fc.string(), fc.constantFrom([])),
        (v, x) => {
          try {
            expect(fn(x, v)).toBe(v);
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    );
  });

  test.each([
    ["inRange/3", G.inRange],
    ["between/3", G.between]
  ])('%s should return value or throw an error', (_fnName, fn) => {
    fc.assert(
      fc.property(
        fc.oneof(fc.integer(), fc.double(), fc.string(), fc.constantFrom([])),
        fc.oneof(fc.integer(), fc.double(), fc.string(), fc.constantFrom([])),
        fc.oneof(fc.integer(), fc.double(), fc.string(), fc.constantFrom([])),
        (v, min, max) => {
          try {
            expect(fn(min, max, v)).toBe(v);
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    );
  });
});


describe('Helpers function', () => {
  test.each([
    ["isFunction/1", G.isFunction],
    ["isListFunctions/1", G.isListFunctions]
  ])('%s should return value or throw an error', (_fnName, fn) => {
    fc.assert(
      fc.property(
        fc.oneof(
          fc.func(fc.double().noShrink()),
          fc.array(fc.func(fc.nat().noShrink())),
          fc.constantFrom([], 0),
          fc.string().noShrink()
        ), f => {
          try {
            expect(fn(f)).toBeTruthy();
          } catch (e) {
            expect(e).toBeInstanceOf(Error);
          }
        }
      )
    );
  });
});
