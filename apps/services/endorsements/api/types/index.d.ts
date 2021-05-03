export {}
declare global {
  namespace jest {
    interface Expect {
      anyOf(input: any[])
    }
  }
}
