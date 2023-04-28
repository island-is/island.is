'use strict'

const languages = [
  {
    iso_key: 'en',
    description: 'Enska',
    english_description: 'English',
  },
  {
    iso_key: 'is',
    description: 'Íslenska',
    english_description: 'Icelandic',
  },
]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    await queryInterface.bulkInsert('language', languages, { transaction })

    transaction.commit()
  },

  down: async () => {
    // Do nothing
  },
}
