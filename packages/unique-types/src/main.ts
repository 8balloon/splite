export type Signed<T, UuniqueSymbolSignature extends symbol> = T & {
  signature: UuniqueSymbolSignature;
};

export class TypeVerificationError extends TypeError {}

export function VerifiedType<T, UuniqueSymbolSignature extends symbol>(
  verifies: (candidate: T) => boolean
) {
  return {
    create(base: T) {
      if (verifies(base) === false) {
        throw new TypeVerificationError();
      }
      return base as Signed<T, UuniqueSymbolSignature>;
    },
    verifies,
  };
}

export function VerifiedTypeAsync<T, UuniqueSymbolSignature extends symbol>(
  verifies: (candidate: T) => Promise<boolean>
) {
  return {
    async create(base: T) {
      if ((await verifies(base)) === false) {
        throw new TypeVerificationError();
      }
      return base as Signed<T, UuniqueSymbolSignature>;
    },
    verifies,
  };
}

// TODO: async support

/*
^^ SIGNED types (verified types? verified = signed + checked) (include & { signature: uniqueSignatureSymbol })
BRANDED types: https://medium.com/@KevinBGreene/surviving-the-typescript-ecosystem-branding-and-type-tagging-6cf6e516523d / https://github.com/pelotom/runtypes
*/
