'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'appeal_ruling_decision',
          {
            type: Sequelize.ENUM(
              'ACCEPTING',
              'REPEAL',
              'CHANGED',
              'DISMISSED_FROM_COURT_OF_APPEAL',
              'DISMISSED_FROM_COURT',
              'REMAND',
            ),
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_conclusion',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .removeColumn('case', 'appeal_ruling_decision', {
            transaction: t,
          })
          .then(() =>
            queryInterface.sequelize.query(
              'DROP TYPE IF EXISTS enum_case_appeal_ruling_decision',
              { transaction: t },
            ),
          ),
        queryInterface.removeColumn('case', 'appeal_conclusion', {
          transaction: t,
        }),
      ]),
    )
  },
}
