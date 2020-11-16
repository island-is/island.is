'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'user',
          'email',
          {
            type: Sequelize.STRING,
            allowNull: false,
          },
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          `ALTER TABLE "user" ALTER COLUMN "title" DROP DEFAULT;`,
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          `ALTER TABLE "case" ALTER COLUMN "police_case_number" DROP DEFAULT;`,
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          `ALTER TABLE "case" ALTER COLUMN "accused_national_id" DROP DEFAULT;`,
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          `ALTER TABLE "case" ALTER COLUMN "accused_name" DROP DEFAULT;`,
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'user',
          'email',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'user',
          'title',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'óþekkt',
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'police_case_number',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'accused_national_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        // Don't need to rollback modification to accused_name as the default value was NULL
      ]),
    )
  },
}
