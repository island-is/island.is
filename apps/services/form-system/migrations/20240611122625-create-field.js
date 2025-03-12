module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'field',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          identifier: {
            type: Sequelize.UUID,
            allowNull: false,
          },
          name: {
            type: Sequelize.JSON,
            allowNull: false,
          },
          description: {
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
          is_required: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          is_part_of_multiset: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          field_settings: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          screen_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'screen',
              key: 'id',
            },
          },
          field_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        { transaction: t },
      ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('field', { transaction: t }),
    )
  },
}
