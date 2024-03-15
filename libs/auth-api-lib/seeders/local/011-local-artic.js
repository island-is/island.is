'use strict'

const articDomain = {
  name: '@64artic.is',
  description: '64 Artic domain',
  national_id: '5005101370',
  display_name: '64 Artic',
  organisation_logo_key: 'Stafrænt Ísland',
  contact_email: 'dev-artic@64-artic.is',
}

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('domain', [articDomain], {
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
