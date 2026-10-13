// Renders island-ui components under jest. Two things are needed for that, and
// both of them only here — nothing in src/ imports either.
//
// The babel plugin in jest.config.ts gives every `.css.ts` module the file scope
// vanilla-extract's `style()` demands; this swaps the runtime for the mock
// adapter, so those calls hand back a class name instead of trying to inject a
// stylesheet into jsdom. Together they are what let a spec render a component
// that reaches island-ui, which the sorting and paging controls on the
// launagreining tables do.
import '@vanilla-extract/css/disableRuntimeStyles'
import '@testing-library/jest-dom'
