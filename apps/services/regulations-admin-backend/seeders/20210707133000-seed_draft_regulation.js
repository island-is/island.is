/* eslint-disable local-rules/disallow-kennitalas */
'use strict'

const TEST_USERS = {
  utlond: '0101307789',
  afrika: '0101303019',
  amerika: '0101302989',
}

const draftRegulationSeed = [
  {
    id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
    drafting_status: 'draft',
    name: '1234-1234',
    title: 'Reglugerð um x',
    text: '<p>Lorem ipsum dolor</p>',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry_id: 'fsr',
    signature_date: '2021-08-08',
    effective_date: '2021-08-08',
    type: 'base',
    authors: [TEST_USERS.utlond, TEST_USERS.afrika],
    law_chapters: ['01', '02a'],
  },
  {
    id: '32e191a3-497c-46e4-ae10-8ba579f07f28',
    drafting_status: 'draft',
    name: '4567-6547',
    title: 'Reglugerð um xyz',
    text: '<p>Lorem ipsum dolor foo</p>',
    drafting_notes: '',
    ideal_publish_date: '2021-08-09',
    ministry_id: 'fsr',
    signature_date: '2021-08-09',
    effective_date: '2021-08-09',
    type: 'base',
    authors: [TEST_USERS.amerika],
    law_chapters: ['01a'],
  },
  {
    id: 'b99f6276-68ff-4ac7-a9f4-b42d522922e8',
    drafting_status: 'shipped',
    name: '4567-6547',
    title: 'Reglugerð um zyx',
    text: '<p>Lorem ipsum dolor foo</p>',
    drafting_notes: '',
    ideal_publish_date: '2021-09-09',
    ministry_id: 'fsr',
    signature_date: '2021-09-09',
    effective_date: '2021-09-09',
    type: 'base',
    authors: [TEST_USERS.afrika],
    law_chapters: ['04', '05c'],
  },
  {
    id: 'a0bdbe60-2aa3-4036-80d1-8a3d448312d1',
    drafting_status: 'proposal',
    name: '4321-4321',
    title: 'Breytingareglugerð um y',
    text: '<p>Lorem ipsum dolor</p>',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry_id: 'avnsr',
    signature_date: '2021-08-08',
    effective_date: '2021-08-08',
    type: 'amending',
    authors: ['0101302989'],
    law_chapters: ['01', '02'],
  },
  {
    id: '0cb3a68b-f368-4d01-a594-ba73e0dc396d',
    drafting_status: 'draft',
    name: '3241-2314',
    title: 'Breytingareglugerð um z',
    text: '<p>Lorem ipsum dolor</p>',
    drafting_notes: '',
    ideal_publish_date: '2021-08-08',
    ministry_id: 'ssvr',
    signature_date: '2021-08-08',
    effective_date: '2021-08-08',
    type: 'amending',
    authors: [TEST_USERS.afrika],
    law_chapters: ['02'],
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_regulation',
      draftRegulationSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_regulation', null, {})
  },
}
