'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.query(`
    BEGIN;

    -- 1. Drop the existing unique constraint on (domain_name, from_national_id, to_national_id)
      ALTER TABLE delegation
        DROP CONSTRAINT IF EXISTS unique_domain_from_to;

    -- 2. Alter the domain_name column to allow NULL and remove the default value
      ALTER TABLE delegation
        ALTER COLUMN domain_name DROP DEFAULT,
        ALTER COLUMN domain_name DROP NOT NULL;

    -- 3. Create a new unique index to enforce uniqueness where NULL is treated as a value
      CREATE UNIQUE INDEX unique_domain_from_to_index
        ON delegation (COALESCE(domain_name, 'NULL'), from_national_id, to_national_id);

    COMMIT;
    `)
  },

  async down(queryInterface) {
    return queryInterface.sequelize.query(`
    BEGIN;

    -- 1. Drop the unique index created with COALESCE
      DROP INDEX IF EXISTS unique_domain_from_to_index;

    -- 2. Alter the domain_name column to make it NOT NULL again and add the default value
      ALTER TABLE delegation
        ALTER COLUMN domain_name SET DEFAULT '@island.is',
        ALTER COLUMN domain_name SET NOT NULL;

    -- 3. Recreate the original unique constraint on (domain_name, from_national_id, to_national_id)
      ALTER TABLE delegation ADD CONSTRAINT unique_domain_from_to
        UNIQUE (domain_name, from_national_id, to_national_id);

    COMMIT;

    `)
  },
}
