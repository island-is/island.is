/* eslint-disable no-useless-escape */
class ValidationUtils {
  public static emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  public static nationalIdPattern = /^[0-9]*$/

  public static validateEmail(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.emailPattern)
    return regex.test(input)
  }

  public static isNumber(val: unknown) {
    return !isNaN(val as number)
  }

  public static validatePhoneNumber(input: string): boolean {
    if (input.length === 7 && ValidationUtils.isNumber(input)) {
      return true
    }
    return false
  }

  public static validateNationalId(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.nationalIdPattern)
    return regex.test(input)
  }
}
export default ValidationUtils
