'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      // Case files are looked up by key when a file is registered and when a
      // file of a request case is deleted. Not unique: files without a
      // document share a placeholder key, and the files of a split case share
      // theirs with the case they were split from.
      queryInterface.addIndex('case_file', ['key'], {
        name: 'case_file_key_idx',
        transaction,
      }),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeIndex('case_file', 'case_file_key_idx', {
        transaction,
      }),
    )
  },
}
