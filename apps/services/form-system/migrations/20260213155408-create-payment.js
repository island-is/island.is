module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'payment',
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
          fulfilled: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          reference_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          user4: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          definition: {
            type: Sequelize.JSONB,
            defaultValue: {},
          },
          amount: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          expires_at: {
            type: Sequelize.DATE,
          },
          request_id: {
            type: Sequelize.STRING,
            allowNull: true,
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
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.dropTable('payment', { transaction: t })
    })
  },
}
