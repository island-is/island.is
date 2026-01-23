module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    `)

    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'section',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'screen',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('section', 'identifier', {
        transaction: t,
      })

      await queryInterface.removeColumn('screen', 'identifier', {
        transaction: t,
      })
    })
  },
}
