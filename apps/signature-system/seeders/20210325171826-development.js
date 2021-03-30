'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface) => {
    const signatureIds = [
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
    ]

    const signatureLists = [
      {
        id: signatureIds[0],
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        signature_meta: ['fullName'],
        tags: ['sudurkjordaemi'],
        validation_rules: JSON.stringify([
          {
            type: 'min_age',
            value: '18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: signatureIds[1],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: new Date(),
        tags: ['nordurkjordaemi'],
        signature_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'min_age',
            value: '18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
    ]

    await queryInterface.bulkInsert('signature_list', signatureLists)

    const signatures = new Array(200).fill().map(() => ({
      id: faker.random.uuid(),
      signaturee: faker.phone.phoneNumber('##########'),
      signature_list_id: faker.random.arrayElement(signatureIds),
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    }))

    await queryInterface.bulkInsert('signature', signatures)
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.bulkDelete('signature'),
      queryInterface.bulkDelete('signature_list'),
    ])
  },
}
