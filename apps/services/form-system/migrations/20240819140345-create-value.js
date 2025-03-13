module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'value',
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
          json: {
            type: Sequelize.JSON,
            allowNull: true,
          },
          order: {
            type: Sequelize.INTEGER,
            allowNull: false,
            defaultValue: 0,
          },
          field_type: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          field_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            allowNull: false,
            references: {
              model: 'field',
              key: 'id',
            },
          },
          application_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'application',
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
      queryInterface.dropTable('value', { transaction: t }),
    )
  },
}
