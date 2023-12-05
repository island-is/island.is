import yargs from 'yargs'
import { Pool } from 'pg'
import type { PoolConfig } from 'pg'
import { SSM } from 'aws-sdk'

import {
  createExtensions,
  createDb,
  createUser,
  grantPrivileges,
} from './lib/db'
import { createOrUpdateSSMParameter, getSSMParameter } from './lib/ssm'

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
    .option('hostname', {
      type: 'string',
      demandOption: true,
      describe: 'RDS hostname',
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
      default: '/k8s',
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
      name: `${ssmPrefix}/${featureName}/DB_NAME`,
      value: dbName,
    })
    await createOrUpdateSSMParameter({
      name: `${ssmPrefix}/${featureName}/DB_USER`,
      value: dbPassword,
      ssm: ssm,
    })
    await createOrUpdateSSMParameter({
      name: `${ssmPrefix}/${featureName}/DB_PASS`,
      value: dbPassword,
      ssm: ssm,
    })
  } finally {
    await pool.end()
  }
}
main().catch(console.error)
