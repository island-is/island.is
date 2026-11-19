'use strict'

// NULL page_index means no page has been saved yet, so 0 always means the
// first page.
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.changeColumn(
        'application',
        'page_index',
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          defaultValue: null,
        },
        { transaction: t },
      )
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.bulkUpdate(
        'application',
        { page_index: 0 },
        { page_index: null },
        { transaction: t },
      )
      await queryInterface.changeColumn(
        'application',
        'page_index',
        {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0,
        },
        { transaction: t },
      )
    })
  },
}
