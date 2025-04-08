'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('organization_field_type');
    await queryInterface.dropTable('organization_certification_type');
    await queryInterface.dropTable('organization_list_type');

    await queryInterface.addColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: true, // Initially allow NULL
    });
    await queryInterface.sequelize.query(
      `UPDATE form SET organization_national_id = 'default_value' WHERE organization_national_id IS NULL`
    );
    // Finally, modify the column to make it NOT NULL
    await queryInterface.changeColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'organization_national_id');
  }
};