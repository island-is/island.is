'use strict'

const nationalId = '0101302989'
const userProfileId = '6f1c2a4e-3b7d-4c8e-9a1f-2d5e8b0c7a13'
const blockedNotificationIds = [
  'a3e9d1b2-7c4f-4e8a-b6d0-1f2c3e4a5b6c',
  'c7b2e4f6-1a3d-4b5c-8e9f-0a1b2c3d4e5f',
]

module.exports = {
  up: async (queryInterface) => {
    // blocked_notifications references user_profile.national_id
    await queryInterface.bulkInsert(
      'user_profile',
      [{ id: userProfileId, national_id: nationalId }],
      { ignoreDuplicates: true },
    )

    return queryInterface.bulkInsert(
      'blocked_notifications',
      [
        // Also received, see user-notification seed_notification_sender.js
        {
          id: blockedNotificationIds[0],
          national_id: nationalId,
          sender_id: '5212120630',
          category: 'heilbrigdismal',
          category_label: JSON.stringify({
            is: 'Heilbrigðismál',
            en: 'Health',
          }),
        },
        // Blocked but never received, e.g. after a category was renamed
        {
          id: blockedNotificationIds[1],
          national_id: nationalId,
          sender_id: '5701740619',
          category: 'skattar',
          category_label: JSON.stringify({ is: 'Skattar', en: 'Taxes' }),
        },
      ],
      {},
    )
  },

  down: async (queryInterface) => {
    // user_profile may predate this seeder, so it is kept
    return queryInterface.bulkDelete('blocked_notifications', {
      id: blockedNotificationIds,
    })
  },
}
