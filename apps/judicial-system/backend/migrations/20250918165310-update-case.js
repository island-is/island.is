'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'case',
        'court_record_hash',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )

      await queryInterface.bulkUpdate(
        'case',
        {
          indictment_hash: Sequelize.literal(
            "json_build_object('hash', indictment_hash, 'hashAlgorithm', indictment_hash_algorithm)::text",
          ),
        },
        { indictment_hash: { [Sequelize.Op.ne]: null } },
        { transaction },
      )

      await queryInterface.removeColumn('case', 'indictment_hash_algorithm', {
        transaction,
      })
    })
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        'case',
        'indictment_hash_algorithm',
        { type: Sequelize.STRING, allowNull: true },
        { transaction },
      )

      await queryInterface.bulkUpdate(
        'case',
        {
          indictment_hash: Sequelize.literal(
            "(indictment_hash::jsonb ->> 'hash')",
          ),
          indictment_hash_algorithm: Sequelize.literal(
            "(indictment_hash::jsonb ->> 'hashAlgorithm')",
          ),
        },
        { indictment_hash: { [Sequelize.Op.ne]: null } },
        { transaction },
      )

      await queryInterface.removeColumn('case', 'court_record_hash', {
        transaction,
      })
    })
  },
}
