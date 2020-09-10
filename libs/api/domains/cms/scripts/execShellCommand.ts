import { exec } from 'child_process'

export const execShellCommand = (cmd: string): Promise<string> =>
  new Promise((resolve, reject) => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        reject(error)
      } else {
        resolve(stdout || stderr)
      }
    })
  })
