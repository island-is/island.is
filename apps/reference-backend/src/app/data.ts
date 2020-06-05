import { Model, DataTypes } from 'sequelize'

import { Sequelize } from 'sequelize'

import { environment } from '../environments'

const { databaseUri } = environment

export const sequelize = new Sequelize(databaseUri, {
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

export class ApplicationModel extends Model {
  public id!: string

  public ssn!: string
  public readonly created!: Date
  public readonly modified!: Date
}

ApplicationModel.init(
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
