'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_field_type', [
      {
        id: 'b12e940e-1bd6-4180-a6eb-f620dce4e71c',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        field_type_id: '49599a07-4d06-4ad4-9927-b55eab2dd97d', // nationaIdEstate
      },
      {
        id: '298bdf4f-6340-46c0-b403-59ec4ae3c19b',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        field_type_id: 'ad67a9c3-f5d9-47eb-bcf9-dd34becf4b76', // nationalIdAll
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_field_type', null, {})
  },
}
