import * as React from "react";
import { makeAutoObservable } from "mobx";
import { observer } from "mobx-react";
import { ensureInitialized, log } from "./reduxDevToolLogger";

const stores: any = {};
let storesJson = {};
function updateStoresJson(storeName: any, storeBase: any) {
  storesJson = {
    ...storesJson,
    [storeName]: JSON.parse(JSON.stringify(storeBase)),
  };
}

const stack: string[] = [];

export function store<T extends object>(
  storeName: string,
  storeBase: any /*T*/
): T {
  if (stores[storeName]) {
    throw new Error(`storeName "${storeName}" is already in use`);
  }
  if (Object.getPrototypeOf(storeBase) !== Object.getPrototypeOf({})) {
    throw new Error("storeBase must be a plain object");
  }
  updateStoresJson(storeName, storeBase);
  Object.keys(storeBase).forEach((key) => {
    const { value } = Object.getOwnPropertyDescriptor(storeBase, key) || {};
    if (value instanceof Function) {
      const boundMethod = value.bind(storeBase);
      storeBase[key] = (...args: any) => {
        // TODO: remove all `: any` declarations
        ensureInitialized(storesJson);
        const stackSnapshot = [...stack];
        const methodSignature = `${storeName}.${key}`;
        stack.push(methodSignature);
        boundMethod(...args);
        stack.pop();
        updateStoresJson(storeName, storeBase);
        log(
          { type: methodSignature, methodCallStack: stackSnapshot },
          storesJson
        );
      };
    }
  });
  makeAutoObservable(storeBase);
  const store = storeBase as T;
  stores[storeName] = store;
  setTimeout(() => ensureInitialized(storesJson));
  return store;
}

export function view<T>(
  ComponentOrFallback: React.ComponentType<T>,
  ComponentAsSecondArg: React.ComponentType | null = null
): React.ComponentType<T> {
  const Component = observer(ComponentAsSecondArg || ComponentOrFallback);
  const Fallback = ComponentAsSecondArg ? ComponentOrFallback : null;
  return (props) => {
    if (Fallback) {
      return (
        <React.Suspense fallback={<Fallback {...props} />}>
          <Component {...props} />
        </React.Suspense>
      );
    } else {
      return <Component {...props} />;
    }
  };
}
