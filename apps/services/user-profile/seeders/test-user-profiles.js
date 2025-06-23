'use strict'

const { Op } = require('sequelize')
const { uuid } = require('uuidv4')

const userProfiles = [
  {
    nationalId: '0101301111',
    emailStatus: 'NOT_VERIFIED',
  },
  {
    nationalId: '0101302222',
    emailStatus: 'NOT_DEFINED',
  },
  {
    nationalId: '0101303333',
    emailStatus: 'EMPTY',
  },
  {
    nationalId: '0101304444',
    emailStatus: 'VERIFIED',
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      return queryInterface.bulkInsert(
        'user_profile',
        userProfiles.map(({ nationalId, emailStatus }) => ({
          id: uuid(),
          national_id: nationalId,
          mobile_phone_number: `010${nationalId.slice(4)}`,
          locale: 'en',
          email: emailStatus === 'EMPTY' ? null : `${nationalId}@email.com`,
          email_status: emailStatus,
          created: new Date(),
          modified: new Date(),
        })),
        { transaction },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('user_profile', null, {
      where: {
        national_id: {
          [Op.in]: userProfiles.map(({ nationalId }) => nationalId),
        },
      },
    })
  },
}
