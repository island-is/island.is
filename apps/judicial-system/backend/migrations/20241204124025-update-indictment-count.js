'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction((transaction) =>
      queryInterface.addColumn(
        'indictment_count',
        'indictment_count_subtypes',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: true,
          defaultValue: [],
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    await queryInterface.removeColumn(
      'indictment_count',
      'indictment_count_subtypes',
    )
  },
}
