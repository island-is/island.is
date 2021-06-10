'use strict'

const eBulkSeeds = require('../src/app/modules/endorsement/e2e/bulkCreateEndorsement/seed')
const eCreateSeeds = require('../src/app/modules/endorsement/e2e/createEndorsement/seed')
const eDeleteSeeds = require('../src/app/modules/endorsement/e2e/deleteEndorsement/seed')
const eFindAllSeeds = require('../src/app/modules/endorsement/e2e/findAllEndorsement/seed')
const eFindByUserSeeds = require('../src/app/modules/endorsement/e2e/findByUserEndorsement/seed')

const elFindByTags = require('../src/app/modules/endorsementList/e2e/findByTagsEndorsementList/seed')
const elClose = require('../src/app/modules/endorsementList/e2e/closeEndorsementList/seed')
const elFindEndorsements = require('../src/app/modules/endorsementList/e2e/findEndorsementsEndorsementList/seed')
const elFindOne = require('../src/app/modules/endorsementList/e2e/findOneEndorsementList/seed')
const elOpen = require('../src/app/modules/endorsementList/e2e/openEndorsementList/seed')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const endorsementLists = [
      ...eBulkSeeds.endorsementLists,
      ...eCreateSeeds.endorsementLists,
      ...eDeleteSeeds.endorsementLists,
      ...eFindAllSeeds.endorsementLists,
      ...eFindByUserSeeds.endorsementLists,
      ...elFindByTags.endorsementLists,
      ...elClose.endorsementLists,
      ...elFindEndorsements.endorsementLists,
      ...elFindOne.endorsementLists,
      ...elOpen.endorsementLists,
    ]
    const endorsements = [
      ...eBulkSeeds.endorsements,
      ...eCreateSeeds.endorsements,
      ...eDeleteSeeds.endorsements,
      ...eFindAllSeeds.endorsements,
      ...eFindByUserSeeds.endorsements,
      ...elFindEndorsements.endorsements,
    ]

    await queryInterface.bulkInsert('endorsement_list', endorsementLists)
    await queryInterface.bulkInsert('endorsement', endorsements)
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('endorsement')
    await queryInterface.bulkDelete('endorsement_list')
  },
}
