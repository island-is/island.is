'use strict'

module.exports = {
  up: async (queryInterface) => {
    return queryInterface.bulkInsert(
      'user_notification',
      [
        {
          message_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
          recipient: '0101302989',
          sender_id: '5212120630',
          template_id: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
          args: JSON.stringify([
            { key: 'organization', value: 'REPLACEDBYSENDERID' },
            { key: 'documentId', value: '1234567890' },
          ]),
          created: new Date(),
          updated: new Date(),
          read: false,
          seen: false,
        },
        {
          message_id: '58cc4372-a567-0e02b2c3d479f47ac10b',
          recipient: '0101302989',
          sender_id: '5701740619',
          template_id: 'HNIPP.POSTHOLF.NEW_DOCUMENT',
          args: JSON.stringify([
            { key: 'organization', value: 'REPLACEDBYSENDERID' },
            { key: 'documentId', value: '1234567890' },
          ]),
          created: new Date(),
          updated: new Date(),
          read: false,
          seen: false,
        },
        // Add more seed data here
      ],
      {},
    )
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete('user_notification', null, {})
  },
}
