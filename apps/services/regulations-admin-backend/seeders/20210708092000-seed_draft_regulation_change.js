'use strict'

const draftRegulationChangeSeed = [
  {
    id: 'd6d5f717-b363-47cf-a09c-a18dd574b65c',
    changing_id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
    regulation: '1146/2010',
    date: '2021-08-09',
    title: 'Reglugerð um vörslu og nýtingu lífsýna í lífsýnasöfnum.',
    text: '<p>Lorem ipsum dolor sit amet</p>',
    comments: '<p>Lorem ipsum dolor sit amet</p>',
  },
  {
    id: '1464cb70-570e-4ab5-93ef-3107a5e82515',
    changing_id: 'a1fd62db-18a6-4741-88eb-a7b7a7e05833',
    regulation: '1165/2015',
    date: '2021-08-10',
    title:
      'Reglugerð um gildistöku reglugerða framkvæmdastjórnarinnar (ESB) um ríkisaðstoð.',
    text: '<p>Lorem ipsum dolor sit amet 2</p>',
  },
]

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(
      'draft_regulation_change',
      draftRegulationChangeSeed,
      {},
    )
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete('draft_regulation_change', null, {})
  },
}
