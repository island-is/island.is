'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('identity_confirmation', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      ticket_id: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('email', 'phone', 'chat', 'Web Form'),
        allowNull: false,
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('identity_confirmation', { transaction })
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_identity_confirmation_type"',
        { transaction },
      )
    })
  },
}
