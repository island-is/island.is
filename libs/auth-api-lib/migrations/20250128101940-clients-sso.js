'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.addColumn('client', 'sso', {
      type: Sequelize.ENUM('enabled', 'disabled'),
      allowNull: false,
      defaultValue: 'disabled',
    })
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('client', 'sso', { transaction: t },)
      .then(() =>
        queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_client_sso";', { transaction: t })
      )
    )
  }
};
