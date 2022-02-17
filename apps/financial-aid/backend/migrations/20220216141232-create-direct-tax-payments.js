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
          totalSalary: {
            type: Sequelize.INTEGER,
          },
          payerNationalId: {
            type: Sequelize.INTEGER,
          },
          personalAllowance: {
            type: Sequelize.INTEGER,
          },
          withheldAtSource: {
            type: Sequelize.INTEGER,
          },
          month: {
            type: Sequelize.INTEGER,
          },
          userType: {
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
