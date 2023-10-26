'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'application_status_history',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          application_id: {
            type: Sequelize.UUID,
            references: {
              model: 'application',
              key: 'id',
            },
            allowNull: false,
          },
          status: {
            type: Sequelize.ENUM(
              'IN_REVIEW',
              'IN_PROGRESS',
              'ACCEPTED_BY_UNIVERSITY',
              'ACCEPTED_BY_UNIVERSITY_WITH_CONDITION',
              'ACCEPTED_BY_UNIVERSITY_AND_STUDENT',
              'REJECTED_BY_STUDENT_REASON_CANCELLED',
              'REJECTED_BY_STUDENT_REASON_OTHER_ACCEPTED',
              'REJECTED_BY_UNIVERSITY_REASON_INSUFFICIENT',
              'REJECTED_BY_UNIVERSITY_REASON_NO_AVAILABILITY',
              'CANCELLED_BY_STUDENT',
              'PAYMENT_COMPLETE',
            ),
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
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('application_status_history', {
        transaction: t,
      }),
    )
  },
}
