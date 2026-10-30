'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'application_translation_publish',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          created_at: {
            type: 'TIMESTAMP WITH TIME ZONE',
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            allowNull: false,
          },
          namespace: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          action: {
            type: Sequelize.STRING(16),
            allowNull: false,
          },
          contentful_snapshot_id: {
            type: Sequelize.STRING(64),
            allowNull: false,
            unique: true,
          },
          actor_name: {
            type: Sequelize.STRING(255),
            allowNull: false,
          },
          on_behalf_of_name: {
            type: Sequelize.STRING(255),
            allowNull: true,
          },
          rolled_back_to_snapshot_id: {
            type: Sequelize.STRING(64),
            allowNull: true,
          },
          rolled_back_to_published_at: {
            type: 'TIMESTAMP WITH TIME ZONE',
            allowNull: true,
          },
        },
        { transaction },
      )

      await queryInterface.addIndex(
        'application_translation_publish',
        ['namespace'],
        { name: 'application_translation_publish_namespace_idx', transaction },
      )

      await queryInterface.sequelize.query(
        `ALTER TABLE application_translation_publish
           ADD CONSTRAINT application_translation_publish_action_check
           CHECK (action IN ('publish', 'rollback'))`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `CREATE FUNCTION application_translation_publish_append_only()
         RETURNS trigger AS $$
         BEGIN
           RAISE EXCEPTION 'application_translation_publish is append-only';
         END;
         $$ LANGUAGE plpgsql`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `CREATE TRIGGER application_translation_publish_append_only_row
           BEFORE UPDATE OR DELETE ON application_translation_publish
           FOR EACH ROW EXECUTE FUNCTION application_translation_publish_append_only()`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `CREATE TRIGGER application_translation_publish_append_only_truncate
           BEFORE TRUNCATE ON application_translation_publish
           FOR EACH STATEMENT EXECUTE FUNCTION application_translation_publish_append_only()`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('application_translation_publish', {
        transaction,
      })
      await queryInterface.sequelize.query(
        'DROP FUNCTION application_translation_publish_append_only()',
        { transaction },
      )
    })
  },
}
