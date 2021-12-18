export type tested<T, UTestSignatureUniqueSymbol extends symbol> = T & {
  testSignature: UTestSignatureUniqueSymbol;
};

export class TypeTestError extends TypeError {}

export function TestedType<T, UTestSignatureUniqueSymbol extends symbol>(
  test: (value: T) => boolean
) {
  function testSafe(value: T) {
    if (test(value) === false) {
      return null;
    } else {
      return value as tested<T, UTestSignatureUniqueSymbol>;
    }
  }
  return {
    test(value: T) {
      const result = testSafe(value);
      if (result === null) {
        throw new TypeTestError();
      }
      return result;
    },
    testSafe,
  };
}

export function TestedTypeAsync<T, UTestSignatureUniqueSymbol extends symbol>(
  test: (value: T) => Promise<boolean>
) {
  async function testSafe(value: T) {
    if ((await test(value)) === false) {
      return null;
    } else {
      return value as tested<T, UTestSignatureUniqueSymbol>;
    }
  }
  return {
    async test(value: T) {
      const result = await testSafe(value);
      if (result === null) {
        throw new TypeTestError();
      }
      return result;
    },
    testSafe,
  };
}
