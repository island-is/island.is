'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .renameColumn(
          'case',
          'requested_custody_restrictions',
          'requested_custody_restrictions_old',
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TYPE enum_case_custody_restrictions RENAME TO enum_case_custody_restrictions_old;
             CREATE TYPE enum_case_custody_restrictions AS ENUM (
               'NECESSITIES',
               'ISOLATION',
               'VISITAION',
               'COMMUNICATION',
               'MEDIA',
               'ALTERNATIVE_TRAVEL_BAN_REQUIRE_NOTIFICATION',
               'WORKBAN');`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            'ALTER TABLE "case" ADD COLUMN requested_custody_restrictions enum_case_custody_restrictions[]',
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `UPDATE "case"
               SET requested_custody_restrictions=(
                 SELECT ARRAY(
                   SELECT UNNEST(requested_custody_restrictions_old)
                   EXCEPT SELECT UNNEST('{ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT}'::enum_case_custody_restrictions_old[])
                 )::VARCHAR[]::enum_case_custody_restrictions[]
               )
               WHERE requested_custody_restrictions_old IS NOT NULL`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.removeColumn(
            'case',
            'requested_custody_restrictions_old',
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `DROP TYPE enum_case_custody_restrictions_old`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    // ALTER TYPE ... ADD cannot run inside a transaction block
    return queryInterface.sequelize.query(
      `ALTER TYPE "enum_case_custody_restrictions"
       ADD VALUE 'ALTERNATIVE_TRAVEL_BAN_CONFISCATE_PASSPORT'`,
    )
  },
}
