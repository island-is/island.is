'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('application_files', 'type', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_application_files_type;',
            { transaction: t },
          ),
        )
        .then(() =>
          queryInterface.addColumn(
            'application_files',
            'type',
            {
              type: Sequelize.ENUM(
                'Income',
                'TaxReturn',
                'Other',
                'SpouseFiles',
              ),
              allowNull: false,
              defaultValue: 'Other',
            },
            { transaction: t },
          ),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .changeColumn('application_files', 'type', {
          type: Sequelize.TEXT,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS enum_application_files_type;',
            { transaction: t },
          ),
        ),
    )
  },
}
