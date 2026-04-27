'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'appeal_event_log',
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
              allowNull: false,
              references: { model: 'case', key: 'id' },
            },
            appeal_case_id: {
              type: Sequelize.UUID,
              allowNull: false,
              references: { model: 'appeal_case', key: 'id' },
            },
            event_type: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            user_role: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            defendant_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: { model: 'defendant', key: 'id' },
            },
            civil_claimant_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: { model: 'civil_claimant', key: 'id' },
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.addIndex('appeal_event_log', ['case_id'], {
            name: 'appeal_event_log_case_id_idx',
            transaction,
          }),
        )
        .then(() =>
          queryInterface.addIndex(
            'appeal_event_log',
            ['appeal_case_id', 'event_type'],
            {
              name: 'appeal_event_log_appeal_case_event_type_idx',
              transaction,
            },
          ),
        )
        .then(() =>
          queryInterface.addIndex('appeal_event_log', ['defendant_id'], {
            name: 'appeal_event_log_defendant_id_idx',
            transaction,
          }),
        )
        .then(() =>
          queryInterface.addIndex('appeal_event_log', ['civil_claimant_id'], {
            name: 'appeal_event_log_civil_claimant_id_idx',
            transaction,
          }),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('appeal_event_log', { transaction }),
    )
  },
}
