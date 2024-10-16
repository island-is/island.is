'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'subpoena',
          'acknowledged',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
        .then(
          () =>
            queryInterface.renameColumn(
              'subpoena',
              'acknowledged',
              'service_status',
              { transaction },
            ),

          queryInterface.renameColumn(
            'subpoena',
            'acknowledged_date',
            'service_date',
            { transaction },
          ),

          queryInterface.renameColumn(
            'subpoena',
            'registered_by',
            'served_by',
            { transaction },
          ),

          queryInterface.addColumn(
            'subpoena',
            'defender_national_id',
            {
              type: Sequelize.STRING,
              allowNull: true,
            },
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .renameColumn('subpoena', 'service_status', 'acknowledged', {
          transaction,
        })
        .then(
          () =>
            queryInterface.changeColumn(
              'subpoena',
              'acknowledged',
              {
                type: 'BOOLEAN USING CAST("acknowledged" as BOOLEAN)',
                allowNull: true,
              },
              { transaction },
            ),

          queryInterface.renameColumn(
            'subpoena',
            'service_date',
            'acknowledged_date',
            { transaction },
          ),

          queryInterface.renameColumn(
            'subpoena',
            'served_by',
            'registered_by',
            { transaction },
          ),

          queryInterface.removeColumn('subpoena', 'defender_national_id', {
            transaction,
          }),
        ),
    )
  },
}
