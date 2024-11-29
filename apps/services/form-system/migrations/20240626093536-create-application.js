module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'application',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
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
          submitted_at: {
            type: Sequelize.DATE,
            allowNull: true,
            defaultValue: null,
          },
          is_test: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          status: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          dependencies: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          completed: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          form_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'form',
              key: 'id',
            },
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
      queryInterface.dropTable('application', { transaction: t }),
    )
  },
}
