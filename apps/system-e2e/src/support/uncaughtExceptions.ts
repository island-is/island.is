const resizeObserverLoopErrRe = /^ResizeObserver loop limit exceeded/

Cypress.on('uncaught:exception', (err) => {
  // Someone somewhere is using ResizeObserver, which is throwing an unhandled exception:
  // This needs to be "ignored" in Cypress: https://stackoverflow.com/a/50387233
  if (resizeObserverLoopErrRe.test(err.message)) {
    // returning false here prevents Cypress from
    // failing the test
    return false
  }
})
