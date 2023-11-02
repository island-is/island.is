'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'institution',
        { active: true },
        {
          id: [
            'affee2cd-5519-450e-b11c-bdd61229e1ad', // Lögreglustjórinn á Vestfjörðum
            'e997eb13-9963-46ef-b1d8-6b806a1965eb', // Héraðsdómur Vestfjarða
          ],
        },
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.bulkUpdate(
        'institution',
        { active: false },
        {
          id: [
            'affee2cd-5519-450e-b11c-bdd61229e1ad', // Lögreglustjórinn á Vestfjörðum
            'e997eb13-9963-46ef-b1d8-6b806a1965eb', // Héraðsdómur Vestfjarða
          ],
        },
        { transaction },
      ),
    )
  },
}
