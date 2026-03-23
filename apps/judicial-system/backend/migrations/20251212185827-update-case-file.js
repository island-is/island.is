'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'case_file',
          'is_key_accessible',
          { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
          { transaction },
        )
        .then(() =>
          queryInterface.bulkUpdate(
            'case_file',
            { key: 'missing', is_key_accessible: false },
            { [Sequelize.Op.or]: [{ key: null }, { key: '' }] },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.changeColumn(
            'case_file',
            'key',
            { type: Sequelize.STRING, allowNull: false },
            { transaction },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .changeColumn(
          'case_file',
          'key',
          { type: Sequelize.STRING, allowNull: true },
          { transaction },
        )
        .then(() =>
          queryInterface.bulkUpdate(
            'case_file',
            { key: null },
            { is_key_accessible: false },
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.removeColumn('case_file', 'is_key_accessible', {
            transaction,
          }),
        ),
    )
  },
}
