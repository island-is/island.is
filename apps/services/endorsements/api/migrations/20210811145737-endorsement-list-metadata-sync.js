'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'endorsement_list',
        'endorsement_metadata',
        {
          type: Sequelize.JSONB,
          defaultValue: '[]',
          allowNull: false,
        },
        { transaction: t },
      )

      const newMetadataFields = [
        {
          field: 'fullName',
        },
      ]
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'endorsement_list',
      'endorsement_metadata',
    )
  },
}
