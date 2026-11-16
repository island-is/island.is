'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn('case', 'defender_name', {
        transaction,
      })
      await queryInterface.removeColumn('case', 'defender_national_id', {
        transaction,
      })
      await queryInterface.removeColumn('case', 'defender_email', {
        transaction,
      })
      await queryInterface.removeColumn('case', 'defender_phone_number', {
        transaction,
      })
      await queryInterface.removeColumn(
        'case',
        'request_shared_with_defender',
        {
          transaction,
        },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_case_request_shared_with_defender"',
        { transaction },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'case',
        'defender_name',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'defender_national_id',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'defender_email',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'defender_phone_number',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )
      await queryInterface.addColumn(
        'case',
        'request_shared_with_defender',
        {
          type: Sequelize.ENUM('READY_FOR_COURT', 'COURT_DATE', 'NOT_SHARED'),
          allowNull: true,
        },
        { transaction },
      )
    })
  },
}
