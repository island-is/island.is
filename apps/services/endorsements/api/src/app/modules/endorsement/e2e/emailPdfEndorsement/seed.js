const faker = require('faker')
const authNationalId = '1305775399' // we use gervimaður national id here to pass national id checks
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      id: '7d6c2b91-8d8d-42d0-82f7-cd64ce16d753',
      title: 'titill',
      description: 'lýsingin ..............',
      opened_date: new Date(),
      closed_date: new Date(),
      admin_lock: false,
      endorsement_meta: '{}', // default empty array in postgres
      endorsement_metadata: '[]', // default empty array in postgres
      tags: ['generalPetition'], // default empty array in postgres
      validation_rules: '[]',
      meta: '{}',
      owner: '1305775399', //faker.phone.phoneNumber('##########'),
      created: new Date(),
      modified: new Date(),
    },
  ],
  endorsements: [
    {
      id: faker.datatype.uuid(),
      endorser: '1305775399',
      endorsement_list_id: '7d6c2b91-8d8d-42d0-82f7-cd64ce16d753',
      meta: '{}',
      created: new Date(),
      modified: new Date(),
    },
  ],
}
