'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'program_tag',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          program_id: {
            type: Sequelize.UUID,
            references: {
              model: 'program',
              key: 'id',
            },
            allowNull: false,
          },
          tag_id: {
            type: Sequelize.UUID,
            references: {
              model: 'tag',
              key: 'id',
            },
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('program_tag', { transaction: t }),
    )
  },
}
