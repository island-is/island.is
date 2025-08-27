'use strict'

module.exports = {
  async up(queryInterface /*, Sequelize */) {
    return queryInterface.sequelize.transaction(async (t) => {
      // Drop dependent table first (if any FK to applicant)
      await queryInterface.sequelize.query(
        'DROP TABLE IF EXISTS form_applicant_type',
        { transaction: t },
      )
      await queryInterface.sequelize
        .query('DROP TABLE IF EXISTS applicant', { transaction: t })
        .catch(() => {})
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // Recreate applicant (adjust columns to original schema if different)
      await queryInterface.createTable(
        'applicant',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name: {
            type: Sequelize.STRING,
            allowNull: true,
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
        },
        { transaction: t },
      )

      await queryInterface.createTable(
        'form_applicant_type',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          name: {
            type: Sequelize.JSON,
            allowNull: false,
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
          applicant_type_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          form_id: {
            type: Sequelize.UUID,
            allowNull: false,
            references: { model: 'form', key: 'id' },
            onDelete: 'CASCADE',
          },
        },
        { transaction: t },
      )

      await queryInterface.addConstraint('form_applicant_type', {
        fields: ['applicant_type_id', 'form_id'],
        type: 'unique',
        name: 'unique_applicant_type_id_form_id_pair',
        transaction: t,
      })
    })
  },
}
