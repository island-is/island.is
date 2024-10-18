'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('list_type', [
      {
        id: '436a7bb6-ce1d-42cd-a759-24774df5acff',
        type: 'municipalities',
        name: '{ "is": "Sveitarfélög", "en": "Municipalities" }',
        description:
          '{ "is": "Listi af sveitarfélögum landsins", "en": "List of Icelands municipalities" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '64f1cff8-68c1-457a-9200-5c57f7b187eb',
        type: 'countries',
        name: '{ "is": "Landalisti", "en": "Countries" }',
        description:
          '{ "is": "Listi af löndum heimsins", "en": "List of the countries of the world" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: '3fb52435-4687-4983-9948-052ff193fc20',
        type: 'postalCodes',
        name: '{ "is": "Póstnúmer", "en": "Postal codes" }',
        description:
          '{ "is": "Listi af póstnúmerum landsins", "en": "List of Icelands postal codes" }',
        is_common: true,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'd3ecbba3-68e3-4398-97b1-63bf78f24da6',
        type: 'mastersTrades',
        name: '{ "is": "Iðngreinar meistara", "en": "Masters trades" }',
        description:
          '{ "is": "Listi af iðngreinum meistara", "en": "List of masters trades" }',
        is_common: false,
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'baac7e09-4f19-4455-95f6-9e7f6521267a',
        type: 'registrationCategoriesOfActivities',
        name: '{ "is": "Skráningarflokkar starfsemi", "en": "Registration categories of activities" }',
        description:
          '{ "is": "Skráningarflokkar starfsemi", "en": "Registration categories of activities" }',
        is_common: false,
        created: new Date(),
        modified: new Date(),
      },
    ])
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('list_type', null, {})
  },
}
