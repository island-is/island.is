'use strict'

const yesterday = 86400000

const shared = {
  created: new Date(),
  modified: new Date(),
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'IcelandicNames',
      [
        {
          name: 'Jón',
          type: 'DR',
          visible: 1,
          ...shared,
        },
        {
          name: 'Magnús',
          type: 'DR',
          visible: 1,
          ...shared,
        },
        {
          name: 'Pétur',
          type: 'DR',
          visible: 1,
          ...shared,
        },
        {
          name: 'Satan',
          type: 'MI',
          status: 'Haf',
          visible: 1,
          verdict_date: new Date(Date.now() - yesterday * 2),
          ...shared,
        },
        {
          name: 'Kristín',
          type: 'ST',
          visible: 1,
          ...shared,
        },
        {
          name: 'Alpine',
          type: 'MI',
          status: 'Haf',
          verdict_date: new Date(Date.now() - yesterday * 8),
          visible: 1,
          ...shared,
        },
        {
          name: 'Alaía',
          type: 'ST',
          status: 'Sam',
          visible: 1,
          verdict_date: new Date(Date.now() - yesterday * 11),
          ...shared,
        },
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('IcelandicNames', null, {})
  },
}
