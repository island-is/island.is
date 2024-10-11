'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface
      .createTable('actor_profile', {
        id: {
          type: Sequelize.UUID,
          primaryKey: true,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        to_national_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        from_national_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        email_notifications: {
          type: Sequelize.BOOLEAN,
          defaultValue: true,
          allowNull: false,
        },
        created: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
        modified: {
          type: 'TIMESTAMP WITH TIME ZONE',
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          allowNull: false,
        },
      })
      .then(() =>
        queryInterface.addConstraint('actor_profile', {
          fields: ['to_national_id', 'from_national_id'],
          type: 'unique',
          name: 'actor_profile_to_from_unique',
        }),
      )
      .then(() => queryInterface.addIndex('actor_profile', ['to_national_id']))
  },

  down: (queryInterface) => {
    return queryInterface.dropTable('actor_profile')
  },
}
