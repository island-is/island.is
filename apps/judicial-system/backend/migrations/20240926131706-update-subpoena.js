'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'subpoena',
          'arraignment_date',
          {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'subpoena',
          'location',
          { type: Sequelize.STRING, allowNull: false, defaultValue: 'óþekkt' },
          { transaction },
        ),
        queryInterface.changeColumn(
          'subpoena',
          'case_id',
          {
            type: Sequelize.UUID,
            allowNull: false,
          },
          { transaction },
        ),
      ]).then(() =>
        queryInterface.sequelize.query(
          `ALTER TABLE subpoena ALTER COLUMN arraignment_date DROP DEFAULT;
           ALTER TABLE subpoena ALTER COLUMN location DROP DEFAULT;`,
          { transaction },
        ),
      ),
    )
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('subpoena', 'arraignment_date', {
          transaction,
        }),
        queryInterface.removeColumn('subpoena', 'location', { transaction }),
        queryInterface.changeColumn(
          'subpoena',
          'case_id',
          {
            type: Sequelize.UUID,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },
}
