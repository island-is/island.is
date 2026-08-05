'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'defendant',
        'public_prosecutor_is_registered_in_police_system',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
        UPDATE "defendant" d
        SET "public_prosecutor_is_registered_in_police_system" = true
        FROM "case" c
        WHERE d."case_id" = c."id"
          AND c."public_prosecutor_is_registered_in_police_system" = true
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn(
        'case',
        'public_prosecutor_is_registered_in_police_system',
        { transaction: t },
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'case',
        'public_prosecutor_is_registered_in_police_system',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      )

      // Restore case field from defendant values
      await queryInterface.sequelize.query(
        `
        UPDATE "case" c
        SET "public_prosecutor_is_registered_in_police_system" = true
        WHERE EXISTS (
          SELECT 1
          FROM "defendant" d
          WHERE d."case_id" = c."id"
            AND d."public_prosecutor_is_registered_in_police_system" = true
        )
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn(
        'defendant',
        'public_prosecutor_is_registered_in_police_system',
        { transaction: t },
      )
    })
  },
}
