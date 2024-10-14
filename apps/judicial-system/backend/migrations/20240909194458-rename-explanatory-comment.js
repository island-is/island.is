'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface
        .renameTable('explanatory_comment', 'case_string', {
          transaction,
        })
        .then(() =>
          Promise.all([
            queryInterface.renameColumn(
              'case_string',
              'comment_type',
              'string_type',
              { transaction },
            ),
            queryInterface.renameColumn('case_string', 'comment', 'value', {
              transaction,
            }),
          ]),
        ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface
        .renameTable('case_string', 'explanatory_comment', {
          transaction,
        })
        .then(() =>
          Promise.all([
            queryInterface.renameColumn(
              'explanatory_comment',
              'string_type',
              'comment_type',
              { transaction },
            ),
            queryInterface.renameColumn(
              'explanatory_comment',
              'value',
              'comment',
              { transaction },
            ),
          ]),
        ),
    )
  },
}
