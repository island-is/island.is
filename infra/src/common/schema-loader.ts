import { readFileSync } from 'fs'
import { jsonSchemaToZod } from 'json-schema-to-zod'
import { ZodSchema } from 'zod'

/**
 * Loads a JSON schema from a file and converts it into a Zod schema programmatically.
 *
 * @param {Object} options - The options for running the NX command.
 * @param {string} options.schemaPath - The path to the json schema.
 * @returns {ZodSchema} - The generated Zod schema.
 *
 * @throws {Error} - Throws an error if the schema cannot be loaded or is invalid.
 */
const schemaLoader = (options: { schemaPath: string }): ZodSchema => {
  try {
    const { schemaPath } = options
    const schemaContent = readFileSync(schemaPath, 'utf-8')
    const jsonSchema = JSON.parse(schemaContent)
    const schemaString = jsonSchemaToZod(jsonSchema)
    const zodSchema = eval(schemaString) as ZodSchema

    return zodSchema
  } catch (error) {
    console.error(`Error loading or converting the schema: ${error}`)
    throw new Error('Failed to load and convert JSON schema to Zod schema')
  }
}
export { schemaLoader }
