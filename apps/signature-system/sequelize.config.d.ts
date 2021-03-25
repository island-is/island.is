interface sequlizeConfig {
  username: string
  password: string
  database: string
  host: string
  dialect: Dialect
}

declare namespace SequelizeConfig {
  const production: sequlizeConfig
  const development: sequlizeConfig
}

export = SequelizeConfig
