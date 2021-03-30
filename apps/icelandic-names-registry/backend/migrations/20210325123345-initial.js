'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('names', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      verdict_date: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      visible: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      modified: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('names')
  },
}
