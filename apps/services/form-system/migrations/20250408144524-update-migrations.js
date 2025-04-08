'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('organization_field_type');
    await queryInterface.dropTable('organization_certification_type');
    await queryInterface.dropTable('organization_list_type');

    await queryInterface.addColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'organization_national_id');
  }
};