'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .renameColumn(
            'case',
            'accused_appeal_decision',
            'accused_appeal_decision_del',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize
              .query(
                'ALTER TABLE "case" ADD COLUMN "accused_appeal_decision" "enum_case_appeal_decision";',
                { transaction: t },
              )
              .then(() =>
                queryInterface.sequelize
                  .query(
                    'UPDATE "case"\
                     SET "accused_appeal_decision" = "accused_appeal_decision_del"[1]\
                     WHERE "accused_appeal_decision_del" IS NOT NULL AND array_length("accused_appeal_decision_del", 1) > 0',
                    { transaction: t },
                  )
                  .then(() =>
                    queryInterface.removeColumn(
                      'case',
                      'accused_appeal_decision_del',
                      { transaction: t },
                    ),
                  ),
              ),
          ),
        queryInterface
          .renameColumn(
            'case',
            'prosecutor_appeal_decision',
            'prosecutor_appeal_decision_del',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize
              .query(
                'ALTER TABLE "case" ADD COLUMN "prosecutor_appeal_decision" "enum_case_appeal_decision";',
                { transaction: t },
              )
              .then(() =>
                queryInterface.sequelize
                  .query(
                    'UPDATE "case"\
                     SET "prosecutor_appeal_decision" = "prosecutor_appeal_decision_del"[1]\
                     WHERE "prosecutor_appeal_decision_del" IS NOT NULL AND array_length("prosecutor_appeal_decision_del", 1) > 0',
                    { transaction: t },
                  )
                  .then(() =>
                    queryInterface.removeColumn(
                      'case',
                      'prosecutor_appeal_decision_del',
                      { transaction: t },
                    ),
                  ),
              ),
          ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface
          .renameColumn(
            'case',
            'accused_appeal_decision',
            'accused_appeal_decision_del',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize
              .query(
                'ALTER TABLE "case" ADD COLUMN "accused_appeal_decision" "enum_case_appeal_decision"[];',
                { transaction: t },
              )
              .then(() =>
                queryInterface.sequelize
                  .query(
                    'UPDATE "case"\
                     SET "accused_appeal_decision" = ARRAY["accused_appeal_decision_del"]\
                     WHERE "accused_appeal_decision_del" IS NOT NULL',
                    { transaction: t },
                  )
                  .then(() =>
                    queryInterface.removeColumn(
                      'case',
                      'accused_appeal_decision_del',
                      { transaction: t },
                    ),
                  ),
              ),
          ),
        queryInterface
          .renameColumn(
            'case',
            'prosecutor_appeal_decision',
            'prosecutor_appeal_decision_del',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize
              .query(
                'ALTER TABLE "case" ADD COLUMN "prosecutor_appeal_decision" "enum_case_appeal_decision"[];',
                { transaction: t },
              )
              .then(() =>
                queryInterface.sequelize
                  .query(
                    'UPDATE "case"\
                     SET "prosecutor_appeal_decision" = ARRAY["prosecutor_appeal_decision_del"]\
                     WHERE "prosecutor_appeal_decision_del" IS NOT NULL',
                    { transaction: t },
                  )
                  .then(() =>
                    queryInterface.removeColumn(
                      'case',
                      'prosecutor_appeal_decision_del',
                      { transaction: t },
                    ),
                  ),
              ),
          ),
      ]),
    )
  },
}
