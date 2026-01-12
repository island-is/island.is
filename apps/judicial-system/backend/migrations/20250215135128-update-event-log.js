'use strict'

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      return Promise.all([
        await queryInterface.addColumn(
          'event_log',
          'user_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        await queryInterface.addColumn(
          'event_log',
          'user_title',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        await queryInterface.addColumn(
          'event_log',
          'institution_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
      ]).then(() =>
        queryInterface.sequelize.query(
          `
          UPDATE event_log
          SET user_name = u.name, 
              user_title = u.title, 
              institution_name = i.name
          FROM "user" u
          JOIN institution i ON u.institution_id = i.id
          WHERE event_log.national_id = u.national_id 
          `,
          { transaction },
        ),
      )
    })
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      return Promise.all([
        queryInterface.removeColumn('event_log', 'user_name', { transaction }),
        queryInterface.removeColumn('event_log', 'user_title', { transaction }),
        queryInterface.removeColumn('event_log', 'institution_name', {
          transaction,
        }),
      ])
    })
  },
}
