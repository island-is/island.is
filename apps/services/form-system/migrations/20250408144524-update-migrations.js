'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('20240614092719-create-organization-field-type.js');
    await queryInterface.dropTable('20240614142442-create-organization-certification-type.js');
    await queryInterface.dropTable('20240614142442-create-organization-list-type.js');

    await queryInterface.addColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'organization_national_id');
  }
};