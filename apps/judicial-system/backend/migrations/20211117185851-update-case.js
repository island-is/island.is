'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'case',
          'initial_ruling_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            'WITH RECURSIVE initialRuling AS(\
              SELECT\
                id AS id,\
                ruling_date AS ruling_date,\
                NULL :: uuid AS parent_case_id,\
                NULL :: timestamp with time zone AS initial_ruling_date\
              FROM "case"\
              WHERE\
                parent_case_id IS NULL\
              UNION\
              SELECT\
                c.id AS id,\
                c.ruling_date AS ruling_date,\
                c.parent_case_id AS parent_case_id,\
                coalesce(i.initial_ruling_date, i.ruling_date) AS initial_ruling_date\
              FROM "case" c\
                INNER JOIN initialRuling i ON i.id = c.parent_case_id\
            )\
            Update "case" u\
            set initial_ruling_date = initialRuling.initial_ruling_date\
            from initialRuling\
            where initialRuling.id = u.id;\
            ',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'initial_ruling_date', {
        transaction: t,
      }),
    )
  },
}
