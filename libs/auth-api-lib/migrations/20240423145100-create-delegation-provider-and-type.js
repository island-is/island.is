'use strict'

const providers = [
  {
    id: 'thjodskra',
    name: 'Þjóðskrá',
    description: 'Provider for national registry',
  },
  {
    id: 'fyrirtaekjaskra',
    name: 'Fyrirtækjaskrá',
    description: 'Provider for company representatives',
  },
  {
    id: 'talsmannagrunnur',
    name: 'Talsmannagrunnur',
    description: 'Provider for personal representatives',
  },
  {
    id: 'delegationdb',
    name: 'Custom',
    description: 'Provider for custom delegations',
  },
]

const types = [
  {
    id: 'Custom',
    name: 'Custom',
    description: 'Custom delegation type',
    provider: 'delegationdb',
  },
  {
    id: 'LegalGuardian',
    name: 'Legal Guardian',
    description: 'Legal guardian delegation type',
    provider: 'thjodskra',
  },
  {
    id: 'ProcurationHolder',
    name: 'Procuration Holder',
    description: 'Procuration holder delegation type',
    provider: 'fyrirtaekjaskra',
  },
]

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'delegation_provider',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.createTable(
        'delegation_type',
        {
          id: {
            type: Sequelize.STRING,
            primaryKey: true,
            allowNull: false,
          },
          provider: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'delegation_provider',
              key: 'id',
            },
          },
          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.createTable(
        'client_delegation_types',
        {
          client_id: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'client',
              key: 'client_id',
            },
          },
          delegation_type: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'delegation_type',
              key: 'id',
            },
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.createTable(
        'api_scope_delegation_types',
        {
          api_scope_name: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'api_scope',
              key: 'name',
            },
          },
          delegation_type: {
            type: Sequelize.STRING,
            allowNull: false,
            references: {
              model: 'delegation_type',
              key: 'id',
            },
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
            defaultValue: Sequelize.fn('now'),
          },
          modified: {
            type: Sequelize.DATE,
          },
        },
        { transaction },
      )

      await queryInterface.addConstraint('client_delegation_types', {
        fields: ['client_id', 'delegation_type'],
        type: 'primary key',
        transaction,
      })

      await queryInterface.addConstraint('api_scope_delegation_types', {
        fields: ['api_scope_name', 'delegation_type'],
        type: 'primary key',
        transaction,
      })

      // add current delegation providers
      await queryInterface.bulkInsert('delegation_provider', providers, {
        transaction,
      })

      const personalRepresentativeRightTypes =
        await queryInterface.sequelize.query({
          query: 'SELECT code FROM personal_representative_right_type',
          transaction,
        })

      // create delegation types for each personal representative right type
      const personalRepresentativeDelegationTypes =
        personalRepresentativeRightTypes[0].map(({ code }) => {
          return {
            id: `PersonalRepresentative:${code}`,
            name: `Personal Representative: ${code}`,
            description: `Personal representative delegation type for right type ${code}`,
            provider: 'talsmannagrunnur',
          }
        })

      // add current delegation types
      await queryInterface.bulkInsert(
        'delegation_type',
        [...types, ...personalRepresentativeDelegationTypes],
        {
          transaction,
        },
      )
    })
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('api_scope_delegation_types', {
        transaction,
      })
      await queryInterface.dropTable('client_delegation_types', { transaction })
      await queryInterface.dropTable('delegation_type', { transaction })
      await queryInterface.dropTable('delegation_provider', { transaction })
    })
  },
}
