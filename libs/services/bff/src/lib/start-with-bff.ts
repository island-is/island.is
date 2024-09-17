import { startProcess } from '@island.is/shared/utils/server'
import chalk from 'chalk'
import { BffClient } from './clients'
import { setDevEnvVars } from './set-dev-env-vars'

export const startWithBff = async (
  client: BffClient,
  processArgs: string[],
) => {
  try {
    // Set BFF environment variables, scoped to a specific client.
    setDevEnvVars(client)

    // Start the BFF server with the updated environment
    console.log(chalk.blue('Starting BFF server...'))
    startProcess('yarn', ['nx', 'run', 'services-bff:dev'], process.env)

    // Start the client process
    console.log(chalk.blue(`Starting ${client} client...`))

    const envVars: NodeJS.ProcessEnv = {
      NODE_ENV: 'development',
      NODE_OPTIONS: '--max-old-space-size=8192',
    }
    startProcess('yarn', processArgs, envVars)
  } catch (error) {
    console.error('One of the processes failed:', error)
    process.exit(1)
  }
}
