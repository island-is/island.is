const { exec } = require('./utils')

const skipCache = process.argv && process.argv[2] === '--skip-cache'

const main = async () => {
  try {
    await exec(
      `nx run-many --target=codegen/backend-schema,codegen/bootstrap,codegen/backend-post,codegen/frontend-client,codegen --all --parallel --maxParallel=6 $NX_OPTIONS`,
      {
        env: skipCache
          ? { ...process.env, NX_OPTIONS: '--skip-nx-cache' }
          : process.env,
      },
    )
  } catch (err) {
    console.error(`Error running command: ${err.message}`)
    process.exit(err.code || 1)
  }
}

main()
