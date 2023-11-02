'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'appeal_case_number',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_assistant_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_judge1_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_judge2_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'appeal_judge3_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'user',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction: t },
        ),
      ]),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.removeColumn('case', 'appeal_case_number', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'appeal_assistant_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'appeal_judge1_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'appeal_judge2_id', {
          transaction: t,
        }),
        queryInterface.removeColumn('case', 'appeal_judge3_id', {
          transaction: t,
        }),
      ]),
    )
  },
}
