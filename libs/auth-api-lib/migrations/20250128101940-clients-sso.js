'use strict'

module.exports = {
  // The migration syntax was updated afterwards to fix migrations locally. It had already been executed in prod.
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(
      `
        DO $$
        BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_client_sso') THEN
          CREATE TYPE "enum_client_sso" AS ENUM ('enabled', 'disabled');
        END IF;
        END$$;
      `,
    )

    await queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'client',
          'sso',
          {
            type: 'enum_client_sso',
            defaultValue: 'disabled',
            allowNull: false,
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            'UPDATE "client" SET sso = \'enabled\';',
            { transaction: t },
          ),
        ),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('client', 'sso', { transaction: t })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_client_sso";',
            { transaction: t },
          ),
        ),
    )
  },
}
