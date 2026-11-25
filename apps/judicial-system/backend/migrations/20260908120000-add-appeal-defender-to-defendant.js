'use strict'

// The defender who appeals a verdict is often not the one who defended the
// case in the district court, and is recorded on the defendant as information
// only: the appeal defender gets no access to the case until the court of
// appeals has confirmed them, which is what the confirmation flag is for.
const columns = [
  ['appeal_defender_name', 'STRING'],
  ['appeal_defender_national_id', 'STRING'],
  ['appeal_defender_email', 'STRING'],
  ['appeal_defender_phone_number', 'STRING'],
  ['is_appeal_defender_confirmed', 'BOOLEAN'],
]

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        columns.map(([name, type]) =>
          queryInterface.addColumn(
            'defendant',
            name,
            { type: Sequelize[type], allowNull: true },
            { transaction: t },
          ),
        ),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        columns.map(([name]) =>
          queryInterface.removeColumn('defendant', name, { transaction: t }),
        ),
      ),
    )
  },
}
