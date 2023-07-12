const { spawn } = require('child_process')

function schemas() {
  if (!process.env.RUN_POSTINSTALL_SCHEMAS) process.exit(0)
  const cmd = spawn('yarn schemas', {
    shell: true,
    stdio: 'inherit',
  })
  cmd.on('exit', (code) => {
    if (code !== 0) process.exit(code)
  })
}

for (const job of [schemas]) {
  job()
}
