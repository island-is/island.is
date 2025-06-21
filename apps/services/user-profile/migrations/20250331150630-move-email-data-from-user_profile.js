'use strict'

const { uuid } = require('uuidv4')
module.exports = {
  async up(queryInterface) {
    console.log('Migrating email data from user_profile to emails table')
    try {
      const SIZE = 10000
      await queryInterface.sequelize.transaction(async (transaction) => {
        console.log('=== Starting migration ===')
        let offset = 0
        let hasMore = true

        while (hasMore) {
          console.log(
            `Fetching user profiles from offset ${offset} to ${offset + SIZE}`,
          )

          const userProfiles = await queryInterface.sequelize.query(
            `SELECT national_id, email, email_status FROM user_profile WHERE email_status != 'EMPTY' AND email_status != 'NOT_DEFINED' AND EMAIL != '' ORDER BY national_id ASC LIMIT ${SIZE} OFFSET ${offset}`,
            {
              type: queryInterface.sequelize.QueryTypes.SELECT,
            },
          )

          if (userProfiles.length === 0) {
            hasMore = false
          }

          offset = offset + SIZE

          const checkEmailStatus = (emailStatus) =>
            emailStatus !== 'EMPTY' && emailStatus !== 'NOT_DEFINED'

          if (userProfiles.length > 0) {
            await queryInterface.bulkInsert(
              'emails',
              userProfiles
                .map((profile) =>
                  checkEmailStatus(profile.email_status)
                    ? {
                        id: uuid(),
                        national_id: profile.national_id,
                        email: profile.email,
                        email_status: profile.email_status,
                        primary: true,
                        created: new Date(),
                        modified: new Date(),
                      }
                    : null,
                )
                .filter((item) => item !== null),
              { transaction },
            )
          }
        }
      })
    } catch (error) {
      console.error('Error migrating email data:', error)
      throw error
    }
  },

  async down() {
    // This migration is irreversible
    return Promise.resolve()
  },
}
