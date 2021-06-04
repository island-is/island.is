'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'organisation',
          'modified_by',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'administrative_contact',
          'modified_by',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'technical_contact',
          'modified_by',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'helpdesk',
          'modified_by',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.renameColumn('provider', 'created_by', 'modified_by', {
          transaction: t,
        }),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('organisation', 'modified_by', {
          transaction: t,
        }),
        queryInterface.removeColumn('administrative_contact', 'modified_by', {
          transaction: t,
        }),
        queryInterface.removeColumn('technical_contact', 'modified_by', {
          transaction: t,
        }),
        queryInterface.removeColumn('helpdesk', 'modified_by', {
          transaction: t,
        }),
        queryInterface.renameColumn('provider', 'modified_by', 'created_by', {
          transaction: t,
        }),
      ]),
    )
  },
}
