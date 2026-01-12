import '@vanilla-extract/css/disableRuntimeStyles'

// Only import jest-dom for .tsx test files to avoid memory leaks in .ts files
if (expect.getState().testPath?.endsWith('.spec.tsx')) {
  import('@testing-library/jest-dom')
}

jest.setTimeout(60000)
