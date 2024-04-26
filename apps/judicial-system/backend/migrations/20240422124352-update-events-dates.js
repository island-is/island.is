'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.createTable(
          'explanatory_comment',
          {
            created: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            modified: {
              type: Sequelize.DATE,
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            comment_type: { type: Sequelize.STRING, allowNull: false },
            case_id: {
              type: Sequelize.UUID,
              references: { model: 'case', key: 'id' },
              allowNull: false,
            },
            comment: { type: Sequelize.TEXT, allowNull: false },
          },
          {
            transaction,
            uniqueKeys: {
              unique_explanatory_comment_case_id_comment_type: {
                fields: ['case_id', 'comment_type'],
              },
            },
          },
        ),
        queryInterface.addColumn(
          'date_log',
          'modified',
          {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'date_log',
          'location',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        ),
      ])
        .then(() =>
          queryInterface.sequelize.query(
            `DELETE FROM date_log
             WHERE (created, case_id, date_type) NOT IN (
               SELECT MAX(created), case_id, date_type
               FROM date_log
               GROUP BY case_id, date_type
             );
             UPDATE date_log
             SET date_type = 'ARRAIGNMENT_DATE'
             WHERE date_type = 'COURT_DATE';
             UPDATE date_log
             SET location = c.court_room
             FROM "case" c
             WHERE c.id = date_log.case_id;`,
            { transaction },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.removeColumn('case', 'court_room', { transaction }),
            queryInterface.addConstraint('date_log', {
              fields: ['case_id', 'date_type'],
              type: 'unique',
              name: 'unique_date_log_case_id_date_type',
              transaction,
            }),
          ]),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'court_room',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        ),
        queryInterface.removeConstraint(
          'date_log',
          'unique_date_log_case_id_date_type',
          { transaction },
        ),
      ])
        .then(() =>
          queryInterface.sequelize.query(
            `DELETE FROM date_log
             WHERE date_type = 'COURT_DATE'`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case" c
             SET court_room = d.location
             FROM date_log d
             WHERE c.id = d.case_id and d.date_type = 'ARRAIGNMENT_DATE'`,
            { transaction },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.dropTable('explanatory_comment', { transaction }),
            queryInterface.removeColumn('date_log', 'location', {
              transaction,
            }),
            queryInterface.removeColumn('date_log', 'modified', {
              transaction,
            }),
            queryInterface.sequelize.query(
              `UPDATE date_log
               SET date_type = 'COURT_DATE'
               WHERE date_type = 'ARRAIGNMENT_DATE'`,
              { transaction },
            ),
          ]),
        ),
    )
  },
}
