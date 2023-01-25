// global.d.ts
export {}

declare global {
  namespace PlaywrightTest {
    interface Matchers<R> {
      async toHaveCountGreaterThan(a: number): Promise<R>
      async toBeApplication(applicationType?: string): Promise<R>
    }
  }
}
export default {}
