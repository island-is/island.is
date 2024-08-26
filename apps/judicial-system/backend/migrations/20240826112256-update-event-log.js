module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'event_log',
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
    })
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('event_log', 'defendant_id', {
        transaction: t,
      })
    })
  },
}
