'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.changeColumn(
          'defendant',
          'defender_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_email',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_phone_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.changeColumn(
          'defendant',
          'defender_name',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_national_id',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_email',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.changeColumn(
          'defendant',
          'defender_phone_number',
          {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          { transaction },
        ),
      ]),
    )
  },
}
