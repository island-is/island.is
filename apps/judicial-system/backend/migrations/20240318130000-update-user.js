module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'user',
        'can_confirm_appeal',
        'can_confirm_indictment',
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.renameColumn(
        'user',
        'can_confirm_indictment',
        'can_confirm_appeal',
        { transaction: t },
      ),
    )
  },
}
