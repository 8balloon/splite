export type autographed<T, UuniqueSymbolAutograph extends symbol> = T & {
  autograph: UuniqueSymbolAutograph;
};

export class AutographError extends TypeError {}

export function AutographedType<T, UuniqueSymbolAutograph extends symbol>(
  accepts: (candidate: T) => boolean
) {
  return {
    sign(base: T) {
      if (accepts(base) === false) {
        throw new AutographError();
      }
      return base as autographed<T, UuniqueSymbolAutograph>;
    },
    accepts,
  };
}

export function AutographedTypeAsync<T, UuniqueSymbolAutograph extends symbol>(
  accepts: (candidate: T) => Promise<boolean>
) {
  return {
    async sign(base: T) {
      if ((await accepts(base)) === false) {
        throw new AutographError();
      }
      return base as autographed<T, UuniqueSymbolAutograph>;
    },
    accepts,
  };
}
