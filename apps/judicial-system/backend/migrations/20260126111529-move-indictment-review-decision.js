'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Add the indictment_review_decision column to the defendant table
      await queryInterface.addColumn(
        'defendant',
        'indictment_review_decision',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )

      // Populate defendant.indictment_review_decision from case.indictment_review_decision
      await queryInterface.sequelize.query(
        `UPDATE "defendant" d
         SET "indictment_review_decision" = c."indictment_review_decision"::text
         FROM "case" c
         WHERE d."case_id" = c."id"
         AND c."indictment_review_decision" IS NOT NULL`,
        { transaction: t },
      )

      // Remove the indictment_review_decision column from the case table
      await queryInterface.removeColumn('case', 'indictment_review_decision', {
        transaction: t,
      })

      // Drop the enum type from the case table
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_case_indictment_review_decision";',
        { transaction: t },
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      // Re-add the indictment_review_decision column to the case table
      await queryInterface.addColumn(
        'case',
        'indictment_review_decision',
        {
          type: Sequelize.ENUM('APPEAL', 'ACCEPT'),
          allowNull: true,
        },
        { transaction: t },
      )

      // Populate case.indictment_review_decision from defendant.indictment_review_decision
      // Note: If there are multiple defendants with different values, this will use the first one
      await queryInterface.sequelize.query(
        `UPDATE "case" c
         SET "indictment_review_decision" = (
           SELECT d."indictment_review_decision"::text
           FROM "defendant" d
           WHERE d."case_id" = c."id"
           AND d."indictment_review_decision" IS NOT NULL
           LIMIT 1
         )`,
        { transaction: t },
      )

      // Remove the indictment_review_decision column from the defendant table
      await queryInterface.removeColumn(
        'defendant',
        'indictment_review_decision',
        {
          transaction: t,
        },
      )
    })
  },
}
