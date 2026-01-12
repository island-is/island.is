'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('application_event', 'is_file_event', {
        transaction,
      })
      await queryInterface.removeColumn('application_event', 'value_id', {
        transaction,
      })
      await queryInterface.addColumn(
        'application_event',
        'event_message',
        {
          type: Sequelize.JSON,
          allowNull: false,
          defaultValue: { is: '', en: '' },
        },
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'application_event',
        'is_file_event',
        { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
        { transaction },
      )
      await queryInterface.addColumn(
        'application_event',
        'value_id',
        {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'value',
            key: 'id',
          },
          onDelete: 'CASCADE',
        },
        { transaction },
      )
      await queryInterface.removeColumn('application_event', 'event_message', {
        transaction,
      })
    })
  },
}
