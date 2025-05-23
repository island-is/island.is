'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn('client', 'sso', {
          type: Sequelize.ENUM('enabled', 'disabled'),
          defaultValue: 'disabled',
          allowNull: false,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'UPDATE "client" SET sso = \'enabled\';',
            { transaction: t },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('client', 'sso', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_client_sso";',
            { transaction: t },
          ),
        ),
    )
  },
}
