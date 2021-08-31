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

    //const fakeNationalIds = [
    //  '0101302129', // Gervimaður Noregur
    //  '0101302209', // Gervimaður Finnland
    //  '0101302399', // Gervimaður Færeyjar
    //  '0101302479', // Gervimaður Danmörk
    //  '0101302559', // Gervimaður Svíþjóð
    //  '0101302639', // Gervimaður Grænland
    //  '0101302719', // Gervimaður Evrópa
    //  '0101302989', // Gervimaður Ameríka
    //  '0101303019', // Gervimaður Afríka
    //  '0101303369', // Gervimaður Asía
    //]

    const fakeNationalIds = [
      "0101300189",
      "0101300269",
      "0101300349",
      "0101300429",
      "0101300509",
      "0101300699",
      "0101300779",
      "0101300859",
      "0101300939",
      "0101301079",
      "0101301159",
      "0101301239",
      "0101301319",
      "0101301589",
      "0101301669",
      "0101301749",
      "0101301829",
      "0101301909",
      "0101302049",
      "0101302129",
      "0101302209",
      "0101302399",
      "0101302479",
      "0101302559",
      "0101302639",
      "0101302719",
      "0101302989",
      "0101303019",
      "0101303289",
      "0101303369",
      "0101303449",
      "0101303529",
      "0101303609",
      "0101303799",
      "0101303879",
      "0101303959",
      "0101304099",
      "0101304179",
      "0101304259",
      "0101304339",
      "0101304419",
      "0101304689",
      "0101304769",
      "0101304849",
      "0101304929",
      "0101305069",
      "0101305149",
      "0101305229",
      "0101305309",
      "0101305499",
      "0101305579",
      "0101305659",
      "0101305739",
      "0101305819",
      "0101306039",
      "0101306119",
      "0101306389",
      "0101306469",
      "0101306549",
      "0101306629",
      "0101306709",
      "0101306899",
      "0101306979",
      "0101307009",
      "0101307199",
      "0101307279",
      "0101307359",
      "0101307439",
      "0101307519",
      "0101307789",
      "0101307869",
      "0101307949",
      "0101308089",
      "0101308169",
      "0101308249",
      "0101308329",
      "0101308409",
      "0101308599",
      "0101308679",
      "0101308759",
      "0101308839",
      "0101308919",
      "0101309059",
      "0101309139",
      "0101309219",
      "0101309489",
      "0101309569",
      "0101309649",
      "0101309729",
      "0101309809",
      "0101309999"
      ]


    const endorsementLists = [
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00df00d',
        title: 'Steini endorsement list',
        description: 'Endorsement list steini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2605923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00df00df00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00da00d',
        title: 'Steini endorsement list',
        description: 'Endorsement list steini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2605923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00df00da00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00db00d',
        title: 'Steini endorsement list',
        description: 'Endorsement list steini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2605923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00df00db00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-b00df00db00d',
        title: 'Steini endorsement list',
        description: 'Endorsement list steini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2505923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-b00df00db00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-a00df00db00d',
        title: 'Stoni endorsement list',
        description: 'Endorsement list stoni',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2505923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-a00df00db00d',
        }),
        created: new Date(),
        modified: new Date(),
      },

      {
        id: 'f00df00d-f00d-400d-a00d-c00df00db00d',
        title: 'Stoini endorsement list',
        description: 'Endorsement list stoini',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021', 'partyLetter2021'],
        owner: '2205923199',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-c00df00db00d',
        }),
        created: new Date(),
        modified: new Date(),
      },

    ]

    await queryInterface.bulkInsert('endorsement_list', endorsementLists)

    const endorsements = []

    for(const nid in fakeNationalIds) {
      let eli = 'f';

      if(nid > 30 && nid < 61) {
        eli = 'a'
      }

      if(nid >= 61) {
        eli = 'b'
      }

      endorsements.push({
        id: faker.random.uuid(),
        endorser: fakeNationalIds[nid],
        endorsement_list_id: `f00df00d-f00d-400d-a00d-f00df00d${eli}00d`,
        meta: JSON.stringify({
          fullName: `Gervimaður ${nid}`,
          address: {
            city: faker.fake('{{address.city}}'), 
            postalCode: 600,
            streetAddress: faker.fake('{{address.streetName}} {{address.streetSuffix}}')
          }
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
