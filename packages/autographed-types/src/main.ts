export type tested<T, UTestSignatureUniqueSymbol extends symbol> = T & {
  testSignature: UTestSignatureUniqueSymbol;
};

export class TypeTestError extends TypeError {}

export function TestedType<T, UTestOkUniqueSymol extends symbol>(
  test: (value: T) => boolean
) {
  function testSafe(value: T) {
    if (test(value) === false) {
      return null;
    } else {
      return value as tested<T, UTestOkUniqueSymol>;
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
    testSafe(value: T) {
      const result = testSafe(value);
      return result as tested<T, UTestOkUniqueSymol> | null;
    },
  };
}

export function TestedTypeAsync<T, UTestOkUniqueSymol extends symbol>(
  test: (value: T) => Promise<boolean>
) {
  async function testSafe(value: T) {
    if ((await test(value)) === false) {
      return null;
    } else {
      return value as tested<T, UTestOkUniqueSymol>;
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
