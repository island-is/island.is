'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('program', 'application_start_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
      queryInterface.changeColumn('program', 'application_end_date', {
        type: Sequelize.DATE,
        allowNull: true,
      }),
    ])
  },

  async down(queryInterface, Sequelize) {
    const t = await queryInterface.sequelize.transaction()
    try {
      // 1) Fix existing NULLs
      await queryInterface.sequelize.query(
        `
        UPDATE "program"
        SET "application_start_date" = '1970-01-01'
        WHERE "application_start_date" IS NULL;
    `,
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
        UPDATE "program"
        SET "application_end_date" = '1970-01-01'
        WHERE "application_end_date" IS NULL;
    `,
        { transaction: t },
      )

      // 2) Alter columns (NOT NULL + default)
      await queryInterface.changeColumn(
        'program',
        'application_start_date',
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction: t },
      )

      await queryInterface.changeColumn(
        'program',
        'application_end_date',
        {
          type: Sequelize.DATE,
          allowNull: false,
        },
        { transaction: t },
      )

      await t.commit()
    } catch (err) {
      await t.rollback()
      throw err
    }
  },
}
