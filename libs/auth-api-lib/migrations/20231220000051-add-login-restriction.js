'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.createTable('login_restriction', {
      national_id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      phone_number: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      restricted_until: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      modified: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },

  async down(queryInterface) {
    return queryInterface.dropTable('login_restriction')
  },
}
