'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('payment', 'definition', {
      type: Sequelize.TEXT,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    // Check for records that might be truncated
    const records = await queryInterface.sequelize.query(
      `SELECT id FROM payment WHERE LENGTH(CAST(definition AS TEXT)) > 255`,
    )
    if (records[0].length > 0) {
      throw new Error(
        'Cannot safely rollback: Some records exceed STRING length limit',
      )
    }

    await queryInterface.changeColumn('payment', 'definition', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },
}
