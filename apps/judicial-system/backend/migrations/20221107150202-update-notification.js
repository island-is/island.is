'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      // temp column for migratating recipients
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
        .then(() =>
          // get all notifications and migrate recipients to recipients_json
          queryInterface.sequelize.query(`select * from notification`, {
            transaction,
          }),
        )
        .then(async ([notifications]) => {
          for (const notification of notifications) {
            const fallback = [{ success: false }]

            let parsedRecipients = JSON.parse(notification.recipients)
            if (!parsedRecipients || parsedRecipients.length === 0) {
              parsedRecipients = fallback
            }

            await queryInterface.bulkUpdate(
              'notification',
              { recipients_json: parsedRecipients },
              { id: [notification.id] },
              { transaction },
            )
          }
        })
        .then(() =>
          // remove old recipients column
          queryInterface.removeColumn('notification', 'recipients', {
            transaction,
          }),
        )
        .then(() =>
          // rename recipients_json to recipients
          queryInterface.renameColumn(
            'notification',
            'recipients_json',
            'recipients',
            { transaction },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      // temp column for rollback
      queryInterface
        .addColumn(
          'notification',
          'recipients_json_string',
          { type: Sequelize.STRING },
          { transaction },
        )
        .then(() =>
          // copy data from new column to temp column
          queryInterface.sequelize.query(`select * from notification`, {
            transaction,
          }),
        )
        .then(async ([notifications]) => {
          for (const notification of notifications) {
            await queryInterface.bulkUpdate(
              'notification',
              {
                recipients_json_string: JSON.stringify(notification.recipients),
              },
              { id: [notification.id] },
              { transaction },
            )
          }
        })
        .then(() =>
          // remove new column
          queryInterface.removeColumn('notification', 'recipients', {
            transaction,
          }),
        )
        .then(() =>
          // rename old column back to recipients
          queryInterface.renameColumn(
            'notification',
            'recipients_json_string',
            'recipients',
            { transaction },
          ),
        ),
    )
  },
}
