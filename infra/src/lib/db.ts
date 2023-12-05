import { Pool } from 'pg'

export const createDb = async (params: { pool: Pool; dbName: string }) => {
  const { pool, dbName } = params
  const createDbQuery = `CREATE DATABASE ${dbName};`

  try {
    await pool.query(createDbQuery)
    console.log(`Database ${dbName} created`)
  } catch (error) {
    if (error.code === '42P04') {
      console.log(`Database ${dbName} already exists`)
    } else {
      console.error(error)
    }
  }
}

export const createUser = async (params: {
  pool: Pool
  dbUser: string
  dbName: string
  dbPassword: string
}) => {
  const { pool, dbUser, dbPassword } = params
  try {
    const createUserWithPasswordQuery = `CREATE USER ${dbUser} WITH PASSWORD '${dbPassword}';`
    console.log(`Running query: ${createUserWithPasswordQuery}`)
    await pool.query(createUserWithPasswordQuery)
    console.log(`User ${dbUser} created with password ${dbPassword}`)
  } catch (error) {
    if (error.code === '42710') {
      console.log(`User ${dbUser} already exists`)
    } else {
      console.error(error)
    }
  }
}

export const grantPrivileges = async (params: {
  pool: Pool
  dbUser: string
  dbName: string
  readOnly: boolean
}) => {
  const { pool, dbUser, dbName, readOnly } = params
  try {
    const grantPrivilegesQuery = readOnly
      ? `GRANT SELECT ON ALL TABLES IN SCHEMA public TO ${dbUser};`
      : `GRANT ALL PRIVILEGES ON DATABASE ${dbName} TO ${dbUser};`
    console.log(`Running query: ${grantPrivilegesQuery}`)
    await pool.query(grantPrivilegesQuery)
    console.log(`Privileges granted on database ${dbName} to user ${dbUser}`)
  } catch (error) {
    console.error(error)
  }
}

export const createExtensions = async (params: {
  pool: Pool
  dbExtensions: string[]
}) => {
  const { pool, dbExtensions } = params

  if (dbExtensions.length === 0) {
    console.log('No extensions to create')
    return
  }

  try {
    for (const extension of dbExtensions) {
      const createExtensionQuery = `CREATE EXTENSION IF NOT EXISTS "${extension}";`
      console.log(`Running query: ${createExtensionQuery}`)
      await pool.query(createExtensionQuery)
      console.log(`Extension uuid-ossp created`)
    }
  } catch (error) {
    console.error(error)
  }
}
