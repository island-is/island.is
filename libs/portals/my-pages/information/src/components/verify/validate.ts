export const validateNumber = (value: string) => /^\d+$/.test(value)

export const validateThreeDigitCode = (code: string) =>
  validateNumber(code) && code.length === 3
