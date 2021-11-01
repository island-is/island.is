'use strict'
const faker = require('faker')
const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../test/seedHelpers')
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const fakePeople = [
      '0101302399',
      '0101307789',
      '0101302209',
      '0101302479',
      '0101304339',
      '0101304929',
      '0101303019',
      '0101302559',
      '0101302719',
      '0101303369',
      '0101302639',
      '0101305069',
      '0101302989',
      '0101302129',
    ]

    const endorsementLists = [
      {
        ...getGenericEndorsementList(),
        endorsement_meta: ['fullName', 'address'],
        endorsement_metadata: JSON.stringify([
          { field: 'fullName' },
          { field: 'address', keepUpToDate: true },
          { field: 'voterRegion', keepUpToDate: true },
        ]),
        tags: ['generalPetition'],
        validation_rules: JSON.stringify([]),
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'someId',
        }),
      },
      // lets add some random lists
      ...Array(30)
        .fill()
        .map(() => getGenericEndorsementList(['generalPetition'])),
    ]

    await queryInterface.bulkInsert('endorsement_list', endorsementLists)

    const endorsementIds = [
      endorsementLists[0].id,
      endorsementLists[1].id,
      endorsementLists[2].id,
      endorsementLists[3].id,
    ]

    const endorsements = [
      ...fakePeople.map((fakeNationalId) => ({
        ...getGenericEndorsement(),
        endorsement_list_id: faker.random.arrayElement(endorsementIds),
        endorser: fakeNationalId,
        meta: JSON.stringify({
          fullName: faker.fake('{{name.firstName}} {{name.lastName}}'),
          address: {
            city: faker.random.words(2),
            postalCode: faker.phone.phoneNumber('###'),
            streetAddress: `${faker.random.word()} ${faker.phone.phoneNumber(
              '##',
            )}`,
          },
          signedTags: [],
          bulkEndorsement: faker.datatype.boolean(),
          showName: true,
          voterRegion: {
            voterRegionNumber: faker.phone.phoneNumber('#'),
            voterRegionName: faker.random.word(),
          },
        }),
      })),
    ]

    await queryInterface.bulkInsert('endorsement', endorsements)
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.bulkDelete('endorsement'),
      queryInterface.bulkDelete('endorsement_list'),
    ])
  },
}
