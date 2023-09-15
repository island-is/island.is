export {}
declare global {
  namespace jest {
    interface Expect {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      anyOf(input: any[])
    }
  }
}
