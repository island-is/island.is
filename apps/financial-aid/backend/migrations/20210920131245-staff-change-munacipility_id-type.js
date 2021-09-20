'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'staff',
          'municipalityId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'staff',
          'municipalityId',
          'municipality_id',
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.changeColumn(
          'staff',
          'municipality_id',
          {
            type: Sequelize.UUID,
          },
          { transaction: t },
        ),
        queryInterface.renameColumn(
          'staff',
          'municipality_id',
          'municipalityId',
          { transaction: t },
        ),
      ]),
    )
  },
}
