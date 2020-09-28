import { Sequelize } from 'sequelize'
import * as databaseConfig from '../../sequelize.config.js'

let config
switch (process.env.NODE_ENV) {
  case 'test':
    config = databaseConfig.test
    break
  case 'production':
    config = databaseConfig.production
    break
  default:
    config = databaseConfig.development
}

const databaseUri = `postgres://${config.username}:${config.password}@${config.host}:5432/${config.database}`

export default new Sequelize(databaseUri, {
  define: {
    underscored: true,
    timestamps: true,
    createdAt: 'created',
    updatedAt: 'modified',
  },
  dialectOptions: {
    useUTC: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  logging: false,
})
