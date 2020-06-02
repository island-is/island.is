import { Model, DataTypes } from 'sequelize'

import { Sequelize } from 'sequelize'

import config from './config'

export const sequelize = new Sequelize(config.DATABASE_URI, {
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

export class ApplicationsModel extends Model {
  public id!: string

  public ssn!: string
  public readonly created!: Date
  public readonly modified!: Date
}

ApplicationsModel.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    ssn: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'sample_app',
  },
)
