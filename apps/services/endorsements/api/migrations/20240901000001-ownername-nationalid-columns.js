'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Rename 'owner' to 'ownerNationalId'
    await queryInterface.renameColumn('endorsement_list', 'owner', 'owner_national_id');

    // Add new 'ownerName' column
    await queryInterface.addColumn('endorsement_list', 'owner_name', {
      type: Sequelize.STRING,
      allowNull: true,
    });

    // Populate ownerName for existing records using the service function
    // This requires calling the service manually or writing a custom function for migration.
  },

  down: async (queryInterface, Sequelize) => {
    // Revert column rename
    await queryInterface.renameColumn('endorsement_list', 'owner_national_id', 'owner_name');

    // Remove the 'ownerName' column
    await queryInterface.removeColumn('endorsement_list', 'owner_name');
  },
};
