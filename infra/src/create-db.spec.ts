import { execSync } from 'child_process'
import { createDb } from './create-db'
type ContainerConfig = {
  containerName: string
  masterUser: string
  masterPassword: string
}

const startDockerContainer = (params: ContainerConfig) => {
  const { containerName, masterUser, masterPassword } = params
  try {
    execSync(
      `docker run --name ${containerName} -e POSTGRES_USER=${masterUser} -e POSTGRES_PASSWORD=${masterPassword} -p 5432:5432 -d postgres`,
    )
    console.log('PostgreSQL Docker container started')
  } catch (error) {
    console.error('Error starting PostgreSQL Docker container:', error)
  }
}

const stopDockerContainer = (
  params: Pick<ContainerConfig, 'containerName'>,
) => {
  const { containerName } = params
  try {
    execSync(`docker stop ${containerName}`)
    execSync(`docker rm -f ${containerName}`)
    console.log('PostgreSQL Docker container stopped and removed')
  } catch (error) {
    console.error('Error stopping PostgreSQL Docker container:', error)
  }
}

describe('PostgreSQL operations', () => {
  const containerName = 'create-db-test'
  beforeAll(() => {
    startDockerContainer({
      containerName,
      masterPassword: 'masterpassword',
      masterUser: 'root',
    })
    return new Promise((resolve) => setTimeout(resolve, 5000)) // Wait 5 seconds
  })

  afterAll(() => {
    stopDockerContainer({ containerName })
  })

  beforeAll(() => {
    pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'mysecretpassword',
      port: 5432,
    })
  })

  afterAll(async () => {
    await pool.end()
  })

  it('should perform some database operation', async () => {
    // Example database operation
    const result = await pool.query('SELECT 1 AS value')
    expect(result.rows[0].value).toBe(1)
    // Additional assertions as needed
  })

  // More tests...
})
