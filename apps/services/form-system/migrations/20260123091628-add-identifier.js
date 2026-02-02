module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'section',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'screen',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'list_item',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: true,
        },
        { transaction: t },
      )

      // Backfill: identifier = id for existing rows
      await queryInterface.sequelize.query(
        `UPDATE "section" SET "identifier" = "id"`,
        { transaction: t },
      )
      await queryInterface.sequelize.query(
        `UPDATE "screen" SET "identifier" = "id"`,
        { transaction: t },
      )
      await queryInterface.sequelize.query(
        `UPDATE "field" SET "identifier" = "id"`,
        { transaction: t },
      )
      await queryInterface.sequelize.query(
        `UPDATE "list_item" SET "identifier" = "id"`,
        { transaction: t },
      )

      // Make NOT NULL and set UUIDv4 default for future rows
      await queryInterface.changeColumn(
        'section',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        { transaction: t },
      )
      await queryInterface.changeColumn(
        'screen',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
        },
        { transaction: t },
      )
      await queryInterface.changeColumn(
        'list_item',
        'identifier',
        {
          type: Sequelize.UUID,
          allowNull: false,
          defaultValue: Sequelize.UUIDV4,
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

      await queryInterface.removeColumn('list_item', 'identifier', {
        transaction: t,
      })
    })
  },
}
