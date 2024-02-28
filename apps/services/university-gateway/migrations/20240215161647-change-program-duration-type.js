'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'program',
        'duration_in_years',
        {
          type: Sequelize.FLOAT,
        },
        {
          transaction: t,
        },
      ),
    )
  },

  //Down will most likely result in loss of data as we are casting from FLOAT to INTEGER
  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'program',
        'duration_in_years',
        {
          type: Sequelize.INTEGER,
        },
        {
          transaction: t,
        },
      ),
    )
  },
}
