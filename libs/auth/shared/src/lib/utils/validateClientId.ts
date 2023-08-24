/**
 * Validates that the client id is prefixed with the tenant and that it matches the regex
 * Value can only contain alphanumeric characters, hyphens, underscores, periods and forward slashes.
 * @returns true if valid, false otherwise
 */
export const validateClientId = ({
  prefix,
  value,
}: {
  prefix: string
  value: string
}) => new RegExp(`^${prefix}/[a-zA-Z0-9]+([-_/.][a-zA-Z0-9]+)*$`).test(value)
