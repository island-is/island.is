'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn('delegation', 'reference_id', {
        type: Sequelize.STRING,
        allowNull: true,
      }),

      queryInterface.sequelize.query(`
        CREATE UNIQUE INDEX unique_reference_id_not_null
        ON delegation(reference_id)
        WHERE reference_id IS NOT NULL;
      `),
    ])
  },

  async down(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.removeColumn('delegation', 'reference_id'),
      queryInterface.sequelize.query(`
        DROP INDEX IF EXISTS unique_reference_id_not_null;
      `),
    ])
  },
}
