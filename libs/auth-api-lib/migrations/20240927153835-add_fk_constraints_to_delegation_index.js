'use strict'

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addConstraint('delegation_index', {
        fields: ['type'],
        type: 'foreign key',
        name: 'FK_delegation_index_delegation_type',
        references: {
          table: 'delegation_type',
          field: 'id',
        },
      }),
      queryInterface.addConstraint('delegation_index', {
        fields: ['provider'],
        type: 'foreign key',
        name: 'FK_delegation_index_delegation_provider',
        references: {
          table: 'delegation_provider',
          field: 'id',
        },
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeConstraint(
        'delegation_index',
        'FK_delegation_index_delegation_type',
      ),
      queryInterface.removeConstraint(
        'delegation_index',
        'FK_delegation_index_delegation_provider',
      ),
    ])
  },
}
