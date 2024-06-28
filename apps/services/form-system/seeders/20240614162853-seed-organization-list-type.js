'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_list_type', [
      {
        id: 'b5d773d2-d27f-45eb-ab39-05ede05b15af',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        list_type_id: 'd3ecbba3-68e3-4398-97b1-63bf78f24da6', // mastersTrades
      },
      {
        id: '9e8a3d8c-b6fb-4b68-b050-0f46badfe863',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        list_type_id: 'baac7e09-4f19-4455-95f6-9e7f6521267a', // registrationCategoriesOfActivities
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_list_type', null, {})
  },
}
