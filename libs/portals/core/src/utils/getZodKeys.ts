import { z } from 'zod'
import { isDefined } from '@island.is/shared/utils'

/**
 * Get zod object keys recursively
 */
export const zodKeys = <T extends z.ZodTypeAny>(schema: T): string[] => {
  // make sure schema is not null or undefined
  if (!isDefined(schema)) {
    return []
  }

  // check if schema is nullable or optional
  if (schema instanceof z.ZodNullable || schema instanceof z.ZodOptional) {
    return zodKeys(schema.unwrap())
  }

  // check if schema is an array
  if (schema instanceof z.ZodArray) {
    return zodKeys(schema.element)
  }

  // check if schema is an object
  if (schema instanceof z.ZodObject) {
    // get key/value pairs from schema
    const entries = Object.entries(schema.shape)
    // loop through key/value pairs
    return entries.flatMap(([key, value]) => {
      // get nested keys
      const nested =
        value instanceof z.ZodType
          ? zodKeys(value).map((subKey) => `${key}.${subKey}`)
          : []

      return nested.length ? nested : key
    })
  }

  return []
}
