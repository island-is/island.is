'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('organization', 'logo', {
      type: Sequelize.JSONB,
      defaultValue: { is: '', en: '' },
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('organization', 'logo')
  },
}
