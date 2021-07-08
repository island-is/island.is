import { Dialect } from 'sequelize/types'

interface SequelizeConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
}

declare namespace SequelizeConfig {
  const production: SequelizeConfig
  const test: SequelizeConfig
  const development: SequelizeConfig
}

export = SequelizeConfig
