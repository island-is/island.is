import { logger } from '../common'
import { execSync } from 'child_process'
import { rootDir } from '../dsl/consts'
import { Services, LocalrunService } from '../dsl/types/output-types'
import { writeFile } from 'fs/promises'
import { join } from 'path'

/**
 * Generates Docker Compose files for the specified services and their dependencies.
 *
 * @param renderedServices - An object containing the rendered services.
 * @param services - An array of service names to generate Docker Compose files for.
 * @param dependencies - An optional array of dependency service names.
 *
 * @returns A promise that resolves when the Docker Compose files have been generated.
 *
 */
export const generateDockerCompose = async (
  renderedServices: Services<LocalrunService>,
  services: string[],
  dependencies: string[] = [],
) => {
  logger.debug('generateDockerCompose', {
    renderedServices,
    dependencies,
    services,
  })

  const relevantService = Object.entries(renderedServices)
    .filter(([name]) => services[0] === name)
    .map(([name, service]) => ({ name, service }))[0]
  const relevantDependencies = Object.entries(renderedServices)
    .filter(([name]) => dependencies.includes(name))
    .map(([name, service]) => ({ name, service }))

  logger.info('Generating docker-compose.yml file...')
  const dockerComposeConfig = await generateDockerComposeConfig(
    relevantService,
    relevantDependencies,
  )

  if (dockerComposeConfig) {
    const commandsExcludingServe = (
      relevantService.service.commands || []
    ).filter((cmd) => !cmd.includes('serve'))

    for (const command of commandsExcludingServe) {
      try {
        execSync(command, {
          encoding: 'utf-8',
          stdio: 'pipe',
          cwd: rootDir,
        })
      } catch (error) {
        logger.error('Error executing command:', error)
      }
    }

    for (const dependency of relevantDependencies) {
      const dependencyNonServeCommands = (
        dependency.service.commands || []
      ).filter((cmd) => !cmd.includes('serve'))

      for (const command of dependencyNonServeCommands) {
        try {
          const res = execSync(command, {
            encoding: 'utf-8',
            stdio: 'pipe',
            cwd: rootDir,
          })
        } catch (error) {
          logger.error('Error executing command:', error)
        }
      }
    }

    await writeDockerComposeFile(dockerComposeConfig)
  }
}

/**
 * Fetches APP_HOME and APP_DIST_HOME dynamically using 'yarn nx show project --json'
 * @param appName The name of the app
 * @returns { appHome: string, appDistHome: string }
 */
const getAppPaths = (
  appName: string,
): { appHome: string; appDistHome: string } => {
  try {
    console.log(`Fetching project paths for: ${appName}`)
    const command = `yarn nx show project ${appName} --json`

    // Execute command and capture stdout
    const rawOutput = execSync(command, {
      encoding: 'utf-8',
      stdio: 'pipe',
      cwd: rootDir,
    }).trim()

    console.log(`Raw output from command:\n${rawOutput}`)

    // Parse the JSON safely
    const parsedOutput = JSON.parse(rawOutput)
    if (!parsedOutput.root) {
      throw new Error(`'root' key not found in project metadata for ${appName}`)
    }

    const appHome = parsedOutput.root
    const appDistHome = `dist/${appHome}`
    return { appHome, appDistHome }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `Error fetching project paths for '${appName}': ${error.message}`,
      )
    } else {
      console.error(`Error fetching project paths for '${appName}': ${error}`)
    }
    console.error(`Command attempted: yarn nx show project ${appName} --json`)
    process.exit(1)
  }
}

/**
 * Generates a Docker Compose configuration for a main service and its dependencies.
 *
 * @param mainService - The main service configuration.
 * @param mainService.name - The name of the main service.
 * @param mainService.service - The LocalrunService configuration for the main service.
 * @param dependencies - An array of dependency services configurations.
 * @param dependencies[].name - The name of a dependency service.
 * @param dependencies[].service - The LocalrunService configuration for a dependency service.
 * @returns A Docker Compose configuration object.
 */
