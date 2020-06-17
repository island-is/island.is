import { Model, DataTypes } from 'sequelize'

import {
  ApplicationTypes,
  ApplicationStates,
} from '@island.is/gjafakort/consts'
import { sequelize } from '../../../extensions'
import { model as AuditLog } from '../audit'

class Application extends Model {
  public id!: string

  public readonly created!: Date
  public readonly modified!: Date

  public type!: string
  public state!: string
  public issuerSSN!: string
  public data!: object
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    created: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    modified: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    type: {
      type: DataTypes.ENUM,
      values: Object.values(ApplicationTypes),
      allowNull: false,
    },
    state: {
      type: DataTypes.ENUM,
      values: Object.values(ApplicationStates),
      allowNull: false,
    },
    issuerSSN: {
      type: DataTypes.STRING,
      field: 'issuer_ssn',
      allowNull: false,
      references: {
        model: 'issuer',
        key: 'ssn',
      },
    },
    data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'application',
    indexes: [
      {
        unique: true,
        fields: ['issuer_ssn', 'type'],
      },
    ],
  },
)

Application.hasMany(AuditLog)

export default Application
