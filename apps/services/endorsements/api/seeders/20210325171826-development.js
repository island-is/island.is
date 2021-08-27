'use strict'
const faker = require('faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const endorsementIds = [
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c3',
      '9c0b4106-4213-43be-a6b2-ff324f4ba0c4',
    ]

    const fakeNationalIds = [
      '0101302129', // Gervimaður Noregur
      '0101302209', // Gervimaður Finnland
      '0101302399', // Gervimaður Færeyjar
      '0101302479', // Gervimaður Danmörk
      '0101302559', // Gervimaður Svíþjóð
      '0101302639', // Gervimaður Grænland
      '0101302719', // Gervimaður Evrópa
      '0101302989', // Gervimaður Ameríka
      '0101303019', // Gervimaður Afríka
      '0101303369', // Gervimaður Asía
    ]

    const endorsementLists = [
      {
        id: 'f00df00d-f00d-f00d-f00d-f00df00df00d',
        title: 'Steini endorsement list',
        description: 'Endorsement list steini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15T00:00:00Z',
              age: 18,
            },
          },
        ]),
        owner: '2605923199',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[0],
        title: faker.lorem.words(2),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationSudurkjordaemi2021', 'partyLetter2021'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15T00:00:00Z',
              age: 18,
            },
          },
        ]),
        owner: '1111111111',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[1],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        endorsement_meta: ['fullName'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15T00:00:00Z',
              age: 18,
            },
          },
        ]),
        owner: '1111111111',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[2],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: new Date(),
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        endorsement_meta: ['fullName', 'address'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15T00:00:00Z',
              age: 18,
            },
          },
          {
            type: 'minAge',
            value: {
              age: 18,
            },
          },
          {
            type: 'uniqueWithinTags',
            value: {
              tags: ['partyLetter2021'],
            },
          },
        ]),
        owner: '1111111111',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: endorsementIds[3],
        title: faker.lorem.words(3),
        description: faker.lorem.paragraph(1),
        closed_date: null,
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        endorsement_meta: ['fullName', 'address'],
        validation_rules: JSON.stringify([
          {
            type: 'minAgeAtDate',
            value: {
              date: '2021-04-15T00:00:00Z',
              age: 18,
            },
          },
          {
            type: 'minAge',
            value: {
              age: 18,
            },
          },
          {
            type: 'uniqueWithinTags',
            value: {
              tags: ['partyLetter2021'],
            },
          },
        ]),
        owner: '1111111111',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
        created: new Date(),
        modified: new Date(),
      },
    ]

    await queryInterface.bulkInsert('endorsement_list', endorsementLists)

    const endorsements = new Array(10).fill().map(() => ({
      id: faker.random.uuid(),
      endorser: faker.phone.phoneNumber('##########'),
      endorsement_list_id: faker.random.arrayElement(endorsementIds),
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    }))
    endorsements.push({
      id: faker.random.uuid(),
      endorser: '0000000000',
      endorsement_list_id: endorsementIds[0],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })
    endorsements.push({
      id: faker.random.uuid(),
      endorser: '0000000000',
      endorsement_list_id: endorsementIds[1],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })
    endorsements.push({
      id: faker.random.uuid(),
      endorser: '0000000000',
      endorsement_list_id: endorsementIds[2],
      meta: JSON.stringify({
        fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
      }),
      created: new Date(),
      modified: new Date(),
    })

    for(const nid of fakeNationalIds) {
      endorsements.push({
        id: faker.random.uuid(),
        endorser: nid,
        endorsement_list_id: 'f00d-f00d',
        meta: JSON.stringify({
          fullName: faker.fake('{{name.firstName}} {{name.firstName}}'),
        }),
        created: new Date(),
        modified: new Date(),
      })
    }

    await queryInterface.bulkInsert('endorsement', endorsements)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('endorsement'),
      queryInterface.bulkDelete('endorsement_list'),
    ])
  },
}
