/**
 * Validates that an environment variable is a string and returns it as value
 */
export const requiredString = (key: string): string => {
  const value = process.env[key]

  if (value === undefined || value === null) {
    throw new Error(
      `Environment variable ${key} is required but was not found.`,
    )
  }

  return value
}

/**
 * Validates that an environment variable is a JSON-stringified array of strings and returns it as value
 */
export const requiredStringArray = (key: string): string[] => {
  const value = requiredString(key)

  try {
    // Parse the JSON string into an array
    const parsedArray = JSON.parse(value)

    // Ensure that the parsed value is an array of strings
    if (
      !Array.isArray(parsedArray) ||
      !parsedArray.every((item) => typeof item === 'string')
    ) {
      throw new Error()
    }

    return parsedArray
  } catch (error) {
    throw new Error(
      `Environment variable ${key} is not a valid JSON-stringified array of strings`,
    )
  }
}
