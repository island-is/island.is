import yargs from 'yargs'
import { Pool } from 'pg'
import type { PoolConfig } from 'pg'
import { SSM } from 'aws-sdk'
import type {
  GetParameterRequest,
  PutParameterRequest,
} from 'aws-sdk/clients/ssm'

const ssm = new SSM()
const createPool = (config: PoolConfig) => new Pool(config)
const getCommandLineArgs = () => {
  const argv = yargs(process.argv.slice(2))
    .option('name', {
      type: 'string',
      demandOption: true,
      describe: 'The name of the database to create',
    })
    .option('feature', {
      type: 'string',
      demandOption: true,
      describe: 'The name of the feature deployment',
    })
    .option('read-only', {
      type: 'boolean',
      describe: 'Create a read-only user',
      default: false,
    })
    .option('extensions', {
      type: 'array',
      describe: 'List of PostgreSQL extensions to create',
      default: [],
    })
    .option('ssm-prefix', {
      type: 'string',
      describe: 'SSM parameter store prefix',
      default: '/k8s/',
    })
    .option('ssm-masterpasword', {
      type: 'string',
      describe: 'SSM parameter key for RDS master password',
      default: '/k8s/vidspyrna/masterpassword',
    })
    .option('master-user', {
      type: 'string',
      describe: 'RDS root username',
      default: 'root',
    })
    .option('master-database', {
      type: 'string',
      describe: 'RDS default database',
      default: 'postgres',
    })
    .help()
    .alias('help', 'h').argv

  return {
    dbName: argv['name'],
    featureName: argv['feature'],
    readOnly: argv['read-only'],
    dbExtensions: argv.extensions as string[],
    ssmPrefix: argv['ssm-prefix'],
    ssmMasterPassword: argv['ssm-masterpasword'],
    dbMasterUser: argv['master-user'],
    dbMasterDatabase: argv['master-database'],
  }
}

const validateName = (name: string) => /^[a-zA-Z0-9_]+$/.test(name)

const generatePassword = () => Math.random().toString(36).slice(-12)

const createOrUpdateSSMParameter = async (params: {
  ssm: SSM
  name: string
  value: string
}) => {
  const { ssm, name, value } = params
  const ssmParams: PutParameterRequest = {
    Name: name,
    Value: value,
    Overwrite: true,
  }
  await ssm.putParameter(ssmParams).promise()
}

const getSSMParameter = async (params: { ssm: SSM; name: string }) => {
  const ssmParams: GetParameterRequest = {
    Name: params.name,
    WithDecryption: true,
  }
  const { Parameter } = await ssm.getParameter(ssmParams).promise()

  if (Parameter) {
    return Parameter.Value
  }
}

const createDb = async (params: { pool: Pool; dbName: string }) => {
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

const createUser = async (params: {
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

const grantPrivileges = async (params: {
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

const createExtensions = async (params: {
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

const main = async () => {
  const {
    dbName,
    readOnly,
    dbExtensions,
    dbMasterDatabase,
    dbMasterUser,
    featureName,
    ssmMasterPassword,
    ssmPrefix,
  } = getCommandLineArgs()

  if (!validateName(dbName)) {
    console.error(`Invalid database name: ${dbName}`)
    return
  }

  const ssm = new SSM()
  const masterPassword = await getSSMParameter({
    ssm,
    name: ssmMasterPassword,
  })

  const pool = createPool({
    user: dbMasterUser,
    host: process.env.PGHOST,
    database: dbMasterDatabase,
    password: masterPassword,
  })

  try {
    const dbUser = readOnly ? `${dbName}-ro` : `${dbName}-rw`
    const dbPassword = generatePassword()

    await createDb({ pool, dbName })
    await createUser({ pool, dbUser, dbPassword, dbName })
    await grantPrivileges({ pool, dbUser, dbName, readOnly })

    await createExtensions({ pool, dbExtensions })
    await createOrUpdateSSMParameter({
      ssm,
      name: `${dbName}-db-name`,
      value: dbName,
    })
    await createOrUpdateSSMParameter({
      name: `${dbName}-db-user`,
      value: dbPassword,
      ssm: ssm,
    })
    await createOrUpdateSSMParameter({
      name: `${dbName}-db-password`,
      value: dbPassword,
      ssm: ssm,
    })
  } finally {
    await pool.end()
  }
}
main().catch(console.error)
