import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'
import { rootDir } from '../dsl/consts'
import { z } from 'zod' // Import Zod for runtime validation

const execPromise = promisify(exec)

export const nxCommand = async <T>(options: {
  command: string
  parseJson?: boolean
  schema?: z.ZodSchema<T> // Accept any Zod schema for runtime validation
}): Promise<T> => {
  const { command, parseJson = false, schema } = options

  try {
    const { stdout, stderr } = await execPromise(`yarn nx ${command}`, {
      cwd: rootDir,
    })

    if (stderr) {
      console.warn(stderr)
    }

    // If parseJson is true, validate the JSON output using the provided schema
    if (parseJson && schema) {
      return safelyParseAndValidateJson(stdout, schema)
    }

    // If not parsing JSON, return raw stdout
    return stdout as unknown as T
  } catch (error) {
    handleNxCommandError(error)
    throw error
  }
}

/**
 * Safely parses JSON and validates it using the provided Zod schema.
 */
const safelyParseAndValidateJson = <T>(
  jsonString: string,
  schema: z.ZodSchema<T>,
): T => {
  try {
    const parsedJson = JSON.parse(jsonString)
    return schema.parse(parsedJson) // Validate with the provided schema
  } catch (error) {
    console.error(`Failed to parse/validate JSON from NX output: ${error}`)
    throw new Error(
      'Invalid JSON format or validation error in NX command output.',
    )
  }
}

/**
 * Handles errors thrown during the execution of the NX command.
 */
const handleNxCommandError = (error: unknown): void => {
  if (error instanceof Error) {
    console.error(`Failed to run NX command: ${error.message}`)
  } else {
    console.error('An unknown error occurred while running the NX command.')
  }
}
