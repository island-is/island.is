'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.changeColumn(
        'indictment_count',
        'substances',
        {
          type: Sequelize.JSON,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.changeColumn(
        'indictment_count',
        'substances',
        {
          type: Sequelize.JSONB,
          allowNull: true,
        },
        { transaction },
      ),
    )
  },
}
