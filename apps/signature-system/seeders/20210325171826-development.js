'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const signatureIds = [
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c3',
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
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
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
        closed_date: null,
        tags: ['nordausturkjordaemi'],
        signature_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
      {
        id: signatureIds[2],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: new Date(),
        tags: ['nordausturkjordaemi'],
        signature_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: '2021-03-15:18',
          },
        ]),
        owner: '1111111111',
        created: new Date(),
        modified: new Date(),
      },
    ]

    await queryInterface.bulkInsert('signature_list', signatureLists)

    const signatures = new Array(10).fill().map(() => ({
      id: faker.random.uuid(),
      signaturee: faker.phone.phoneNumber('##########'),
      signature_list_id: faker.random.arrayElement(signatureIds),
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    }))

    // we want to ensure at least one signature belongs to the first list
    signatures.push({
      id: faker.random.uuid(),
      signaturee: '0000000000',
      signature_list_id: signatureIds[0],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })

    // this signatures is deleted in tests
    signatures.push({
      id: faker.random.uuid(),
      signaturee: '0000000000',
      signature_list_id: signatureIds[1],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })

    await queryInterface.bulkInsert('signature', signatures)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('signature'),
      queryInterface.bulkDelete('signature_list'),
    ])
  },
}
