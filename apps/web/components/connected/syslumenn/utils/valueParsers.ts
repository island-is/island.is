/**
 * Returns an appropriate human readable representation of a valid period.
 * Valid periods can be valid indefinitely, from a given date and/or until a given date.
 * @param validFrom Beginning of valid period.
 * @param validTo End of valid period.
 * @param dateFormat A string representing the format in which dates will be rendered.
 * @param format A function that formats dates.
 * @param labelValidPeriodUntil The label used as a prefix when a valid period is only defined as being valid until a given date.
 * @param labelValidPeriodIndefinite The label used to represent indefinite valid period.
 * @returns Appropriate human readable representation of a valid period
 */
export const getValidPeriodRepresentation = (
  validFrom: Date | string | null,
  validTo: Date | string | null,
  dateFormat: string,
  format: (date: Date, dateFormat: string) => string,
  labelValidPeriodUntil: string,
  labelValidPeriodIndefinite: string,
): string => {
  if (validFrom && validTo) {
    if (validFrom === validTo) {
      return format(new Date(validFrom), dateFormat)
    }
    return `${format(new Date(validFrom), dateFormat)} — ${format(
      new Date(validTo),
      dateFormat,
    )}`
  }
  if (!validFrom && validTo) {
    return `${labelValidPeriodUntil} ${format(new Date(validTo), dateFormat)}`
  }
  if (!validTo) {
    return labelValidPeriodIndefinite
  }
  return ''
}
