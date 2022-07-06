'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'staff',
        'national_id',
        { type: Sequelize.STRING, unique: true, allowNull: false },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'staff',
        'national_id',
        { type: Sequelize.STRING, unique: false, allowNull: false },
        { transaction: t },
      ),
    )
  },
}
