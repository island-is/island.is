'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'accused_plea_decision', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_accused_plea_decision";',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'accused_plea_decision',
        {
          type: Sequelize.ENUM('ACCEPT', 'REJECT'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
