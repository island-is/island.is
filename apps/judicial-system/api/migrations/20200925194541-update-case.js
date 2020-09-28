'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'suspect_national_id',
          'accused_national_id',
          { transaction: t },
        ),
        queryInterface.renameColumn('case', 'suspect_name', 'accused_name', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'case',
          'suspect_address',
          'accused_address',
          { transaction: t },
        ),
        queryInterface.renameColumn('case', 'suspect_plea', 'accused_plea', {
          transaction: t,
        }),
        queryInterface.addColumn(
          'case',
          'ruling',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'custody_end_date',
          {
            type: Sequelize.DATE,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface
          .renameColumn(
            'case',
            'custody_restrictions',
            'requested_custody_restrictions',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              'ALTER TABLE "case" ADD COLUMN "custody_restrictions" "enum_case_custody_restrictions"[];',
              { transaction: t },
            ),
          ),
        queryInterface.sequelize.query(
          'CREATE TYPE "enum_case_appeal_decision" AS ENUM (\'APPEAL\', \'ACCEPT\', \'POSTPONE\');\
          ALTER TABLE "case" ADD COLUMN "accused_appeal_decision" "enum_case_appeal_decision"[];',
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          'ALTER TABLE "case" ADD COLUMN "prosecutor_appeal_decision" "enum_case_appeal_decision"[];',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.renameColumn(
          'case',
          'accused_national_id',
          'suspect_national_id',
          { transaction: t },
        ),
        queryInterface.renameColumn('case', 'accused_name', 'suspect_name', {
          transaction: t,
        }),
        queryInterface.renameColumn(
          'case',
          'accused_address',
          'suspect_address',
          { transaction: t },
        ),
        queryInterface.renameColumn('case', 'accused_plea', 'suspect_plea', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'ruling', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'custody_end_date', {
          transaction: t,
        }),
        queryInterface
          .removeColumn('case', 'custody_restrictions', {
            transaction: t,
          })
          .then(() =>
            queryInterface.renameColumn(
              'case',
              'requested_custody_restrictions',
              'custody_restrictions',
              { transaction: t },
            ),
          ),
        queryInterface.removeColumn('case', 'accused_appeal_decision', {
          transaction: t,
        }),
        queryInterface
          .removeColumn('case', 'prosecutor_appeal_decision', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_appeal_decision";',
              { transaction: t },
            ),
          ),
      ]),
    )
  },
}
