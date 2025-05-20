'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.dropTable('organization_field_type')
    await queryInterface.dropTable('organization_certification_type')
    await queryInterface.dropTable('organization_list_type')

    // organizationNationalId
    await queryInterface.addColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: true, // Initially allow NULL
    })
    await queryInterface.sequelize.query(
      `UPDATE form SET organization_national_id = '[APPROPRIATE_DEFAULT]' WHERE organization_national_id IS NULL`,
    )
    // Finally, modify the column to make it NOT NULL
    await queryInterface.changeColumn('form', 'organization_national_id', {
      type: Sequelize.STRING,
      allowNull: false,
    })

    // organizationDisplayName
    await queryInterface.addColumn('form', 'organization_display_name', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    // hasPayment
    await queryInterface.addColumn('form', 'has_payment', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    })

    // slug
    await queryInterface.changeColumn('form', 'slug', {
      type: Sequelize.STRING,
      allowNull: true,
      unique: true,
    })
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('form', 'organization_national_id')
    await queryInterface.removeColumn('form', 'organization_display_name')
    await queryInterface.removeColumn('form', 'has_payment')

    // Revert slug to its original state
    await queryInterface.changeColumn('form', 'slug', {
      type: Sequelize.STRING,
      allowNull: false,
      unique: false,
    })
  },
}
