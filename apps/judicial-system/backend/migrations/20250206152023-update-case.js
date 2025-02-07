'use strict'

const replaceEnum = require('sequelize-replace-enum-postgres').default

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the new boolean field
    await queryInterface.addColumn('case', 'is_completed_without_ruling', {
      type: Sequelize.BOOLEAN,
      allowNull: true,
    })

    await queryInterface.sequelize.query(`
      UPDATE "case"
      SET "is_completed_without_ruling" = true
      WHERE "decision" = 'COMPLETED_WITHOUT_RULING'
    `)

    await queryInterface.sequelize.query(`
      UPDATE "case"
      SET "decision" = 'ACCEPTING'
      WHERE "decision" = 'COMPLETED_WITHOUT_RULING'
    `)

    // Replace the enum values
    await replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'decision',
      newValues: [
        'ACCEPTING',
        'REJECTING',
        'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
        'ACCEPTING_PARTIALLY',
        'DISMISSING',
      ],
      enumName: 'enum_case_decision',
    })
  },

  down: async (queryInterface) => {
    // Revert the enum values
    await replaceEnum({
      queryInterface,
      tableName: 'case',
      columnName: 'decision',
      newValues: [
        'ACCEPTING',
        'REJECTING',
        'ACCEPTING_ALTERNATIVE_TRAVEL_BAN',
        'ACCEPTING_PARTIALLY',
        'DISMISSING',
        'COMPLETED_WITHOUT_RULING', // Adding back the removed value
      ],
      enumName: 'enum_case_decision',
    })

    // Revert the enum value changes
    await queryInterface.sequelize.query(`
      UPDATE "case"
      SET "decision" = 'COMPLETED_WITHOUT_RULING'
      WHERE "decision" = 'ACCEPTING' AND "is_completed_without_ruling" = true
    `)

    // Remove the new boolean field
    await queryInterface.removeColumn('case', 'is_completed_without_ruling')
  },
}
