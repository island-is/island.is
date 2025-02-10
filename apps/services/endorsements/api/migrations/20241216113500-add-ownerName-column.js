module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('endorsement_list', 'owner_name', {
      type: Sequelize.STRING,
      allowNull: true,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('endorsement_list', 'owner_name')
  },
}
