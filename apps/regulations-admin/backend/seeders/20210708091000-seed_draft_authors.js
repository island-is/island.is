'use strict'

const draftAuthorSeed = [
  {
    id: "b2a5eb22-5cb9-4b3a-ace1-fc8de9cd0fcb",
    draft_id: "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    author_id: "0101012020"
  },
  {
    id: "0b52f073-05ff-4bee-be33-39acad3bdbbd",
    draft_id: "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    author_id: "0101012021"
  },
  {
    id: "43f0eeef-c97f-482d-98ce-be8f870ee29f",
    draft_id: "a0bdbe60-2aa3-4036-80d1-8a3d448312d1",
    author_id: "0101012020"
  },
  {
    id: "dfa8ddaf-af35-475a-bc54-797901c5dca3",
    draft_id: "0cb3a68b-f368-4d01-a594-ba73e0dc396d",
    author_id: "0101012021"
  }
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_author',
      draftAuthorSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_author', null, {})
  },
}
