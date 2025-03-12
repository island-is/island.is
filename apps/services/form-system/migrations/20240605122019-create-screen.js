module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'screen',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name: {
            type: Sequelize.JSON,
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
          display_order: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          is_completed: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          multiset: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          call_ruleset: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          section_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'section',
              key: 'id',
            },
          },
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('screen', { transaction: t }),
    )
  },
}
