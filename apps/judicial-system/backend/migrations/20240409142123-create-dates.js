'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .createTable(
          'date-log',
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
              references: {
                model: 'case',
                key: 'id',
              },
              allowNull: false,
            },
            court_date: {
              type: Sequelize.DATE,
              allowNull: true,
            },
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `insert into "date-log" (id, case_id, court_date)
               select md5(random()::text || clock_timestamp()::text)::uuid, 
               id, 
               court_date
              from "case"`,
            { transaction: t },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.removeColumn('case', 'court_date', {
              transaction: t,
            }),
          ]),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'court_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
      ])
        .then(() =>
          queryInterface.sequelize.query(
            `update "case"
               set court_date = d.court_date
             from (
               select distinct on (case_id) *
               from "date-log"
               order by case_id, created
             ) d
             where "case".id = d.case_id`,
            { transaction: t },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.dropTable('date-log', { transaction: t }),
          ]),
        ),
    )
  },
}
