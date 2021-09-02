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

    const moreFakeNationalIds = [
      "0101290019",
      "0101290289",
      "0101290369",
      "0101290449",
      "0101290529",
      "0101290609",
      "0101290799",
      "0101290879",
      "0101290959",
      "0101291099",
      "0101291179",
      "0101291259",
      "0101291339",
      "0101291419",
      "0101291689",
      "0101291769",
      "0101291849",
      "0101291929",
      "0101292069",
      "0101292149",
      "0101292229",
      "0101292309",
      "0101292499",
      "0101292579",
      "0101292659",
      "0101292739",
      "0101292819",
      "0101293039",
      "0101293119",
      "0101293389",
      "0101293469",
      "0101293549",
      "0101293629",
      "0101293709",
      "0101293899",
      "0101293979",
      "0101294009",
      "0101294199",
      "0101294279",
      "0101294359",
      "0101294439",
      "0101294519",
      "0101294789",
      "0101294869",
      "0101294949",
      "0101295089",
      "0101295169",
      "0101295249",
      "0101295329",
      "0101295409",
      "0101295599",
      "0101295679",
      "0101295759",
      "0101295839",
      "0101295919",
      "0101296059",
      "0101296139",
      "0101296219",
      "0101296489",
      "0101296569",
      "0101296649",
      "0101296729",
      "0101296809",
      "0101296999",
      "0101297029",
      "0101297109",
      "0101297299",
      "0101297379",
      "0101297459",
      "0101297539",
      "0101297619",
      "0101297889",
      "0101297969",
      "0101298189",
      "0101298269",
      "0101298349",
      "0101298429",
      "0101298509",
      "0101298699",
      "0101298779",
      "0101298859",
      "0101298939",
      "0101299079",
      "0101299159",
      "0101299239",
      "0101299319",
      "0101299589",
      "0101299669",
      "0101299749",
      "0101299829",
      "0101299909"
    ]


    const endorsementLists = [
      {
        id: 'f00df00d-f00d-400d-a00d-f00db00df00d',
        title: 'Steinaflokkur',
        description: 'S',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordvesturkjordaemi2021'],
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00db00df00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00db00da00d',
        title: 'Steinaflokkur',
        description: 'S',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordvesturkjordaemi2021'],
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00db00da00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00db00db00d',
        title: 'Steinaflokkur',
        description: 'S',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordvesturkjordaemi2021'],
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00db00db00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00df00d',
        title: 'Donni list',
        description: 'D',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021'],
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00df00df00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00da00d',
        title: 'Donni list',
        description: 'D',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021'],
        owner: '0101302399',
        meta: JSON.stringify({
          applicationId: 'f00df00d-f00d-400d-a00d-f00df00da00d',
        }),
        created: new Date(),
        modified: new Date(),
      },
      {
        id: 'f00df00d-f00d-400d-a00d-f00df00db00d',
        title: 'Donni list',
        description: 'D',
        closed_date: null,
        endorsement_meta: ['fullName', 'address'],
        tags: ['partyApplicationNordausturkjordaemi2021'],
        owner: '0101302399',
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
        owner: '0101307789',
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
        owner: '0101307789',
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
        owner: '0101302209',
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

      if(nid > 20 && nid < 71) {
        eli = 'a'
      }

      if(nid >= 71) {
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

    for(const nid in moreFakeNationalIds) {
      let eli = 'f';

      if(nid > 5 && nid < 61) {
        eli = 'a'
      }

      if(nid >= 61) {
        eli = 'b'
      }

      endorsements.push({
        id: faker.random.uuid(),
        endorser: moreFakeNationalIds[nid],
        endorsement_list_id: `f00df00d-f00d-400d-a00d-f00db00d${eli}00d`,
        meta: JSON.stringify({
          fullName: `Hervimaður ${nid}`,
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
