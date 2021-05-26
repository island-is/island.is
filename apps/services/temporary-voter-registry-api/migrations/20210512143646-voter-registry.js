'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction()

    // try is here to make sure this safely fails if index creation fails
    try {
      await queryInterface.createTable('voter_registry', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
        },
        national_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        region_number: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        region_name: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        version: {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        created: {
          type: Sequelize.DATE,
          allowNull: false,
        },
        modified: {
          type: Sequelize.DATE,
          allowNull: false,
        },
      })
      await queryInterface.addIndex('voter_registry', ['national_id'])
      transaction.commit()
    } catch (err) {
      await transaction.rollback()
      throw err
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('voter_registry')
  },
}
