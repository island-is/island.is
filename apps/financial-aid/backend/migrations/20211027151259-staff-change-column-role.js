'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('staff', 'role', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(
            `DROP TYPE enum_staff_role;
            CREATE TYPE enum_staff_role AS ENUM ('Employee','Admin','SuperAdmin');
            ALTER TABLE staff ADD COLUMN roles enum_staff_role[] NOT NULL DEFAULT '{Employee}';`,
            {
              transaction: t,
            },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('staff', 'roles', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(`DROP TYPE enum_staff_role;`, {
            transaction: t,
          }),
        )
        .then(() =>
          queryInterface.addColumn(
            'staff',
            'role',
            {
              type: Sequelize.ENUM('Admin', 'Employee', 'SuperAdmin'),
              allowNull: false,
              defaultValue: 'Employee',
            },
            { transaction: t },
          ),
        ),
    )
  },
}
