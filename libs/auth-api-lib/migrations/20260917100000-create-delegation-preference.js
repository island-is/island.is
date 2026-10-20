'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'delegation_preference',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          to_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          from_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          favourited_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          last_used_at: {
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
        },
        { transaction },
      )

      // Also the read index: the leading column serves lookup by actor.
      await queryInterface.addConstraint('delegation_preference', {
        fields: ['to_national_id', 'from_national_id'],
        type: 'unique',
        name: 'delegation_preference_to_from_unique',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return await queryInterface.dropTable('delegation_preference')
  },
}
