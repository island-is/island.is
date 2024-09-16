import { spawn } from 'child_process'

/**
 * Starts a new process by running a command with the specified arguments.
 *
 * This function spawns a child process to execute a command with given arguments and
 * overrides the default environment variables with the ones provided in the `env` object, if provided.
 * It handles standard input/output streams, and resolves or rejects the returned
 * promise based on the outcome of the process execution.
 *
 * @param command - The command to run. Defaults to 'yarn'.
 * @param args - An array of arguments to pass to the command.
 * @param env - An optional object containing environment variables to set for the process.
 */
export const startProcess = (
  command = 'yarn',
  args: string[],
  env?: NodeJS.ProcessEnv,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
<<<<<<< HEAD
      env: { ...process.env, ...env },
=======
      env: env || process.env,
>>>>>>> 045b0471e1 (Restructure dx for admin portal)
      // Use pipe for stdout and stderr to make sure that logs don't log inlined.
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
    })

<<<<<<< HEAD
    // Handle process termination on exit
    process.on('exit', () => {
      child.kill('SIGTERM')
    })

=======
>>>>>>> 045b0471e1 (Restructure dx for admin portal)
    // Capture and handle stdout
    child.stdout?.on('data', (data) => {
      process.stdout.write(data.toString())
    })

    // Capture and handle stderr
    child.stderr?.on('data', (data) => {
      process.stderr.write(data.toString())
    })

    child.on('error', (error) => {
      console.error(
        `Error running command "${command} ${args.join(' ')}": ${
          error.message
        }`,
      )
      reject(error)
    })

    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(
          `Command "${command} ${args.join(' ')}" exited with code ${code}`,
        )
        reject(new Error(`Command exited with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}
