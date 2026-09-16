'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('user_profile', 'only_priority_notifications', {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
      allowNull: false
    })
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('user_profile', 'only_priority_notifications')
  },
};
