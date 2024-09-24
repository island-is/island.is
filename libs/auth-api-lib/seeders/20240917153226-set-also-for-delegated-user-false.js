module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE api_scope
          SET also_for_delegated_user = false
          WHERE name = '@island.is/signature-collection';

      COMMIT;
    `)
  },

  down(queryInterface) {
    return queryInterface.sequelize.query(`
      BEGIN;
        UPDATE api_scope
          SET also_for_delegated_user = true
          WHERE name = '@island.is/signature-collection';

      COMMIT;
    `)
  },
}
