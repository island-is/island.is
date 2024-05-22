'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'robot_log',
        {
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
          seq_number: {
            type: Sequelize.INTEGER,
            defaultValue: Sequelize.literal("nextval('robot_email_seq')"),
            allowNull: false,
          },
          delivered: {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          type: {
            type: Sequelize.STRING,
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
          element_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('robot_log', { transaction: t }),
    )
  },
}
