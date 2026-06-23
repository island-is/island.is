'use strict'

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'user',
        'can_manage_message_suspension',
        {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
        },
        { transaction },
      ),
    ),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('user', 'can_manage_message_suspension', {
        transaction,
      }),
    ),
}
