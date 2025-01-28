'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'case_file',
        'defendant_id',
        {
          type: Sequelize.UUID,
          references: {
            model: 'defendant',
            key: 'id',
          },
          allowNull: true,
        },
        { transaction: t },
      )
      await queryInterface.addColumn(
        'case_file',
        'civil_claimant_id',
        {
          type: Sequelize.UUID,
          references: {
            model: 'civil_claimant',
            key: 'id',
          },
          allowNull: true,
        },
        { transaction: t },
      )
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('case_file', 'civil_claimant_id', {
        transaction: t,
      })
      await queryInterface.removeColumn('case_file', 'defendant_id', {
        transaction: t,
      })
    })
  },
}
