'use strict'

const adminDomain = {
  name: '@admin.island.is',
  description: '@admin.island.is domain',
  national_id: '5005101370',
  display_name: 'Ísland.is stjórnborð',
  organisation_logo_key: 'Stafrænt Ísland',
}
const arcticDomains = {
  name: '@arctic.island.is',
  description: '@arctic.island.is domain',
  national_id: '5005101370',
  display_name: 'Arctic',
  organisation_logo_key: 'Stafrænt Ísland',
}
const otherDomain = {
  name: '@other.island.is',
  description: '@other.island.is domain',
  national_id: '4703013920',
  display_name: 'Other stjornborð',
  organisation_logo_key: 'Stafrænt Ísland',
}
const domains = [adminDomain, arcticDomains, otherDomain]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert('domain', domains, {
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
