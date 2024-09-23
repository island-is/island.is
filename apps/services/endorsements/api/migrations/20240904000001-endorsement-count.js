module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the 'endorsement_count' column to 'endorsement_list' table
    await queryInterface.addColumn('endorsement_list', 'endorsement_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    })

    // Add composite index on 'endorsement_count' and 'counter'
    await queryInterface.addIndex(
      'endorsement_list',
      ['endorsement_count', 'counter'],
      {
        name: 'idx_endorsement_count_counter',
      },
    )
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the composite index on 'endorsement_count' and 'counter'
    await queryInterface.removeIndex(
      'endorsement_list',
      'idx_endorsement_count_counter',
    )

    // Remove the 'endorsement_count' column from 'endorsement_list' table
    await queryInterface.removeColumn('endorsement_list', 'endorsement_count')
  },
}
