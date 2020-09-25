'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn('case', 'description', { transaction: t }),
        queryInterface.changeColumn(
          'case',
          'suspect_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          'case',
          'description',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'MISSING',
          },
          { transaction: t },
        ),
        queryInterface.sequelize
          .query(
            `UPDATE "case" SET suspect_name = 'MISSING' WHERE suspect_name IS NULL;`,
            { transaction: t },
          )
          .then(() =>
            queryInterface.changeColumn(
              'case',
              'suspect_name',
              {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: 'MISSING',
              },
              { transaction: t },
            ),
          ),
      ])
    })
  },
}
