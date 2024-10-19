import { exec } from 'child_process'
import { promisify } from 'util'
import { join } from 'path'

const execPromise = promisify(exec)

/**
 * Executes an NX command from the monorepo root.
 *
 * @param {Object} options - The options for running the NX command.
 * @param {string} options.command - The NX command to run (e.g., 'run my-app:build').
 * @param {boolean} [options.parseJson=false] - If true, the function will parse `stdout` as JSON and return the parsed object.
 * @returns {Promise<{ stdout: string | any, stderr: string }>} - A promise that resolves to an object containing `stdout` (as a string or a parsed object) and `stderr` (as a string).
 *
 * @throws {Error} - Throws an error if the NX command fails to execute.
 *
 * @example
 * // Run NX command and get raw output as string
 * const result = await nxCommand({ command: 'show project portals-admin --json --output-style static' });
 * console.log(result.stdout); // Raw JSON string
 *
 * @example
 * // Run NX command and get parsed output as object
 * const result = await nxCommand({ command: 'show project portals-admin --json --output-style static', parseJson: true });
 * console.log(result.stdout); // Parsed JSON object
 */
export const nxCommand = async (options: {
  command: string
  parseJson?: boolean
}): Promise<{ stdout: string | any; stderr: string }> => {
  const { command, parseJson = false } = options
  try {
    const monorepoRoot = join(__dirname, '..', '..', '..')
    const { stdout, stderr } = await execPromise(`yarn nx ${command}`, {
      cwd: monorepoRoot,
    })

    if (stderr) {
      console.warn(`NX Warning: ${stderr}`)
    }

    if (parseJson) {
      const parsedJson = JSON.parse(stdout)
      return { stdout: parsedJson, stderr }
    }

    return { stdout, stderr }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(`Failed to run NX command: ${error.message}`)
      throw error
    } else {
      console.error('Unknown error occurred while running NX command.')
      throw new Error('Unknown error occurred.')
    }
  }
}
