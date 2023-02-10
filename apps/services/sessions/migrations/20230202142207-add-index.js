'use strict'

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addIndex('session', [
        'actor_national_id',
        { attribute: 'timestamp', order: 'DESC' },
      ]),
      queryInterface.addIndex('session', [
        'subject_national_id',
        { attribute: 'timestamp', order: 'DESC' },
      ]),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeIndex('session', ['actor_national_id', 'timestamp']),
      queryInterface.removeIndex('session', [
        'subject_national_id',
        'timestamp',
      ]),
    ])
  },
}
