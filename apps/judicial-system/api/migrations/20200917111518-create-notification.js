'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notification', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      created: {
        type: 'TIMESTAMP WITH TIME ZONE',
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      case_id: {
        type: Sequelize.UUID,
        references: {
          model: 'case',
          key: 'id',
        },
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('HEADS_UP', 'READY_FOR_COURT'),
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface
      .dropTable('notification')
      .then(() =>
        queryInterface.sequelize.query(
          'DROP TYPE IF EXISTS "enum_notification_type";',
        ),
      )
  },
}
