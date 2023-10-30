'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn('user_profile', 'last_nudge', {
      type: 'TIMESTAMP WITH TIME ZONE',
      allowNull: true,
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user_profile', 'last_nudge')
  },
}
