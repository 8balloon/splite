import { TestedType, TypeTestError, TestedTypeAsync } from "./main";

declare const IntegerSignature: unique symbol;

const Integer = TestedType<number, typeof IntegerSignature>(
  (n) => parseInt(n.toString()) === n
);

describe("verified type", () => {
  it(`can be created`, () => {
    expect(Integer.test(2)).toEqual(2);
  });
  it(`can be reassigned`, () => {
    let result = Integer.test(2);
    result = Integer.test(3);
    // result = 4 // typescript error
    expect(result).toEqual(3);
  });
  it(`rejects value that fails verification`, () => {
    expect(() => Integer.test(1.5)).toThrow(TypeTestError);
  });
  it(`works ok with testSafe`, () => {
    const bad = Integer.testSafe(1.3);
    // const b2: number = bad // should throw type error... it's not being picked up on though (at least in vscode). The "| null" condition is being lost
    expect(bad).toBeNull();
    const good = Integer.testSafe(4);
    expect(good).toEqual(4);
  });
});

declare const OddNumberSignature: unique symbol;
const OddNumber = TestedTypeAsync<number, typeof OddNumberSignature>((n) =>
  Promise.resolve(n % 2 === 1)
);

describe("async verified type", () => {
  it(`can be created`, async () => {
    const result = await OddNumber.test(3);
    expect(result).toEqual(3);
  });
  it(`can be reassigned`, async () => {
    let result = await OddNumber.test(3);
    result = await OddNumber.test(5);
    // result = 44 // typescript error
    expect(result).toEqual(5);
  });
  it(`rejects value that fails verification`, async () => {
    await expect(OddNumber.test(2)).rejects.toThrow(TypeTestError);
  });
  it(`works with testSafe`, async () => {
    const good = await OddNumber.testSafe(5);
    expect(good).toEqual(5);
    const bad = await OddNumber.testSafe(2.3);
    // const b2: number = bad // should throw type error... it's not being picked up on though (at least in vscode). The "| null" condition is being lost
    expect(bad).toBeNull();
  });
});
