/* eslint-disable no-useless-escape */
class ValidationUtils {
  public static emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/

  public static identifierPattern = /^[@a-zA-Z0-9_.-/]*$/

  /** Pattern for illegal characters in description */
  public static descriptionPattern = /[<>%\$]/

  public static corsOriginPattern = /^http.+(?<!\/)$/

  public static urlPattern = /^http/

  public static baseUrlPattern = /^http.+(?<!\/)$/

  public static uriPattern = /^.+(?<!\/)$/

  public static nationalIdPattern = /^[0-9]*$/

  public static apiScopePattern = /^@[a-z\.]*[/]([a-z][:/]?)*[a-z]+$/

  public static scopePattern = /^@([\w-])$/

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

  public static validateUri(input: string): boolean {
    const regex = new RegExp(ValidationUtils.uriPattern)
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
    return regex.test(input)
  }

  public static validateApiScope(input: string): boolean {
    const regex = new RegExp(ValidationUtils.apiScopePattern)
    return regex.test(input)
  }
}
export default ValidationUtils
