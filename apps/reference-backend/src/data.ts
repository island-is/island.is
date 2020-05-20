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


export class SampleApp extends Model {
  public id!: string

  public ssn!: string
  public readonly created!: Date
  public readonly modified!: Date
}

SampleApp.init(
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

export class Applications {
  /**
   * register
   */
  public async register({ssn}: {ssn: string}) {
    if (ssn && ssn.length === 10) {
      const newApp = await SampleApp.create({ssn})
      return newApp.id;
    } else throw new Error(`SSN missing or invalid length ${ssn}`) 
  }
}