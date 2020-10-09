const { exec } = require('child_process')
if (process.env.CI) {
  console.log('Skipping postinstall since CI env variable is set')
} else {
  exec('yarn schemas', (err, stdout, stderr) => {
    if (err) {
      console.error(err)
      process.exit(err.code)
    }

    console.log(`stdout: ${stdout}`)
    if (stderr) {
      console.error(`stderr: ${stderr}`)
    }
  })
}
