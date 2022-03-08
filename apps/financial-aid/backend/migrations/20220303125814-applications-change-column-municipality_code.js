'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .bulkUpdate(
          'applications',
          {
            municipality_code: '1400',
          },
          {
            municipality_code: null,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.changeColumn(
            'applications',
            'municipality_code',
            {
              type: Sequelize.STRING,
              allowNull: false,
            },
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.changeColumn(
        'applications',
        'municipality_code',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
