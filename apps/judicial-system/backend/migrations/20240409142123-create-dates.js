'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .createTable(
          'date_log',
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
            date_type: {
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
            date: {
              type: Sequelize.DATE,
              allowNull: false,
            },
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `insert into "date_log" (id, date_type, case_id, date)
              select md5(random()::text || clock_timestamp()::text)::uuid, 
              'COURT_DATE' as date_type,
              id,
              court_date
            from "case"
            where court_date is not null`,
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case', 'court_date', {
            transaction: t,
          }),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'court_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `update "case"
              set court_date = d.date
              from (
                select distinct on (case_id) *
                from "date_log"
                order by case_id
              ) d
              where "case".id = d.case_id`,
            { transaction: t },
          ),
        )
        .then(() => queryInterface.dropTable('date_log', { transaction: t })),
    )
  },
}
