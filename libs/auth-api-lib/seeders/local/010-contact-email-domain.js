'use strict'

const emailDomain = {
  name: '@email.island.is',
  description: '@email.island.is domain',
  national_id: '5005101370',
  display_name: 'Ísland.is email',
  organisation_logo_key: 'Stafrænt Ísland',
  contact_email: 'email@island.is',
}

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('domain', [emailDomain], {
        transaction,
      })
    } catch (err) {
      await transaction.rollback()
      throw err
    }

    transaction.commit()
  },

  down: async () => {
    // Do nothing
  },
}
