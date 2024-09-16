module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'access_control',
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
      partner_id: {
        allowNull: true,
        type: DataTypes.STRING,
      },
    },
    {
      charset: 'utf8',
      timestamps: false,
    },
  )
}

module.exports.down = (queryInterface) =>
  queryInterface.dropTable('access_control')
