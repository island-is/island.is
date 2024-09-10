'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'applicant_type_name_suggestion',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name_suggestion: {
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
          organization_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'organization',
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
      queryInterface.dropTable('applicant_type_name_suggestion', {
        transaction: t,
      }),
    )
  },
}
