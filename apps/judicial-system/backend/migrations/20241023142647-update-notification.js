'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'notification',
          'type',
          { type: Sequelize.STRING, allowNull: false },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query('DROP TYPE "enum_notification_type"', {
            transaction,
          }),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.changeColumn(
        'notification',
        'type',
        {
          type: Sequelize.ENUM(
            'HEADS_UP',
            'READY_FOR_COURT',
            'RECEIVED_BY_COURT',
            'COURT_DATE',
            'RULING',
            'MODIFIED',
            'REVOKED',
            'DEFENDER_ASSIGNED',
            'ADVOCATE_ASSIGNED',
            'DEFENDANTS_NOT_UPDATED_AT_COURT',
            'APPEAL_TO_COURT_OF_APPEALS',
            'APPEAL_RECEIVED_BY_COURT',
            'APPEAL_STATEMENT',
            'APPEAL_COMPLETED',
            'APPEAL_JUDGES_ASSIGNED',
            'APPEAL_CASE_FILES_UPDATED',
            'APPEAL_WITHDRAWN',
            'INDICTMENT_DENIED',
            'INDICTMENT_RETURNED',
            'INDICTMENTS_WAITING_FOR_CONFIRMATION',
            'SERVICE_SUCCESSFUL',
            'SERVICE_FAILED',
            'DEFENDANT_SELECTED_DEFENDER',
          ),
          allowNull: false,
        },
        { transaction },
      ),
    )
  },
}
