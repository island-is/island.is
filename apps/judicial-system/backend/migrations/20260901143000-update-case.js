'use strict'

// The 115. gr. útlendingalaga provisions are added as part of a gradual move
// away from database enums: legal_provisions is converted from an enum array to
// a plain string array (the enum is kept in the model declaration in code), so
// new provisions no longer require ALTER TYPE ... ADD VALUE migrations.

// Full set of enum labels, used only to recreate the type on rollback.
const LEGAL_PROVISIONS = [
  '_95_1_A',
  '_95_1_B',
  '_95_1_C',
  '_95_1_D',
  '_95_2',
  '_97_1',
  '_99_1_B',
  '_100_1',
  '_115_1',
  '_115_1_A',
  '_115_1_B',
  '_115_1_C',
  '_115_1_D',
  '_115_1_E',
  '_115_1_F',
  '_115_1_G',
  '_115_1_H',
]

module.exports = {
  up: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        'ALTER TABLE "case" ALTER COLUMN "legal_provisions" TYPE varchar(255)[] USING "legal_provisions"::varchar(255)[]',
        { transaction },
      )
      await queryInterface.sequelize.query(
        'DROP TYPE IF EXISTS "enum_case_legal_provisions"',
        { transaction },
      )
    }),

  down: (queryInterface) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE "enum_case_legal_provisions" AS ENUM(${LEGAL_PROVISIONS.map(
          (value) => `'${value}'`,
        ).join(', ')})`,
        { transaction },
      )
      await queryInterface.sequelize.query(
        'ALTER TABLE "case" ALTER COLUMN "legal_provisions" TYPE "enum_case_legal_provisions"[] USING "legal_provisions"::"enum_case_legal_provisions"[]',
        { transaction },
      )
    }),
}
