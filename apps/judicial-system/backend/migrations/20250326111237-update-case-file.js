'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case_file',
          'hashAlgorithm',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ]).then(() =>
        queryInterface.sequelize.query(
          `
          UPDATE "case_file"
          SET "hashAlgorithm" = 'MD5' 
          WHERE "hash" is not null
          `,
          { transaction: t },
        ),
      ),
    )
  },
  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.removeColumn('case_file', 'hashAlgorithm', {
        transaction: t,
      }),
    )
  },
}
