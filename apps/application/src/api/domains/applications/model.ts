import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../../../extensions'

class Application extends Model {
  public id!: string

  public readonly created!: Date
  public readonly modified!: Date
}

Application.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
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
  },
  {
    sequelize,
    tableName: 'application',
  },
)

export default Application
