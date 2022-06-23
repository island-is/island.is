'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.addIndex('translation', [
      'language',
      'class_name',
      'key',
    ])
  },

  down: (queryInterface) => {
    return queryInterface.removeIndex('translation', [
      'language',
      'class_name',
      'key',
    ])
  },
}
