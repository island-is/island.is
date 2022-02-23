'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('staff', 'roles', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(
            `DROP TYPE enum_staff_role;
            CREATE TYPE enum_staff_roles AS ENUM ('Employee','Admin','SuperAdmin');
            ALTER TABLE staff ADD COLUMN roles enum_staff_roles[] NOT NULL DEFAULT '{Employee}';`,
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
          queryInterface.sequelize.query(`DROP TYPE enum_staff_roles;`, {
            transaction: t,
          }),
        )
        .then(() =>
          queryInterface.addColumn(
            'staff',
            'roles',
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
