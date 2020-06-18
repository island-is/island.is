import { Model, DataTypes } from 'sequelize'

import { ApplicationStates } from '@island.is/gjafakort/consts'
import { sequelize } from '../../extensions'

class AuditLog extends Model {
  public id!: string

  public readonly created!: Date
  public readonly modified!: Date

  public state!: string
  public title!: string
  public data!: object
  public authorSSN!: string
  public applicationId!: string
}

AuditLog.init(
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
    state: {
      type: DataTypes.ENUM,
      values: Object.values(ApplicationStates),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    data: {
      type: DataTypes.JSONB,
      defaultValue: {},
      allowNull: false,
    },
    authorSSN: {
      type: DataTypes.STRING,
      field: 'author_ssn',
      allowNull: false,
    },
    applicationId: {
      type: DataTypes.STRING,
      field: 'application_id',
      allowNull: false,
      references: {
        model: 'application',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'audit_log',
  },
)

export default AuditLog
