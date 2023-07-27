'use strict'

const draftRegulationCancelSeed = [
  {
    id: 'ea8de3d8-06d1-4dee-98dc-c9d5e9fefc13',
    changing_id: '32e191a3-497c-46e4-ae10-8ba579f07f28',
    regulation: '0111/2020',
    date: '2021-08-10',
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_regulation_cancel',
      draftRegulationCancelSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_regulation_cancel', null, {})
  },
}
