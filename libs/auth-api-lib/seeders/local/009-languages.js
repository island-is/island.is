'use strict'

const englishLanguage = [
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

    try {
      await queryInterface.bulkInsert('language', englishLanguage, {
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
