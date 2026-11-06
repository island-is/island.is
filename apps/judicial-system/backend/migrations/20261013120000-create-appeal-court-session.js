'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'appeal_court_session',
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
            modified: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            case_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: { model: 'case', key: 'id' },
            },
            appeal_case_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: { model: 'appeal_case', key: 'id' },
            },
            session_type: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            session_date: {
              type: 'TIMESTAMP WITH TIME ZONE',
              allowNull: false,
            },
            court_room: {
              type: Sequelize.STRING,
              allowNull: false,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.addIndex('appeal_court_session', ['appeal_case_id'], {
            name: 'appeal_court_session_appeal_case_id_idx',
            transaction,
          }),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('appeal_court_session')
  },
}
