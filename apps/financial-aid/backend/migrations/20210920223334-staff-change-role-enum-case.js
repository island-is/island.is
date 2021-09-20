'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
    Promise.all([
      queryInterface.removeColumn(
        'staff',
        'role',
        { transaction: t },
      ),
      queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_staff_role";', { transaction: t },),
      queryInterface.addColumn(
        'staff',
        'role',
        {
          type: Sequelize.ENUM('Employee','Admin'),
          allowNull: false
        },
        {transaction: t}
      ),
    ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'staff',
          'role',
          { transaction: t },
        ),
        queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_staff_role";', { transaction: t },),
        queryInterface.addColumn(
          'staff',
          'role',
          {
            type: Sequelize.ENUM('employee','admin'),
            allowNull: false
          },
          { transaction: t }
        ),
      ]),
    )
  }
};
