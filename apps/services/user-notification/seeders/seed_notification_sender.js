'use strict'

const recipient = '0101302989'

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'notification_category',
      [
        {
          category: 'heilbrigdismal',
          label: JSON.stringify({ is: 'Heilbrigðismál', en: 'Health' }),
        },
      ],
      { ignoreDuplicates: true },
    )

    return queryInterface.bulkInsert(
      'user_notification_sender',
      [
        {
          recipient,
          sender_id: '5212120630',
          category: 'heilbrigdismal',
        },
        // Uncategorized, presented as 'almennt'
        {
          recipient,
          sender_id: '5701740619',
          category: null,
        },
      ],
      {},
    )
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('user_notification_sender', { recipient })
    return queryInterface.bulkDelete('notification_category', {
      category: 'heilbrigdismal',
    })
  },
}
