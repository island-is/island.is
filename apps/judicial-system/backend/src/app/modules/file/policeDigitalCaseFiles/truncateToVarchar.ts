/** Sequelize `DataType.STRING` maps to Postgres `varchar(255)`. */
export const VARCHAR_DEFAULT_LIMIT = 255

/**
 * Truncate by Unicode code points (not UTF-16 code units) so a supplementary
 * character at the limit is kept whole or omitted — never split into unpaired
 * surrogates that Postgres / JS would treat as corrupt.
 */
export const truncateToVarchar = (
  value: string,
  maxLength: number = VARCHAR_DEFAULT_LIMIT,
): string => {
  const codePoints = [...value]

  if (codePoints.length <= maxLength) {
    return value
  }

  return codePoints.slice(0, maxLength).join('')
}
