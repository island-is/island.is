'use strict'

// import { QueryInterface, Sequelize } from 'sequelize'

module.exports = {
  // async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      Promise.all([
        queryInterface
          .addColumn(
            'notification',
            'recipients_json',
            {
              defaultValue: [],
              type: Sequelize.ARRAY(Sequelize.JSON),
              allowNull: false,
            },
            { transaction },
          )
          .catch((err) => {
            console.error(
              'Error adding column recipients_json to table notification',
              err,
            )
            throw err
          }),
        queryInterface.sequelize
          .query(`select * from notification`, { transaction })
          .then(([notifications]) =>
            notifications.map((notification) => {
              let fallback = [{ success: false }]
              let parsedRecipients = fallback
              try {
                parsedRecipients = JSON.parse(notification.recipients)
                if (!parsedRecipients || parsedRecipients.length === 0) {
                  parsedRecipients = fallback
                }
              } catch (e) {
                console.error(
                  `Failed to parse recipients for notification ${notification.id}. Defaulting to: [{ success: false }]`,
                  notification,
                )
                parsedRecipients = fallback
              }
              return queryInterface.bulkUpdate(
                'notification',
                { recipients_json: parsedRecipients },
                { id: [notification.id] },
                { transaction },
              )
            }),
          )
          .catch((err) => {
            console.error('Error when copying', err)
            throw err
          }),
        queryInterface
          .removeColumn('notification', 'recipients', {
            transaction,
          })
          .catch((err) => {
            console.error(
              'Error removing column recipients from table notification',
              err,
            )
            throw err
          }),
        queryInterface.renameColumn(
          'notification',
          'recipients_json',
          'recipients',
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      Promise.all([
        // temp column for rollback
        queryInterface.addColumn(
          'notification',
          'recipients_json_string',
          { type: Sequelize.STRING },
          { transaction },
        ),
        // copy data from new column to temp column
        queryInterface.sequelize
          .query(`select * from notification`, { transaction })
          .then(([notifications]) =>
            notifications.map((notification) => {
              return queryInterface.bulkUpdate(
                'notification',
                {
                  recipients_json_string: JSON.stringify(
                    notification.recipients,
                  ),
                },
                { id: [notification.id] },
                { transaction },
              )
            }),
          ),
        queryInterface.removeColumn('notification', 'recipients', {
          transaction,
        }),
        queryInterface.renameColumn(
          'notification',
          'recipients_json_string',
          'recipients',
          { transaction },
        ),
      ]),
    )
  },
}
