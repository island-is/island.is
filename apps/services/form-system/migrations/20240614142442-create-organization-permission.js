module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'organization_permission',
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
          organization_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'organization',
              key: 'id',
            },
          },
          permission: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        { transaction: t },
      )

      await queryInterface.addConstraint('organization_permission', {
        fields: ['organization_id', 'permission'],
        type: 'unique',
        name: 'unique_organization_id_permission_pair',
        transaction: t,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        'organization_permission',
        'unique_organization_id_permission_pair',
        { transaction: t },
      )
      await queryInterface.dropTable('organization_permission', {
        transaction: t,
      })
    })
  },
}
