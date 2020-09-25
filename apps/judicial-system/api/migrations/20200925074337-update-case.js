'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'case',
          'laws_broken',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'case_facts',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'witness_accounts',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'investigation_progress',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'legal_arguments',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'comments',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'court_attendees',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'police_demands',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'suspect_plea',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'litigation_presentations',
          {
            type: Sequelize.TEXT,
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.changeColumn(
          'case',
          'laws_broken',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'case_facts',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'witness_accounts',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'investigation_progress',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'legal_arguments',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'comments',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'court_attendees',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'police_demands',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'suspect_plea',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.changeColumn(
          'case',
          'litigation_presentations',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
      ])
    })
  },
}
