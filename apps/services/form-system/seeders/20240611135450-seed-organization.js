'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization', [
      {
        id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39',
        name: '{ "is": "Sandbox Ísland ehf.", "en": "Sandbox Iceland ehf." }',
        national_id: '5902697199',
        created: new Date(),
        modified: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization', null, {})
  },
}
