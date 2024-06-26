'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'case_file',
          'category',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE "enum_case_file_category"',
            {
              transaction,
            },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.changeColumn(
        'case_file',
        'category',
        {
          type: Sequelize.ENUM(
            'COURT_RECORD',
            'RULING',
            'COVER_LETTER',
            'INDICTMENT',
            'CRIMINAL_RECORD',
            'COST_BREAKDOWN',
            'CASE_FILE',
            'PROSECUTOR_APPEAL_BRIEF',
            'DEFENDANT_APPEAL_BRIEF',
            'PROSECUTOR_APPEAL_BRIEF_CASE_FILE',
            'DEFENDANT_APPEAL_BRIEF_CASE_FILE',
            'PROSECUTOR_APPEAL_STATEMENT',
            'DEFENDANT_APPEAL_STATEMENT',
            'PROSECUTOR_APPEAL_STATEMENT_CASE_FILE',
            'DEFENDANT_APPEAL_STATEMENT_CASE_FILE',
            'PROSECUTOR_APPEAL_CASE_FILE',
            'DEFENDANT_APPEAL_CASE_FILE',
            'APPEAL_COURT_RECORD',
            'APPEAL_RULING',
            'CRIMINAL_RECORD_UPDATE',
          ),
          allowNull: true,
        },
        { transaction },
      ),
    )
  },
}
