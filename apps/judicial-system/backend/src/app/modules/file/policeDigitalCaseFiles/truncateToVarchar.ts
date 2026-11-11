/** Sequelize `DataType.STRING` maps to Postgres `varchar(255)`. */
export const VARCHAR_DEFAULT_LIMIT = 255

export const truncateToVarchar = (
  value: string,
  maxLength: number = VARCHAR_DEFAULT_LIMIT,
): string => {
  if (value.length <= maxLength) {
    return value
  }

  return value.slice(0, maxLength)
}
