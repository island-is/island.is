const { spawn } = require('child_process')

/**
 * Wraps child_process.spawn with more user friendly interface
 * and to be async using Promise.
 * @param {string} command
 * @param {Object} options Same options as defined for `child_process.spawn()`
 * @returns Promise
 */
exports.exec = (command, options) => {
  return new Promise((resolve, reject) => {
    const cmd = spawn(command, {
      stdio: 'inherit',
      shell: true,
      ...options,
    })

    cmd.on('exit', (exitCode) => {
      if (exitCode === 0) {
        resolve()
      } else {
        const error = new Error('Command exited with non-zero exit code.')
        error.code = exitCode
        reject(error)
      }
    })
  })
}
