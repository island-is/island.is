'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('user_profile_advania', {
        ssn: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
          unique: true,
        },
        email: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        mobile_phone_number: {
          type: Sequelize.STRING,
          allowNull: true,
        },
        can_nudge: {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        nudge_last_asked: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        exported: {
          type: Sequelize.DATE,
          allowNull: true,
        },
        status: {
          type: Sequelize.ENUM('PENDING', 'DONE', 'ERROR'),
          allowNull: false,
          defaultValue: 'PENDING',
        },
        created: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        modified: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      })
      .then(() => queryInterface.addIndex('user_profile_advania', ['ssn']))
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('user_profile_advania')
  },
}
