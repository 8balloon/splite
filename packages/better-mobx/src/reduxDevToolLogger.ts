import { createStore } from "redux";

const extension: null | Function = (() => {
  if (typeof window === "undefined") {
    return null;
  }
  const windowRef: unknown = window;
  type ExtensionCarryingWindow = {
    __REDUX_DEVTOOLS_EXTENSION__: Function | null;
  };
  return (windowRef as ExtensionCarryingWindow).__REDUX_DEVTOOLS_EXTENSION__;
})();

const referenceStore = createStore(() => ({}));
let reduxStore: typeof referenceStore | null = null;

// set `nextState` to the state you want logged before `dispatch`ing
let nextState: {} | null = null;
const reducer = (_state, _action) => nextState;

let loggingForced = false;
export function forceLogging() {
  loggingForced = true;
}

export function ensureInitialized(baseState: {}) {
  if (!(extension || loggingForced)) {
    return;
  }
  nextState = baseState;
  if (!reduxStore) {
    if (extension) {
      reduxStore = createStore(reducer, baseState, extension());
    } else {
      reduxStore = createStore(reducer, baseState);
    }
  }
  return reduxStore;
}

interface LogEvent {
  type: string;
}

export function log<T extends LogEvent>(event: T, stateJson: {}) {
  if (!reduxStore) {
    ensureInitialized({});
  }
  nextState = stateJson;
  if (reduxStore !== null) {
    reduxStore.dispatch(event);
  }
  return reduxStore;
}
