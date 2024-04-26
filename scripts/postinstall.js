const { spawn } = require('child_process')

function codegen() {
  if (
    !process.env.RUN_CODEGEN_ON_INSTALL &&
    !process.env.GENERATE_SCHEMAS_ON_INSTALL
  ) {
    process.exit(0)
  }

  console.log('Running codegen...')
  const cmd = spawn('yarn codegen', {
    shell: true,
    stdio: 'inherit',
  })
  cmd.on('exit', (code) => {
    console.log(`Code generation completed with exit code ${code}`)
    if (code !== 0) process.exit(code)
  })
}

for (const job of [codegen]) {
  console.log('Running job: ' + job.name)
  job()
}
