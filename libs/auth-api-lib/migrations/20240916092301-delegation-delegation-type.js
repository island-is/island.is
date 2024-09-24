'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('delegation_delegation_type', {
      delegation_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'delegation', // Table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      delegation_type_id: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'delegation_type', // Table name
          key: 'id',
        },
        onDelete: 'CASCADE',
        primaryKey: true,
      },
      valid_to: {
        type: Sequelize.DATE,
        allowNull: true,
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

    await queryInterface.addConstraint('delegation_delegation_type', {
      fields: ['delegation_id', 'delegation_type_id'],
      type: 'unique',
      name: 'unique_delegation_delegation_type',
    })
  },

  async down(queryInterface) {
    await queryInterface.removeConstraint(
      'delegation_delegation_type',
      'unique_delegation_delegation_type',
    )

    await queryInterface.dropTable('delegation_delegation_type')
  },
}
