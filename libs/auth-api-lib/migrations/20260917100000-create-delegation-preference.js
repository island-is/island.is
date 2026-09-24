'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'delegation_preference',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          // The actor — the person who holds the delegation and does the
          // switching. Not a foreign key: procuration comes from RSK and legal
          // guardianship from the national registry, so most delegations a
          // person can star have no row in the delegation table to point at.
          to_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          from_national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          is_favourite: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          // Null until the actor has actually switched to this party.
          last_used_at: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.addConstraint('delegation_preference', {
        fields: ['to_national_id', 'from_national_id'],
        type: 'unique',
        name: 'delegation_preference_to_from_unique',
        transaction,
      })

      // The only read pattern: everything this actor has starred or used.
      await queryInterface.addIndex('delegation_preference', {
        fields: ['to_national_id'],
        name: 'delegation_preference_to_national_id',
        transaction,
      })
    })
  },

  async down(queryInterface) {
    return await queryInterface.dropTable('delegation_preference')
  },
}
