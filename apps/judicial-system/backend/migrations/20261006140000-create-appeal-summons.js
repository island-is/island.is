'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'appeal_summons',
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
            confirmed_by_id: {
              type: Sequelize.UUID,
              allowNull: true,
              references: { model: 'user', key: 'id' },
            },
            confirmed_date: {
              type: 'TIMESTAMP WITH TIME ZONE',
              allowNull: true,
            },
            sent_to_court_of_appeals_date: {
              type: 'TIMESTAMP WITH TIME ZONE',
              allowNull: true,
            },
            hash: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            hash_algorithm: {
              type: Sequelize.STRING,
              allowNull: true,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.createTable(
            'appeal_summons_defendant',
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
              appeal_summons_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'appeal_summons', key: 'id' },
                onDelete: 'CASCADE',
              },
              defendant_id: {
                type: Sequelize.UUID,
                allowNull: false,
                references: { model: 'defendant', key: 'id' },
              },
              appellant_side: {
                type: Sequelize.STRING,
                allowNull: false,
              },
              claims: {
                type: Sequelize.TEXT,
                allowNull: false,
              },
            },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addIndex('appeal_summons', ['case_id'], {
            name: 'appeal_summons_case_id_idx',
            transaction,
          }),
        )
        .then(() =>
          queryInterface.addIndex(
            'appeal_summons_defendant',
            ['appeal_summons_id', 'defendant_id'],
            {
              name: 'appeal_summons_defendant_summons_defendant_idx',
              unique: true,
              transaction,
            },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .dropTable('appeal_summons_defendant', { transaction })
        .then(() =>
          queryInterface.dropTable('appeal_summons', { transaction }),
        ),
    )
  },
}
