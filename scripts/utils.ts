import { spawn, SpawnOptions, ChildProcess } from 'child_process'

export function exec(
  command: string,
  options?: SpawnOptions,
): Promise<{ stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, {
      stdio: ['inherit', 'pipe', 'pipe'],
      shell: true,
      ...options,
    })

    const stdoutChunks: Buffer[] = []
    const stderrChunks: Buffer[] = []

    const handleStdoutData = (data: Buffer) => {
      stdoutChunks.push(data)
    }

    const handleStderrData = (data: Buffer) => {
      stderrChunks.push(data)
    }

    const handleExit = (exitCode: number) => {
      const stdout = Buffer.concat(stdoutChunks).toString()
      const stderr = Buffer.concat(stderrChunks).toString()

      if (exitCode === 0) {
        resolve({ stdout, stderr })
      } else {
        const error = new Error('Command exited with a non-zero exit code.')
        ;(error as any).code = exitCode
        reject(error)
      }
    }

    if (cmd.stdout) {
      cmd.stdout.on('data', handleStdoutData)
    }

    if (cmd.stderr) {
      cmd.stderr.on('data', handleStderrData)
    }

    cmd.on('exit', handleExit)
  })
}
