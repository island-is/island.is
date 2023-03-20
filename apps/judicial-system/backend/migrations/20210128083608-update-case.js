'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'type',
        {
          type: Sequelize.ENUM('CUSTODY', 'TRAVEL_BAN'),
          allowNull: false,
          defaultValue: 'CUSTODY',
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'type', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_type";',
            { transaction: t },
          ),
        ),
    )
  },
}
