'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('case', 'police_case_numbers', {
        transaction,
      }),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case',
          'police_case_numbers',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
            defaultValue: Sequelize.literal("'{}'::varchar[]"),
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            UPDATE "case" c
            SET police_case_numbers = COALESCE(
              (
                SELECT array_agg(sub.pcn ORDER BY sub.pcn)
                FROM (
                  SELECT DISTINCT cpn.police_case_number AS pcn
                  FROM case_defendant_police_case_number cpn
                  WHERE cpn.case_id = c.id
                ) sub
              ),
              '{}'::varchar[]
            )
            `,
            { transaction },
          ),
        ),
    )
  },
}
