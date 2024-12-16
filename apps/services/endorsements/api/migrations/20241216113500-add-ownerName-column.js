module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Endorsements', 'ownerName', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Endorsements', 'ownerName')
  },
}
