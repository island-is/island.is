// global.d.ts
export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveCountGreaterThan(a: number): R
      toBeApplication(ofType?: string): R
    }
  }
}
export default {}
