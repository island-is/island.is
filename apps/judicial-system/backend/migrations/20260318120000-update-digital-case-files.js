'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addConstraint('police_digital_case_file', {
        fields: ['case_id', 'police_digital_file_id'],
        type: 'unique',
        name: 'unique_police_digital_case_file_case_id_police_digital_file_id',
        transaction,
      }),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeConstraint(
        'police_digital_case_file',
        'unique_police_digital_case_file_case_id_police_digital_file_id',
        { transaction },
      ),
    )
  },
}
