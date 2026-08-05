'use strict'

const { Sequelize } = require('sequelize')

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'indictment_count',
        'display_order',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction },
      )

      await queryInterface.sequelize.query(
        `
        UPDATE indictment_count AS ic
        SET display_order = sub.rn
        FROM (
          SELECT
            id,
            ROW_NUMBER() OVER (
              PARTITION BY case_id
              ORDER BY created ASC NULLS LAST, id ASC
            ) - 1 AS rn
          FROM indictment_count
        ) AS sub
        WHERE ic.id = sub.id
        `,
        { transaction },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('indictment_count', 'display_order', {
        transaction,
      }),
    )
  },
}
