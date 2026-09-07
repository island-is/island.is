'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'form',
        'zendesk_brand_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
          UPDATE form
          SET zendesk_brand_id = organization.zendesk_brand_id
          FROM organization
          WHERE form.organization_id = organization.id
            AND form.submission_service_url ILIKE '%zendesk%'
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn('organization', 'zendesk_brand_id', {
        transaction: t,
      })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'organization',
        'zendesk_brand_id',
        {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '',
        },
        { transaction: t },
      )

      await queryInterface.sequelize.query(
        `
          UPDATE organization
          SET zendesk_brand_id = form_zendesk_brand.brand_id
          FROM (
            SELECT organization_id, MAX(zendesk_brand_id) AS brand_id
            FROM form
            WHERE submission_service_url ILIKE '%zendesk%'
              AND zendesk_brand_id <> ''
            GROUP BY organization_id
          ) form_zendesk_brand
          WHERE organization.id = form_zendesk_brand.organization_id
        `,
        { transaction: t },
      )

      await queryInterface.removeColumn('form', 'zendesk_brand_id', {
        transaction: t,
      })
    })
  },
}
