'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'application',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          external_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          university_id: {
            type: Sequelize.UUID,
            references: {
              model: 'university',
              key: 'id',
            },
            allowNull: false,
          },
          program_id: {
            type: Sequelize.UUID,
            references: {
              model: 'program',
              key: 'id',
            },
            allowNull: false,
          },
          program_mode_of_delivery_id: {
            type: Sequelize.UUID,
            references: {
              model: 'program_mode_of_delivery',
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
      queryInterface.dropTable('application', { transaction: t }),
    )
  },
}
