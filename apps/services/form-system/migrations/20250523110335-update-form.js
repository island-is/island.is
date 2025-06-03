'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // 1. Add a new temporary column with JSON type
    await queryInterface.addColumn('form', 'organization_display_name_json', {
      type: Sequelize.JSON,
      allowNull: true,
    })
    // 2. Copy/cast data from old column to new column (as string JSON)
    await queryInterface.sequelize.query(
      `UPDATE form SET organization_display_name_json = to_jsonb(organization_display_name)`,
    )
    // 3. Remove the old column
    await queryInterface.removeColumn('form', 'organization_display_name')
    // 4. Rename the new column to the original name
    await queryInterface.renameColumn(
      'form',
      'organization_display_name_json',
      'organization_display_name',
    )
  },

  async down(queryInterface, Sequelize) {
    // 1. Add back the old column as STRING
    await queryInterface.addColumn('form', 'organization_display_name_str', {
      type: Sequelize.STRING,
      allowNull: true,
    })
    // 2. Copy data from JSON column to STRING column (as text)
    await queryInterface.sequelize.query(
      `UPDATE form SET organization_display_name_str = organization_display_name::text`,
    )
    // 3. Remove the JSON column
    await queryInterface.removeColumn('form', 'organization_display_name')
    // 4. Rename the string column back to the original name
    await queryInterface.renameColumn(
      'form',
      'organization_display_name_str',
      'organization_display_name',
    )
  },
}
