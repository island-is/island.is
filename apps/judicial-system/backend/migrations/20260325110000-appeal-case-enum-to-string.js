'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.resolve()
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN appeal_state TYPE VARCHAR(255)`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN appeal_ruling_decision TYPE VARCHAR(255)`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN request_appeal_ruling_not_to_be_published TYPE VARCHAR(255)[]
             USING request_appeal_ruling_not_to_be_published::VARCHAR(255)[]`,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.resolve()
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN appeal_state TYPE "enum_case_appeal_state"
             USING appeal_state::"enum_case_appeal_state"`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN appeal_ruling_decision TYPE "enum_case_appeal_ruling_decision"
             USING appeal_ruling_decision::"enum_case_appeal_ruling_decision"`,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `ALTER TABLE appeal_case
             ALTER COLUMN request_appeal_ruling_not_to_be_published TYPE "enum_request_appeal_ruling_not_to_be_published"[]
             USING request_appeal_ruling_not_to_be_published::"enum_request_appeal_ruling_not_to_be_published"[]`,
            { transaction },
          ),
        ),
    )
  },
}
