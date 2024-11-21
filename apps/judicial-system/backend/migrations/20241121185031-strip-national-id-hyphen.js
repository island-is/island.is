'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'defendant',
        {
          national_id: queryInterface.sequelize.literal(
            `REPLACE(national_id, '-', '')`,
          ),
        },
        { national_id: { [Sequelize.Op.like]: '%-%' } },
        { transaction },
      ),
    )
  },

  async down() {
    // Optional: Implement logic to revert the changes if necessary
    return
  },
}
