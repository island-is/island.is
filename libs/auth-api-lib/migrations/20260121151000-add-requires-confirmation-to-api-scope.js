module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'api_scope',
        'requires_confirmation',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment:
            'Whether this scope requires step-up authentication (tvöfalt samþykki) for sensitive information access',
        },
        { transaction },
      )
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('api_scope', 'requires_confirmation', {
        transaction,
      })
    })
  },
}
