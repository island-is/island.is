export const requiredString = (key: string): string => {
  const value = process.env[key]

  if (value === undefined || value === null) {
    throw new Error(
      `Environment variable ${key} is required but was not found.`,
    )
  }

  return value
}
