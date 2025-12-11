'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.removeConstraint(
      'verdict',
      'verdict_defendant_id_key',
    )
  },

  async down(queryInterface) {
    return queryInterface.addConstraint('verdict', {
      fields: ['defendant_id'],
      type: 'unique',
      name: 'verdict_defendant_id_key',
    })
  },
}
