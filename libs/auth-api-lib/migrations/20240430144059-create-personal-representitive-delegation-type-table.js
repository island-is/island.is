'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'personal_representative_delegation_type',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
          },
          personal_representative_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'personal_representative',
              key: 'id',
            },
          },
          delegation_type_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'delegation_type',
              key: 'id',
            },
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

      await queryInterface.addIndex(
        'personal_representative_delegation_type',
        ['personal_representative_id'],
        { transaction },
      )
      await queryInterface.addIndex(
        'personal_representative_delegation_type',
        ['delegation_type_id'],
        { transaction },
      )

      // add foreign key constraints
      await queryInterface.addConstraint(
        'personal_representative_delegation_type',
        {
          fields: ['personal_representative_id'],
          type: 'foreign key',
          name: 'personal_representative_delegation_type_personal_representative_id_fk',
          references: {
            table: 'personal_representative',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction,
        },
      )

      await queryInterface.addConstraint(
        'personal_representative_delegation_type',
        {
          fields: ['delegation_type_id'],
          type: 'foreign key',
          name: 'personal_representative_delegation_type_delegation_type_id_fk',
          references: {
            table: 'delegation_type',
            field: 'id',
          },
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          transaction,
        },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable(
        'personal_representative_delegation_type',
        { transaction },
      )
    })
  },
}
