// global.d.ts
export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      toHaveCountGreaterThan(a: number): Promise<R>
      toBeApplication(applicationType?: string): Promise<R>
    }
  }
}
export default {}
