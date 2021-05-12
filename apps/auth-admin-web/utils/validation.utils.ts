/* eslint-disable no-useless-escape */
/* eslint-disable  @typescript-eslint/no-implicit-any */
class ValidationUtils {
  public static emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  public static identifierPattern = /^[a-zA-Z0-9_.-]*$/

  /** Pattern for illegal characters in description */
  public static descriptionPattern = /[<>%\$]/

  public static corsOriginPattern = /^http.+(?<!\/)$/

  public static urlPattern = /^http/

  public static baseUrlPattern = /^http.+(?<!\/)$/

  public static nationalIdPattern = /^[0-9]*$/

  /** Pattern for illegal characters in scope name */
  public static scopePattern = /[<>%\$]/

  public static validateEmail(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.emailPattern)
    return regex.test(input)
  }

  public static validateIdentifier(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.identifierPattern)
    return regex.test(input)
  }

  public static validateDescription(input: string): boolean {
    if (input == null || input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.descriptionPattern)
    return !regex.test(input)
  }

  public static validateUrl(input: string): boolean {
    if (input.length === 0) {
      return true
    }

    const regex = new RegExp(ValidationUtils.urlPattern)
    return regex.test(input)
  }

  public static validateBaseUrl(input: string): boolean {
    if (input.length === 0) {
      return true
    }

    const regex = new RegExp(ValidationUtils.baseUrlPattern)
    return regex.test(input)
  }

  public static validateNationalId(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.nationalIdPattern)
    return regex.test(input)
  }

  public static validateCorsOrigin(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.corsOriginPattern)
    return regex.test(input)
  }

  public static validateScope(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.scopePattern)
    return !regex.test(input)
  }
}
export default ValidationUtils
