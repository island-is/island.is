class ValidationUtils {
  public static emailPattern: RegExp = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  public static identifierPattern: RegExp = /^[a-zA-Z0-9_.-]*$/

  /** Pattern for illegal characters in description */
  public static descriptionPattern: RegExp = /[<>%\$]/

  public static corsOriginPattern: RegExp = /^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/

  public static urlPattern: RegExp = /^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/

  public static nationalIdPattern: RegExp = /^[0-9]*$/

  /** Pattern for illegal characters in scope name */
  public static scopePattern: RegExp = /[<>%\$]/

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

  public static validateCorsOrigin(input: string): boolean {
    const regex = new RegExp(ValidationUtils.corsOriginPattern)
    return regex.test(input)
  }

  public static validateScope(input: string): boolean {
    const regex = new RegExp(ValidationUtils.scopePattern)
    return !regex.test(input)
  }
}
export default ValidationUtils
