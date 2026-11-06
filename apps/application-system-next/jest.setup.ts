// Tells React that tests run in an act() environment, so `act()` from `react`
// flushes updates without warning that the environment is not configured for
// it. React reads this global but its type definitions do not declare it.
declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined
}

globalThis.IS_REACT_ACT_ENVIRONMENT = true

export {}
