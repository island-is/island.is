'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'form_applicant',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          applicant_type: {
            type: Sequelize.ENUM(
              'individual',
              'individualWithDelegationFromIndividual',
              'individualWithDelegationFromLegalEntity',
              'individualWithProcuration',
              'individualGivingDelegation',
              'legalEntity',
            ),
            allowNull: false,
            defaultValue: 'individual',
          },
          form_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'form',
              key: 'id',
            },
          },
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('form_applicant', { transaction: t }),
    )
  },
}
