module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'organization',
        'zendesk_instance',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )

      await queryInterface.addColumn(
        'organization',
        'zendesk_brand_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('organization', 'zendesk_instance', {
        transaction: t,
      })

      await queryInterface.removeColumn('organization', 'zendesk_brand_id', {
        transaction: t,
      })
    })
  },
}
