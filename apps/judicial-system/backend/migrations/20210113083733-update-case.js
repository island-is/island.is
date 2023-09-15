'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_case_custody_restrictions" ADD VALUE 'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION';`,
      )
    } catch (e) {
      if (
        e.message !==
        'enum label "ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION" already exists'
      ) {
        throw e
      }
    }

    try {
      // ALTER TYPE ... ADD cannot run inside a transaction block
      await queryInterface.sequelize.query(
        `ALTER TYPE "enum_case_custody_restrictions" ADD VALUE 'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT';`,
      )
    } catch (e) {
      if (
        e.message !==
        'enum label "ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT" already exists'
      ) {
        throw e
      }
    }

    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'other_restrictions',
        {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    // no need to roll back
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case', 'other_restrictions', {
        transaction: t,
      }),
    )
  },
}
