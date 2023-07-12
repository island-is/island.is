const { spawn } = require('child_process')

function schemas() {
  if (!process.env.GENERATE_SCHEMAS_ON_INSTALL) process.exit(0)
  console.log('Generating schemas...')
  const cmd = spawn('yarn schemas', {
    shell: true,
    stdio: 'inherit',
  })
  cmd.on('exit', (code) => {
    console.log(`Schema generation completed with exit code ${code}`)
    if (code !== 0) process.exit(code)
  })
}

for (const job of [schemas]) {
  console.log('Running job: ' + job.name)
  job()
}
