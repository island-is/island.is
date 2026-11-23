// Lets specs render island-ui components: vanilla-extract returns class names
// instead of injecting styles into jsdom.
import '@vanilla-extract/css/disableRuntimeStyles'
import '@testing-library/jest-dom'
