import '@testing-library/jest-dom/extend-expect'
import '@vanilla-extract/css/disableRuntimeStyles'

window.scrollTo = () => undefined

global.ResizeObserver = class {
  observe = () => undefined
  unobserve = () => undefined
  disconnect = () => undefined
}
