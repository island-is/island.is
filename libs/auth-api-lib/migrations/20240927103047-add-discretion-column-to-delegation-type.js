'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('delegation_type', 'actor_discretion_required', {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      }),
    ])
  },

  async down(queryInterface) {
    return Promise.all([
      queryInterface.removeColumn(
        'delegation_type',
        'actor_discretion_required',
      ),
    ])
  },
}
