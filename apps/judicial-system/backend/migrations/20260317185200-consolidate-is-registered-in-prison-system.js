'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `UPDATE defendant
           SET is_registered_in_prison_system = "case".is_registered_in_prison_system
           FROM "case"
           WHERE defendant.case_id = "case".id
             AND defendant.is_registered_in_prison_system IS NULL
             AND "case".is_registered_in_prison_system IS NOT NULL`,
          { transaction: t },
        )
        .then(() =>
          queryInterface.removeColumn(
            'case',
            'is_registered_in_prison_system',
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case',
        'is_registered_in_prison_system',
        {
          type: Sequelize.BOOLEAN,
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },
}
