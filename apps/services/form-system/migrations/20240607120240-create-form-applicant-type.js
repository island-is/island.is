module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
        'form_applicant_type',
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
          applicant_type_id: {
            type: Sequelize.STRING,
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
        },
        { transaction: t },
      )

      await queryInterface.addConstraint('form_applicant_type', {
        fields: ['applicant_type_id', 'form_id'],
        type: 'unique',
        name: 'unique_applicant_type_id_form_id_pair',
        transaction: t,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeConstraint(
        'form_applicant_type',
        'unique_applicant_type_id_form_id_pair',
        { transaction: t },
      )
      await queryInterface.dropTable('form_applicant_type', { transaction: t })
    })
  },
}
