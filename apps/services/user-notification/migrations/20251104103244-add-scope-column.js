'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    // Add scope column as string
    await queryInterface.addColumn('user_notification', 'scope', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    // Set all existing notifications to have the main document scope
    await queryInterface.sequelize.query(`
      UPDATE user_notification
      SET scope = '@island.is/documents'
      WHERE scope IS NULL
    `)

    // Make the column non-nullable after setting values for existing records
    await queryInterface.changeColumn('user_notification', 'scope', {
      type: Sequelize.STRING,
      allowNull: false,
    })
  },

  async down(queryInterface, _Sequelize) {
    await queryInterface.removeColumn('user_notification', 'scope')
  },
}
