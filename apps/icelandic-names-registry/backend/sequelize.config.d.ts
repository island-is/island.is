import { Dialect } from 'sequelize/types'
interface SequelizeConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
  seederStorage: string
}
declare namespace SequelizeConfig {
  const test: SequelizeConfig
  const production: SequelizeConfig
  const development: SequelizeConfig
}
export = SequelizeConfig
