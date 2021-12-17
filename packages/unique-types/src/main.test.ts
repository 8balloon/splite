import { AutographedType, AutographError, AutographedTypeAsync } from "./main";

declare const IntegerSignature: unique symbol;
const Integer = AutographedType<number, typeof IntegerSignature>(
  (n) => parseInt(n.toString()) === n
);

describe("verified type", () => {
  it(`can be created`, () => {
    expect(Integer.sign(2)).toEqual(2);
  });
  it(`can be reassigned`, () => {
    let result = Integer.sign(2);
    result = Integer.sign(3);
    // result = 4 // typescript error
    expect(result).toEqual(3);
  });
  it(`rejects value that fails verification`, () => {
    expect(() => Integer.sign(1.5)).toThrow(AutographError);
  });
});

declare const OddNumberSignature: unique symbol;
const OddNumber = AutographedTypeAsync<number, typeof OddNumberSignature>((n) =>
  Promise.resolve(n % 2 === 1)
);

describe("async verified type", () => {
  it(`can be created`, async () => {
    const result = await OddNumber.sign(3);
    expect(result).toEqual(3);
  });
  it(`can be reassigned`, async () => {
    let result = await OddNumber.sign(3);
    result = await OddNumber.sign(5);
    // result = 44 // typescript error
    expect(result).toEqual(5);
  });
  it(`rejects value that fails verification`, async () => {
    await expect(OddNumber.sign(2)).rejects.toThrow(AutographError);
  });
});
