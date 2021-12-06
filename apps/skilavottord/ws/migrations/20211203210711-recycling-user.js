'use strict'

module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'recycling_user',
    {
      national_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      role: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      partnerid: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
      },
      created_at: {
        type: DataTypes.DATE,
        //defaultValue: DataTypes.fn('now'),
      },
      updated_at: {
        type: DataTypes.DATE,
        //defaultValue: DataTypes.fn('now'),
      },
    },
    {
      charset: 'utf8',
    },
  )
}

module.exports.down = (queryInterface) =>
  queryInterface.dropTable('recycling_user')
