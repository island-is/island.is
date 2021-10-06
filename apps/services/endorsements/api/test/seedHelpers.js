const faker = require('faker')
const today = new Date()

module.exports = {
  getGenericEndorsementList: (tags) => ({
    id: faker.random.uuid(),
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(1),
    opened_date: new Date(),
    closed_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    admin_lock: false,
    endorsement_meta: '{}', // default empty array in postgres
    endorsement_metadata: '[]', // default empty array in postgres
    tags: tags ?? '{}', // default empty array in postgres
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
