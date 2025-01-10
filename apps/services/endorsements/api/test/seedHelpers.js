const { faker } = require('@faker-js/faker')
const today = new Date()

module.exports = {
  getGenericEndorsementList: (tags) => ({
    id: faker.string.uuid(),
    title: faker.lorem.words(2),
    description: faker.lorem.paragraph(1),
    opened_date: today,
    closed_date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
    admin_lock: false,
    endorsement_meta: '{}', // default empty array in postgres
    endorsement_metadata: '[]', // default empty array in postgres
    tags: tags ?? '{}', // default empty array in postgres
    meta: '{}',
    owner: faker.string.numeric(10),
    created: new Date(),
    modified: new Date(),
  }),

  getGenericEndorsement: () => ({
    id: faker.string.uuid(),
    endorser: faker.string.numeric(10),
    endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
    meta: '{}',
    created: new Date(),
    modified: new Date(),
  }),
}
