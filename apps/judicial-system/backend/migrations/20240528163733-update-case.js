'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'indictment_decision',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'indictment_decision', {
          transaction: t,
        })
        .then(() => {
          queryInterface.sequelize.query(
            'DROP TYPE "enum_case_indictment_decision";',
            { transaction: t },
          )
        }),
    )
  },
}
