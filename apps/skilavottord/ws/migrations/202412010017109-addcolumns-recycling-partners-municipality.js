const { DataTypes } = require('sequelize')

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addColumn('recycling_partner', 'is_municipality', {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })
    await queryInterface.addColumn('recycling_partner', 'municipality_id', {
      type: DataTypes.STRING(50),
      allowNull: true,
    })
    await queryInterface.addIndex('recycling_partner', ['is_municipality'], {
      name: 'idx_recycling_partner_is_municipality',
    })
  },

  down: async (queryInterface) => {
    /* await queryInterface.removeIndex(
      'recycling_partner',
      'idx_recycling_partner_is_municipality',
    )
    await queryInterface.removeColumn('recycling_partner', 'is_municipality')
    await queryInterface.removeColumn('recycling_partner', 'municipality_id')*/
  },
}
