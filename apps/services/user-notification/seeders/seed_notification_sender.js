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
        {
          category: 'innheimta',
          label: JSON.stringify({ is: 'Innheimta', en: 'Collection' }),
        },
      ],
      { ignoreDuplicates: true },
    )

    return queryInterface.bulkInsert(
      'user_notification_sender',
      [
        // An informative and an actionable template in the same category
        {
          recipient,
          sender_id: '5212120630',
          template_id: 'HNIPP.SEED.HEALTH_INFO',
          category: 'heilbrigdismal',
          priority_type: 'Informative',
        },
        {
          recipient,
          sender_id: '5212120630',
          template_id: 'HNIPP.SEED.HEALTH_ACTION',
          category: 'heilbrigdismal',
          priority_type: 'Actionable',
        },
        // Uncategorized, presented as 'almennt'
        {
          recipient,
          sender_id: '5701740619',
          template_id: 'HNIPP.SEED.GENERAL',
          category: null,
          priority_type: null,
        },
        // Only actionable, still offered
        {
          recipient,
          sender_id: '5701740619',
          template_id: 'HNIPP.SEED.COLLECTION_ACTION',
          category: 'innheimta',
          priority_type: 'Actionable',
        },
      ],
      {},
    )
  },

  down: async (queryInterface) => {
    // notification_category rows may predate this seeder, so they are kept
    return queryInterface.bulkDelete('user_notification_sender', { recipient })
  },
}
