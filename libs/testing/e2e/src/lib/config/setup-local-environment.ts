import { execSync } from 'child_process'
import { resolve } from 'path'
import { logger } from '@island.is/logging'
import { readdirSync } from 'fs'
import { join } from 'path'

interface GenerateEnvironmentParams {
  app: string
  proxies?: boolean
}

const appDependencies: Record<string, string[]> = {
  'consultation-portal': ['api'],
}

export const setupE2EEnvironment = ({
  app,
  proxies = false,
}: GenerateEnvironmentParams) => {
  if (!app) {
    throw new Error('App must be specified.')
  }

  // Determine the root directory dynamically
  const rootDir = resolve(__dirname, '../../../../../..')
  const dependencies = appDependencies[app] || []

  // Construct the render-local-env command
  let renderCommand = `yarn infra render-local-env  ${app} --docker-compose --skip-secrets`
  if (dependencies.length > 0) {
    renderCommand += ` --dependencies ${dependencies.join(' ')}`
  }
  if (proxies) {
    renderCommand += ' --proxies'
  }

  // Run the render-local-env command to generate docker-compose.yml files
  logger.info(`Running command: ${renderCommand}`)
  try {
    execSync(renderCommand, { stdio: 'inherit', cwd: rootDir })
  } catch (error) {
    logger.error(`Failed to run command: ${renderCommand}`, error)
    throw new Error(`Failed to generate docker-compose files for app: ${app}`)
  }

  // Check if docker-compose files exist
  const dockerComposeFiles = readdirSync(rootDir)
    .filter((file) => file === 'docker-compose.yml')
    .map((file) => join(rootDir, file))

  if (dockerComposeFiles.length === 0) {
    throw new Error(`No docker-compose files were generated in ${rootDir}.`)
  }

  return dockerComposeFiles
}
