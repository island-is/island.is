module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename 'owner' to 'ownerNationalId'
    await queryInterface.renameColumn('endorsement_list', 'owner', 'ownerNationalId');

    // Add 'ownerName' column
    await queryInterface.addColumn('endorsement_list', 'ownerName', {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: '', // Ensure this matches your requirement
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Rename 'ownerNationalId' back to 'owner'
    await queryInterface.renameColumn('endorsement_list', 'ownerNationalId', 'owner');

    // Remove 'ownerName' column
    await queryInterface.removeColumn('endorsement_list', 'ownerName');
  }
};
