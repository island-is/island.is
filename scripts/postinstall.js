const { exec } = require('child_process')
if (process.env.CI) {
  console.log('Skipping postinstall since CI env variable is set')
} else {
  exec('yarn schemas', (err, stdout, stderr) => {
    if (err) {
      // node couldn't execute the command
      console.error(err)
      process.exit(err.code)
    }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`)
    if (stderr) {
      console.error(`stderr: ${stderr}`)
    }
  })
}
