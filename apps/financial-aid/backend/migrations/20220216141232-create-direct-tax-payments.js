'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'direct_tax_payment',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          application_id: {
            type: Sequelize.UUID,
            references: {
              model: 'applications',
              key: 'id',
            },
            allowNull: false,
          },
          total_salary: {
            type: Sequelize.INTEGER,
          },
          payer_national_id: {
            type: Sequelize.STRING,
          },
          personal_allowance: {
            type: Sequelize.INTEGER,
          },
          withheld_at_source: {
            type: Sequelize.INTEGER,
          },
          month: {
            type: Sequelize.INTEGER,
          },
          year: {
            type: Sequelize.INTEGER,
          },
          user_type: {
            type: Sequelize.ENUM('Applicant', 'Spouse'),
            allowNull: false,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('direct_tax_payment', { transaction: t }),
    )
  },
}
