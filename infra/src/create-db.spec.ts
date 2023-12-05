import { execSync } from 'child_process'
import { createDb } from './lib/db'
import { Pool } from 'pg'

type ContainerConfig = {
  containerName: string
  masterUser: string
  masterPassword: string
  masterDatabase: string
  host: string
  sourcePort: number
  targetPort: number
}

const createDefaultContainerConfig = (
  overrides?: Partial<ContainerConfig>,
): ContainerConfig => {
  return {
    containerName: 'create-db-test',
    masterPassword: 'masterpassword',
    masterUser: 'root',
    masterDatabase: 'postgres',
    host: 'localhost',
    sourcePort: 5432,
    targetPort: 5432,
    ...overrides,
  }
}

const startDockerContainer = (params: ContainerConfig) => {
  const {
    containerName,
    masterUser,
    masterPassword,
    masterDatabase,
    sourcePort,
    targetPort,
  } = params
  const cmd = `docker run --name ${containerName} -e POSTGRES_USER=${masterUser} -e POSTGRES_PASSWORD=${masterPassword} -p ${sourcePort}:${targetPort} -d ${masterDatabase}`
  try {
    execSync(cmd)
    console.log(`Starting postgres ${cmd}`)
  } catch (error) {
    console.error('Error starting PostgreSQL Docker container:', error)
  }
}

const stopDockerContainer = (
  params: Pick<ContainerConfig, 'containerName'>,
) => {
  const { containerName } = params
  try {
    // execSync(`docker stop ${containerName}`)
    execSync(`docker rm -f ${containerName}`)
    console.log('PostgreSQL Docker container stopped and removed')
  } catch (error) {
    console.error('Error stopping PostgreSQL Docker container:', error)
  }
}

describe('PostgreSQL operations', () => {
  const config = createDefaultContainerConfig()

  const pool = new Pool({
    user: config.masterUser,
    host: config.host,
    database: config.masterDatabase,
    password: config.masterPassword,
    port: config.sourcePort,
  })

  // beforeAll(() => {
  //   startDockerContainer({ ...config })
  // })

  // afterAll(() => {
  //   stopDockerContainer({ containerName: config.containerName })
  // })

  it('should perform some database operation', async () => {
    const result = await pool.query('SELECT 1 AS value')
    expect(result.rows[0].value).toBe(1)
  })
})
