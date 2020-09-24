'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('case', 'description'),
      queryInterface.changeColumn('case', 'suspect_name', {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null,
      }),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn('case', 'description', {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: 'MISSING',
      }),
      queryInterface.sequelize
        .query(
          `UPDATE "case" SET suspect_name = 'MISSING' WHERE suspect_name IS NULL;`,
        )
        .then(() =>
          queryInterface.changeColumn('case', 'suspect_name', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          }),
        ),
    ])
  },
}
