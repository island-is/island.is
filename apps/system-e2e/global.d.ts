// global.d.ts
export {};

declare global {
  namespace PlaywrightTest {
    interface Matchers<R, T> {
      toHaveCountGreaterThan(a: number): R
    }
  }
}
