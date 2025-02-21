module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'form_certification_type',
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
          form_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'form',
              key: 'id',
            },
          },
          certification_type_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        },
        { transaction: t },
      )

      await queryInterface.addConstraint('form_certification_type', {
        fields: ['form_id', 'certification_type_id'],
        type: 'unique',
        name: 'unique_form_id_certification_type_id_pair',
        transaction: t,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        'form_certification_type',
        'unique_form_id_certification_type_id_pair',
        { transaction: t },
      )
      await queryInterface.dropTable('form_certification_type', {
        transaction: t,
      })
    })
  },
}
