'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'appeal_state',
        {
          type: Sequelize.ENUM('APPEALED', 'RECEIVED', 'COMPLETED'),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'appeal_state', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_case_appeal_state',
            { transaction: t },
          ),
        ),
    )
  },
}
