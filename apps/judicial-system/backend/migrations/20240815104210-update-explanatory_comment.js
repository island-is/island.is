module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'explanatory_comment',
        'defendant_id',
        {
          type: Sequelize.UUID,
          references: {
            model: 'defendant',
            key: 'id',
          },
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.removeConstraint(
        'explanatory_comment',
        'explanatory_comment_case_id_comment_type_key',
        { transaction: t },
      )
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('explanatory_comment', 'defendant_id', {
        transaction: t,
      })

      await queryInterface.addConstraint('explanatory_comment', {
        fields: ['case_id', 'comment_type'],
        type: 'unique',
        name: 'explanatory_comment_case_id_comment_type_key',
        transaction: t,
      })
    })
  },
}
