module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organization_list_type', [
      {
        id: 'b5d773d2-d27f-45eb-ab39-05ede05b15af',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        list_type_id: '7bfc3703-af37-455b-b9a1-8b612f46184b', // mastersTrades
      },
      {
        id: '9e8a3d8c-b6fb-4b68-b050-0f46badfe863',
        created: new Date(),
        modified: new Date(),
        organization_id: 'a4b0db68-e169-416a-8ad9-e46b73ce2d39', // Sandbox Ísland ehf.
        list_type_id: 'f50779b3-464c-42e3-9cc3-8914886f9bf7', // registrationCategoriesOfActivities
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organization_list_type', null, {})
  },
}