export const generateDockerComposeConfig = async (
  mainService: {
    name: string
    service: LocalrunService
  },
  dependencies: {
    name: string
    service: LocalrunService
  }[] = [],
) => {
  const dockerComposeConfig: {
    services: { [key: string]: any }
    networks: { [key: string]: any }
  } = {
    services: {},
    networks: {},
  }

  const addHealthCheck = (serviceName: string, port: number) => ({
    healthcheck: {
      test: [
        'CMD',
        'wget',
        '--spider',
        '--quiet',
        `http://localhost:${port}/liveness`,
      ],
      interval: '10s',
      timeout: '5s',
      retries: 30,
      start_period: '5s',
    },
  })

  const mainServiceDependsOn = {} as Record<string, { condition: string }>

  // Process dependencies
  for (const { name, service } of dependencies) {
    const { appHome, appDistHome } = getAppPaths(name)
    const dependencyServeCommand =
      (service.commands || []).find((cmd) => cmd.includes('serve')) || ''

    const dependencyConfig = {
      build: {
        context: './',
        dockerfile: 'scripts/ci/Dockerfile',
        target: 'src',
        args: {
          NODE_IMAGE_TAG: '20.15.0-alpine3.20',
          APP: name,
          APP_HOME: appHome,
          APP_DIST_HOME: appDistHome,
        },
      },
      container_name: name,
      env_file: [`.env.${name}`],
      environment: {
        IP: '0.0.0.0',
      },
      ports: [`${service.port}:${service.port}`],
      command: dependencyServeCommand,
      working_dir: '/app',
      volumes: [
        './apps:/app/apps', // Mount the apps source code
        './libs:/app/libs', // Mount the libs source code
        './.yarn:/app/.yarn', // Yarn directory for dependency consistency
        './yarn.lock:/app/yarn.lock', // Yarn lock file for dependency integrity
        './package.json:/app/package.json', // Package file for consistency
      ],
      networks: ['local'],
      privileged: true,
      ...(service.port ? addHealthCheck(name, service.port) : {}),
    }

    dockerComposeConfig.services[name] = dependencyConfig
    mainServiceDependsOn[name] = { condition: 'service_healthy' }
  }

  // Process main service
  const mainServiceServeCommand =
    (mainService.service.commands || []).find((cmd) => cmd.includes('serve')) ||
    ''
  const { appHome, appDistHome } = getAppPaths(mainService.name)

  const mainServiceConfig: {
    build: {
      context: string
      dockerfile: string
      target?: string
      args: {
        NODE_IMAGE_TAG: string
        DOCKER_ECR_REGISTRY?: string
        APP: string
        APP_HOME: string
        APP_DIST_HOME: string
      }
    }
    container_name: string
    environment: Record<string, string>
    ports: string[]
    command: string
    working_dir: string
    volumes: string[]
    depends_on?: Record<string, { condition: string }>
    networks: string[]
    privileged: boolean
  } = {
    build: {
      context: './',
      dockerfile: 'scripts/ci/Dockerfile',
      target: 'src',
      args: {
        NODE_IMAGE_TAG: '20.15.0-alpine3.20',
        APP: mainService.name,
        APP_HOME: appHome,
        APP_DIST_HOME: appDistHome,
      },
    },
    container_name: mainService.name,
    environment: {
      ...mainService.service.env,
      IP: '0.0.0.0',
    },
    ports: [`4200:4200`],
    command: mainServiceServeCommand,
    working_dir: '/app',
    volumes: [
      './apps:/app/apps', // Mount the apps source code
      './libs:/app/libs', // Mount the libs source code
      './.yarn:/app/.yarn', // Yarn directory for dependency consistency
      './yarn.lock:/app/yarn.lock', // Yarn lock file for dependency integrity
      './package.json:/app/package.json', // Package file for consistency
    ],
    networks: ['local'],
    privileged: true,
    depends_on: mainServiceDependsOn,
  }

  dockerComposeConfig.services[mainService.name] = mainServiceConfig

  // Define the shared network
  dockerComposeConfig.networks = {
    local: {},
  }

  return dockerComposeConfig
}

/**
 * Writes a Docker Compose file for a specified service.
 *
 * @param config - The configuration object for Docker Compose, containing the services.
 * @param config.services - An object representing the services in the Docker Compose configuration.
 * @param serviceName - The name of the service for which the Docker Compose file is being generated.
 * @returns A promise that resolves when the Docker Compose file has been written.
 */
export const writeDockerComposeFile = async (config: {
  services: { [key: string]: any }
}) => {
  const filePath = join(rootDir, `docker-compose.yml`)

  // Convert the config object to a YAML string
  const yamlContent = generateYAML(config)

  // Write the YAML string to a file
  await writeFile(filePath, yamlContent, {
    encoding: 'utf-8',
  })

  logger.info(`Docker Compose file created: ${filePath}`)
}

/**
 * Generates a YAML string representation of a given JavaScript object.
 * Handles different data types, ensures clean formatting, and avoids unnecessary quotes.
 *
 * @param obj - The object to convert into YAML.
 * @param indentLevel - The level of indentation for the current YAML output.
 * @returns A string representing the YAML content.
 */
const generateYAML = (obj: any, indentLevel = 0): string => {
  const indent = '  '.repeat(indentLevel) // Indentation spaces
  let yaml = ''

  for (const [key, value] of Object.entries(obj)) {
    const sanitizedKey = /^[\w-]+$/.test(key) ? key : `"${key}"`

    if (value === null || value === undefined || value === '') {
      // Handle null or empty values
      yaml += `${indent}${sanitizedKey}:\n`
    } else if (typeof value === 'string') {
      // Quote strings if they start with reserved characters or contain risky symbols
      const requiresQuotes = /^[\-@:]|[{}[\]]|["'`]|[\n\s]/.test(value)
      const sanitizedValue = requiresQuotes
        ? `"${value.replace(/"/g, '\\"')}"`
        : value
      yaml += `${indent}${sanitizedKey}: ${sanitizedValue}\n`
    } else if (typeof value === 'number' || typeof value === 'boolean') {
      // Numbers and booleans are written directly
      yaml += `${indent}${sanitizedKey}: ${value}\n`
    } else if (Array.isArray(value)) {
      // Write arrays, quoting items only if necessary
      yaml += `${indent}${sanitizedKey}:\n`
      for (const item of value) {
        const formattedItem =
          typeof item === 'string' && /^[\-@:]|[{[}\]]|["'`]|[\n\s]/.test(item)
            ? `"${item.replace(/"/g, '\\"')}"`
            : item
        yaml += `${'  '.repeat(indentLevel + 1)}- ${formattedItem}\n`
      }
    } else if (typeof value === 'object') {
      // Recursively write nested objects
      yaml += `${indent}${sanitizedKey}:\n${generateYAML(
        value,
        indentLevel + 1,
      )}`
    } else {
      // Fallback for unknown or unsupported data types
      throw new Error(`Unsupported data type for key: ${sanitizedKey}`)
    }
  }

  return yaml
}
