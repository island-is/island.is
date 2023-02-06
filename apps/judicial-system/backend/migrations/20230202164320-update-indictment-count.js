'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'indictment_count',
          'vehicle_registration_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'indictment_count',
          'incident_description',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'indictment_count',
          'legal_arguments',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn(
          'indictment_count',
          'vehicle_registration_number',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn(
          'indictment_count',
          'incident_description',
          {
            transaction: t,
          },
        ),
        queryInterface.removeColumn('indictment_count', 'legal_arguments', {
          transaction: t,
        }),
      ]),
    )
  },
}
