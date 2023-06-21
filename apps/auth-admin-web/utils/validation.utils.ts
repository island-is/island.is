/* eslint-disable no-useless-escape */
class ValidationUtils {
  public static emailPattern = /^[\w-\.]+@([\w-]+\.)+[\w-]+$/

  public static identifierPattern = /^[a-zA-Z0-9_.-]*$/

  /** Grant type pattern. Lower case no numbers allowed. Starting and ending with a normal letter. */
  public static grantTypePattern = /^(?=[a-z])[a-z_:.-]+(?<=[a-z])$/

  /** Pattern that enforeces @domain.is or @domain2-_2.is */
  public static domainPattern = /@{1}[a-z0-9_.-]*$/

  /** Pattern that enforces input to @[domain.is] or @[domain.is][/[paths]]*
   */
  public static clientIdPattern = /^@{1}[a-z0-9_.-]*([/]*[a-z0-9_\.-])+$/

  /** Pattern for illegal characters in description */
  public static descriptionPattern = /[<>%\$]/

  public static corsOriginPattern = /^http.+(?<!\/)$/

  public static urlPattern = /^http/

  public static baseUrlPattern = /^http.+(?<!\/)$/

  public static uriPattern = /^.+(?<!\/)$/

  public static nationalIdPattern = /^[0-9]*$/

  /** Pattern that enforces input to @[domain.is] or @[domain.is][/[optionalPaths]/[path:optionalAction]]*
   */
  public static apiScopePattern = /^@[a-z_.-]*[/]([a-z-][:/]?)*[a-z-]+$/

  public static scopePattern = /^@([\w-])$/

  public static validateEmail(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.emailPattern)
    return regex.test(input)
  }

  public static validateDomain(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.domainPattern)
    return regex.test(input)
  }

  public static validateIdentifier(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.identifierPattern)
    return regex.test(input)
  }

  public static validateClientId(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.clientIdPattern)
    return regex.test(input)
  }

  public static validateApiResourceName(input: string): boolean {
    if (input.length === 0) {
      return true
    }
    const regex = new RegExp(ValidationUtils.clientIdPattern)
    return regex.test(input)
  }

  public static validateIdentityResourceName(input: string): boolean {
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

  public static validateGrantType(input: string): boolean {
    const regex = new RegExp(ValidationUtils.grantTypePattern)
    return regex.test(input)
  }
}

export default ValidationUtils
