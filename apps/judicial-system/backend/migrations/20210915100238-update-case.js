'use strict'

const laws = {
  _97_3: '3. mgr. 97. gr.',
  _98_2: '2. mgr. 98. gr.',
  _115_1: '1. mgr. 115. gr. útll.',
}

function formatLegalBases(custodyProvisions, legal_basis) {
  if (!custodyProvisions?.length > 0) {
    return legal_basis ?? ''
  }

  return custodyProvisions.reduce(
    (acc, p) =>
      ['_97_3', '_98_2', '_115_1'].includes(p)
        ? acc
          ? `${acc}\n${laws[p]}`
          : laws[p]
        : acc,
    legal_basis ?? '',
  )
}

function reduceCustodyProvisions(custody_provisions) {
  return custody_provisions
    ? "'{" +
        custody_provisions.reduce(
          (acc, p) =>
            ['_97_3', '_98_2', '_115_1'].includes(p)
              ? acc
              : acc
              ? `${acc},"${p}"`
              : `"${p}"`,
          '',
        ) +
        "}'"
    : null
}

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize
        .query(
          `ALTER TYPE enum_case_custody_provisions RENAME TO enum_case_custody_provisions_old;
           ALTER TABLE "case" RENAME COLUMN custody_provisions TO custody_provisions_old;
           CREATE TYPE enum_case_custody_provisions AS ENUM ('_95_1_A','_95_1_B','_95_1_C','_95_1_D','_95_2','_99_1_B','_100_1');
           ALTER TABLE "case" ADD COLUMN custody_provisions enum_case_custody_provisions[];`,
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, custody_provisions_old, legal_basis
             FROM "case"
             WHERE type in ('CUSTODY', 'TRAVEL_BAN')`,
            {
              transaction: t,
            },
          ),
        )
        .then((res) =>
          Promise.all(
            res[0].map(async (c) =>
              queryInterface.sequelize.query(
                `UPDATE "case" \
                   SET legal_basis = '${formatLegalBases(
                     c.custody_provisions_old,
                     c.legal_basis,
                   )}', custody_provisions = ${reduceCustodyProvisions(
                  c.custody_provisions_old,
                )} \
                   WHERE id = '${c.id}'`,
                {
                  transaction: t,
                },
              ),
            ),
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE "case" DROP COLUMN custody_provisions_old;
             DROP TYPE enum_case_custody_provisions_old;`,
            { transaction: t },
          ),
        ),
    )
  },

  down: async (queryInterface, Sequelize) => {
    // There is no easy way back
    return
  },
}
