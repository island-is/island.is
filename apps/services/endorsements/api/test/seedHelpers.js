const faker = require('faker')

module.exports = {
  getGenericEndorsementList: () => ({
    id: faker.random.uuid(),
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(1),
    closed_date: null,
    endorsement_meta: '{}', // default empty array in postgres
    endorsement_metadata: '[]', // default empty array in postgres
    tags: '{}', // default empty array in postgres
    validation_rules: '[]',
    meta: '{}',
    owner: faker.phone.phoneNumber('##########'),
    created: new Date(),
    modified: new Date(),
  }),

  getGenericEndorsement: () => ({
    id: faker.random.uuid(),
    endorser: faker.phone.phoneNumber('##########'),
    endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
    meta: '{}',
    created: new Date(),
    modified: new Date(),
  }),
}
