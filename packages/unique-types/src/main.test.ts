import { VerifiedType, TypeVerificationError } from "./main";

declare const IntegerTag: unique symbol;
const Integer = VerifiedType<number, typeof IntegerTag>(
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
