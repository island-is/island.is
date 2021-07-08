'use strict'

const draftLawChapterSeed = [
  {
    id: '700fc3d2-cecd-48f0-a370-80a9ed5a236a',
    draft_id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
    law_chapter_id: '01',
  },
  {
    id: 'bdc4c018-f02b-4381-aa45-73f6513db770',
    draft_id: 'a0bdbe60-2aa3-4036-80d1-8a3d448312d1',
    law_chapter_id: '04d',
  },
  {
    id: 'aff018ff-d69c-4d49-9c7c-b72230b38f52',
    draft_id: '0cb3a68b-f368-4d01-a594-ba73e0dc396d',
    law_chapter_id: '01a',
  },
  {
    id: 'fd8762c2-b401-46b4-9d3e-2bcd1f29eb55',
    draft_id: '32e191a3-497c-46e4-ae10-8ba579f07f28',
    law_chapter_id: '01b',
  },
  {
    id: '25e9915c-5c6c-4623-8595-daf9b16b9fdb',
    draft_id: 'b99f6276-68ff-4ac7-a9f4-b42d522922e8',
    law_chapter_id: '02',
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_law_chapter',
      draftLawChapterSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_law_chapter', null, {})
  },
}
