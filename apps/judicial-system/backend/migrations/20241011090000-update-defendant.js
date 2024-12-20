module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'defendant',
        'requested_defender_choice',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )
      await queryInterface.addColumn(
        'defendant',
        'requested_defender_national_id',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )
      await queryInterface.addColumn(
        'defendant',
        'requested_defender_name',
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `UPDATE "defendant" SET requested_defender_choice = defender_choice`,
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `UPDATE "defendant" SET requested_defender_national_id = defender_national_id`,
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `UPDATE "defendant" SET requested_defender_name = defender_name`,
        { transaction: t },
      )
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        'defendant',
        'requested_defender_choice',
        {
          transaction: t,
        },
      )
      await queryInterface.removeColumn(
        'defendant',
        'requested_defender_national_id',
        {
          transaction: t,
        },
      )
      await queryInterface.removeColumn(
        'defendant',
        'requested_defender_name',
        {
          transaction: t,
        },
      )
    })
  },
}
