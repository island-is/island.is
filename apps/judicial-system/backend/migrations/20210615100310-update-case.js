'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_accused_plea_decision" ADD VALUE \'NOT_APPLICABLE\';',
      )
    } catch (e) {
      if (e.message != 'enum label "NOT_APPLICABLE" already exists') {
        throw e
      }
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_appeal_decision" ADD VALUE \'NOT_APPLICABLE\';',
      )
    } catch (e) {
      if (e.message != 'enum label "NOT_APPLICABLE" already exists') {
        throw e
      }
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        'ALTER TYPE "enum_case_decision" ADD VALUE \'ACCEPTING_PARTIALLY\';',
      )
    } catch (e) {
      if (e.message != 'enum label "ACCEPTING_PARTIALLY" already exists') {
        throw e
      }
    }

    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'session_arrangements',
          {
            type: Sequelize.ENUM(
              'ALL_PRESENT',
              'PROSECUTOR_PRESENT',
              'REMOTE_SESSION',
            ),
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'case',
          'addition_to_conclusion',
          'conclusion',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .removeColumn('case', 'session_arrangements', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS "enum_case_session_arrangements"',
              { transaction: t },
            ),
          ),
        queryInterface.renameColumn(
          'case',
          'conclusion',
          'addition_to_conclusion',
          { transaction: t },
        ),
      ]),
    )
  },
}
