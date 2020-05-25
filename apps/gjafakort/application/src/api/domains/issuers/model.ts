import { Model, DataTypes } from 'sequelize'

import { sequelize } from '../../../extensions'

class Issuer extends Model {
  public ssn!: string

  public readonly created!: Date
  public readonly modified!: Date
}

Issuer.init(
  {
    ssn: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
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
    tableName: 'issuer',
  },
)

export default Issuer
