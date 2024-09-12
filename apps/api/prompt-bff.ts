import { select } from '@inquirer/prompts'
import { adminPortalScopes, servicePortalScopes } from '@island.is/auth/scopes'
import { spawn } from 'child_process'

/**
 * This prompt-bff file sets up and runs development servers based on user input.
 * It prompts the user to choose between bff server options.
 * Based on the selection, it configures relevant environment variables and starts both the API and
 * BFF (Backend for Frontend) servers in parallel.
 * The environment variables include configurations for the desired BFF, i.e. scopes, API endpoints, etc.
 * The script ensures that appropriate settings are applied before launching the servers.
 */

type Option = {
  name: string
  value: typeof SERVICE_PORTAL | typeof ADMIN_PORTAL
}

const SERVICE_PORTAL = 'service-portal'
const ADMIN_PORTAL = 'admin-portal'

const SP_KEY_PATH = 'minarsidur'
const AP_KEY_PATH = 'stjornbord'

const options: Option[] = [
  {
    name: 'Service portal',
    value: SERVICE_PORTAL,
  },
  {
    name: 'Admin portal',
    value: ADMIN_PORTAL,
  },
]

/**
 * Set environment variables for local development based on the selected option for the BFF server
 */
const setBffLocalDevelopmentEnvVars = (optionValue: Option['value']) => {
  const isServicePortal = optionValue === SERVICE_PORTAL
  const keyPath = isServicePortal ? SP_KEY_PATH : AP_KEY_PATH

  // First set the common environment variables
  process.env.AUDIT_GROUP_NAME = '/island-is/audit-log'
  process.env.IDENTITY_SERVER_ISSUER_URL =
    'https://identity-server.dev01.devland.is'
  process.env.IDENTITY_SERVER_AUDIENCE = '["@admin.island.is/bff"]'
  process.env.BFF_PAR_SUPPORT_ENABLED = 'false'
  process.env.BFF_LOGOUT_REDIRECT_PATH = 'https://beta.dev01.devland.is'
  process.env.BFF_PROXY_API_ENDPOINT = 'http://localhost:4444/api/graphql'
  process.env.BFF_TOKEN_SECRET_BASE64 =
    // This is a valid 32-byte base64 encoded secret.
    // You can generate a new one by running `openssl rand -base64 32`
    'Y0ROrC3mxDBnveN+EpAnLtSubttyjZZWcV43dyk7OQI='
  process.env.BFF_LOCAL_DEVELOPMENT_CORS = 'true'

  process.env.BFF_API_URL_PREFIX = `/${keyPath}/bff`
  process.env.BFF_CLIENT_BASE_PATH = `/${keyPath}`
  process.env.BFF_ALLOWED_REDIRECT_URIS = JSON.stringify([
    `https://*.dev01.devland.is/${keyPath}/bff/*`,
    `https://localhost:4200/${keyPath}/bff/*`,
  ])
  process.env.BFF_ALLOWED_EXTERNAL_API_URLS = JSON.stringify([
    `https://api.${keyPath}.island.is`,
  ])
  process.env.BFF_CALLBACKS_BASE_PATH = `http://localhost:3010/${keyPath}/bff/callbacks`
  process.env.IDENTITY_SERVER_CLIENT_ID = `@admin.island.is/bff-${keyPath}`

  switch (optionValue) {
    case SERVICE_PORTAL:
      process.env.IDENTITY_SERVER_CLIENT_SCOPES =
        JSON.stringify(servicePortalScopes)

      break

    case ADMIN_PORTAL:
      process.env.IDENTITY_SERVER_CLIENT_SCOPES =
        JSON.stringify(adminPortalScopes)

      break

    default:
      throw new Error('Invalid option selected')
  }
}

const initialize = async () => {
  try {
    // Prompt the user to choose an BFF server
    const selectedOptionValue = await select({
      message: 'Choose BFF server:',
      choices: options,
    })

    /**
     * Set environment variables based on the selected option for the BFF server
     */
    setBffLocalDevelopmentEnvVars(selectedOptionValue)

    const startServer = (args: string[]): Promise<void> => {
      return new Promise((resolve, reject) => {
        const serverProcess = spawn('yarn', args, {
          env: process.env,
          stdio: 'inherit',
        })

        serverProcess.on('error', (error) => {
          console.error(`Error starting server: ${error.message}`)
          reject(error)
        })

        serverProcess.on('close', (code) => {
          if (code !== 0) {
            console.error(`Server process exited with code ${code}`)

            reject(new Error(`Server process exited with code ${code}`))
          } else {
            resolve()
          }
        })
      })
    }

    // Start both servers in parallel
    await Promise.all([
      startServer(['nx', 'run', 'api:serve']),
      startServer(['nx', 'run', 'services-bff:serve']),
    ])
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

initialize()
