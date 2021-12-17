import { VerifiedType, TypeVerificationError, VerifiedTypeAsync } from "./main";

declare const IntegerSignature: unique symbol;
const Integer = VerifiedType<number, typeof IntegerSignature>(
  (n) => parseInt(n.toString()) === n
);

describe("verified type", () => {
  it(`can be created`, () => {
    expect(Integer.create(2)).toEqual(2);
  });
  it(`rejects value that fails verification`, () => {
    expect(() => Integer.create(1.5)).toThrow(TypeVerificationError);
  });
});

declare const OddNumberSignature: unique symbol;
const OddNumber = VerifiedTypeAsync<number, typeof OddNumberSignature>((n) =>
  Promise.resolve(n % 2 === 1)
);

describe("async verified type", () => {
  it(`can be created`, async () => {
    const result = await OddNumber.create(3);
    expect(result).toEqual(3);
  });
  it(`rejects value that fails verification`, async () => {
    await expect(OddNumber.create(2)).rejects.toThrow(TypeVerificationError);
  });
});
