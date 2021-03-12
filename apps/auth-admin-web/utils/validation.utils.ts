class ValidationUtils {
  public static emailPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  public static identifierPattern: RegExp = /^[a-zA-Z0-9_.-]*$/

  public static descriptionPattern: RegExp = /[<>%\$]/

  public static urlPattern: RegExp = /^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/

  public static nationalIdPattern: RegExp = /^[0-9]*$/

  public static validateEmail(input: string): boolean {
    const regex = new RegExp(ValidationUtils.emailPattern)
    return regex.test(input)
  }

  public static validateIdentifier(input: string): boolean {
    const regex = new RegExp(ValidationUtils.identifierPattern)
    return regex.test(input)
  }

  public static validateDescription(input: string): boolean {
    const regex = new RegExp(ValidationUtils.descriptionPattern)
    return !regex.test(input)
  }

  public static validateUrl(input: string): boolean {
    const regex = new RegExp(ValidationUtils.urlPattern)
    return regex.test(input)
  }

  public static validateNationalId(input: string): boolean {
    const regex = new RegExp(ValidationUtils.nationalIdPattern)
    return regex.test(input)
  }
}
export default ValidationUtils
