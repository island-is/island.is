'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'defendant_plea',
        {
          type: Sequelize.ENUM('GUILTY', 'NOT_GUILTY', 'NO_PLEA'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'defendant_plea', {
          transaction: t,
        })
        .then(() => {
          queryInterface.sequelize.query(
            'DROP TYPE "enum_case_defendant_plea";',
            { transaction: t },
          )
        }),
    )
  },
}
