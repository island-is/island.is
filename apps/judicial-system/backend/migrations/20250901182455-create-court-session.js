'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.createTable(
        'court_session',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          created: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          modified: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          case_id: {
            type: Sequelize.UUID,
            references: { model: 'case', key: 'id' },
            allowNull: false,
          },
          location: { type: Sequelize.STRING, allowNull: true },
          start_date: { type: Sequelize.DATE, allowNull: true },
          end_date: { type: Sequelize.DATE, allowNull: true },
          is_closed: { type: Sequelize.BOOLEAN, allowNull: true },
          closed_legal_provisions: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: true,
          },
          attendees: { type: Sequelize.TEXT, allowNull: true },
          entries: { type: Sequelize.TEXT, allowNull: true },
          ruling_type: { type: Sequelize.STRING, allowNull: true },
          ruling: { type: Sequelize.TEXT, allowNull: true },
          is_attesting_witness: { type: Sequelize.BOOLEAN, allowNull: true },
          attesting_witness_id: {
            type: Sequelize.UUID,
            references: { model: 'user', key: 'id' },
            allowNull: true,
          },
          closing_entries: { type: Sequelize.TEXT, allowNull: true },
        },
        { transaction },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('court_session', { transaction }),
    )
  },
}
