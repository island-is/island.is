export const missing = (key: string): never => {
  throw new Error(
    `Validated tax calculator input is missing required field "${key}"`,
  )
}

export const mistyped = (key: string, expected: string): never => {
  throw new Error(
    `Validated tax calculator input has a non-${expected} value for "${key}"`,
  )
}
