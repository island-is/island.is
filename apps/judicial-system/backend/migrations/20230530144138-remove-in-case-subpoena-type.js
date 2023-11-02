'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'subpoena_type', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_case_subpoena_type',
            { transaction: t },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'subpoena_type',
        {
          type: Sequelize.ENUM('ARREST_SUMMONS', 'ABSENCE_SUMMONS'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
