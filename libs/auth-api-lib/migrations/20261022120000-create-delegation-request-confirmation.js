'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delegation_request_confirmation', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      delegation_request_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'delegation_request',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      delegation_confirmation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'delegation_confirmation',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      created: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('now'),
      },
      modified: {
        type: Sequelize.DATE,
      },
    })

    await queryInterface.addConstraint('delegation_request_confirmation', {
      fields: ['delegation_request_id', 'delegation_confirmation_id'],
      type: 'unique',
      name: 'delegation_request_confirmation_unique',
    })
    await queryInterface.addIndex('delegation_request_confirmation', {
      name: 'delegation_request_confirmation_confirmation_idx',
      fields: ['delegation_confirmation_id'],
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('delegation_request_confirmation')
  },
}
