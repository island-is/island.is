import { Sequelize } from 'sequelize'
import { environment } from '../environments'

const { databaseUri } = environment

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
