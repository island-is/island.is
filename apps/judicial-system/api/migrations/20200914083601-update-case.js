'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'case',
          'requested_custody_end_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'laws_broken',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          "CREATE TYPE \"enum_case_custody_provisions\" AS ENUM ('_95_1_A', '_95_1_B', '_95_1_C', '_95_1_D', '_95_2', '_99_1_B');\
          ALTER TABLE \"case\" ADD COLUMN \"custody_provisions\" \"enum_case_custody_provisions\"[];",
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          'CREATE TYPE "enum_case_custody_restrictions" AS ENUM (\'ISOLATION\', \'VISITAION\', \'COMMUNICATION\', \'MEDIA\');\
          ALTER TABLE "case" ADD COLUMN "custody_restrictions" "enum_case_custody_restrictions"[];',
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'case_facts',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'witness_accounts',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'investigation_progress',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'legal_arguments',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'comments',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('case', 'requested_custody_end_date', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'laws_broken', { transaction: t }),
        queryInterface
          .removeColumn('case', 'custody_provisions', { transaction: t })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_custody_provisions";',
              { transaction: t },
            ),
          ),
        queryInterface
          .removeColumn('case', 'custody_restrictions', { transaction: t })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_custody_restrictions";',
              { transaction: t },
            ),
          ),
        queryInterface.removeColumn('case', 'case_facts', { transaction: t }),
        queryInterface.removeColumn('case', 'witness_accounts', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'investigation_progress', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'legal_arguments', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'comments', { transaction: t }),
      ])
    })
  },
}
