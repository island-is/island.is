'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'case_file',
        { category: 'CASE_FILE_RECORD' },
        {
          category: 'CASE_FILE',
          police_case_number: { [Sequelize.Op.ne]: null },
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'case_file',
        { category: 'CASE_FILE' },
        { category: 'CASE_FILE_RECORD' },
        { transaction },
      ),
    )
  },
}
