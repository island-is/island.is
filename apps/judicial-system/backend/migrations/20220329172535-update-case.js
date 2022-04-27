'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'is_archived',
          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
          { transaction },
        ),
        queryInterface.createTable(
          'case_archive',
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
            case_id: {
              type: Sequelize.UUID,
              references: {
                model: 'case',
                key: 'id',
              },
              allowNull: false,
            },
            archive: {
              type: Sequelize.TEXT,
              allowNull: false,
            },
          },
          { transaction },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('case', 'is_archived', { transaction }),
        queryInterface.dropTable('case_archive', { transaction }),
      ]),
    )
  },
}
