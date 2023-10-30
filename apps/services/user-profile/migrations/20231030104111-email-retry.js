'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.addColumn('email_verification', 'tries', {
      type: Sequelize.INTEGER,
      defaultValue: 0,
      allowNull: false,
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([queryInterface.removeColumn('email_verification', 'tries')]),
    )
  },
}
