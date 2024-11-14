module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'form',
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
          slug: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
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
          invalidation_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          is_translated: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          application_days_to_remove: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 60,
          },
          derived_from: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          is_published_in_changing: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          stop_progress_on_validating_screen: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          completed_message: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          dependencies: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          organization_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'organization',
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
      queryInterface.dropTable('form', { transaction: t }),
    )
  },
}
