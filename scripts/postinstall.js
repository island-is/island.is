const { exec } = require('child_process')

if (process.env.CI) {
  console.log('Skipping postinstall since CI env variable is set')
} else {
  const cmd = exec('yarn schemas')

  cmd.stderr.on('error', (err) => {
    console.error(err)
  })

  cmd.stdout.on('data', (data) => {
    console.log(data)
  })
}
