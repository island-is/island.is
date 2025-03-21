module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'applicant',
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
          last_login: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          national_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          email: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          phone_number: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          address: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          municipality: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          applicant_type_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          application_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
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
      queryInterface.dropTable('applicant', { transaction: t }),
    )
  },
}
