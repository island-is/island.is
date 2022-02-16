/* eslint-disable local-rules/disallow-kennitalas */
'use strict'

const draftAuthorsSeed = [
  {
    id: '94848b81-79ce-436a-bb10-dbb199f27055',
    name: 'Gervimaður útlönd',
    author_id: '0101307789',
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert('draft_author', draftAuthorsSeed, {})
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_author', null, {})
  },
}
