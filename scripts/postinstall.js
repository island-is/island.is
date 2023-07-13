const { spawn } = require('child_process')

if (process.env.CI) {
  console.log('Skipping postinstall since CI env variable is set')
} else {
  const cmd = spawn('yarn schemas', {
    shell: true,
    stdio: 'inherit',
  })
  cmd.on('exit', (code) => {
    process.exit(code)
  })
}
