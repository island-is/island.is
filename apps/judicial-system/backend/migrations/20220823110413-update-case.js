'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.sequelize
        .query(
          // Change police_case_number to an array
          `alter table "case" alter column police_case_number type varchar(255)[] using array[police_case_number]`,
          { transaction },
        )
        .then(() =>
          queryInterface.renameColumn(
            'case',
            'police_case_number',
            'police_case_numbers',
            { transaction },
          ),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .renameColumn('case', 'police_case_numbers', 'police_case_number', {
          transaction,
        })
        .then(() =>
          queryInterface.sequelize.query(
            // Change police_case_number column to a string and fill with first value in array for every row
            `alter table "case" alter column police_case_number type varchar(255) using coalesce(police_case_number[1], '')`,
            { transaction },
          ),
        ),
    )
  },
}
