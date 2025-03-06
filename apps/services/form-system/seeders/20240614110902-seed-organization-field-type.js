module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_field_type', [
      {
        id: 'b12e940e-1bd6-4180-a6eb-f620dce4e71c',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        field_type_id: 'NATIONAL_ID_ESTATE',
      },
      {
        id: '298bdf4f-6340-46c0-b403-59ec4ae3c19b',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // 65° ARTIC ehf.
        field_type_id: 'NATIONAL_ID_ALL',
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_field_type', null, {})
  },
}
