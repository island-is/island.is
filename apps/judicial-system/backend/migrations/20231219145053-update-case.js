'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        "CREATE TYPE \"enum_request_appeal_ruling_not_to_be_published\" AS ENUM ('PROSECUTOR', 'PROSECUTOR_REPRESENTATIVE', 'REGISTRAR', 'JUDGE', 'ASSISTANT', 'ADMIN', 'PRISON_SYSTEM_STAFF', 'DEFENDER');\
       ALTER TABLE \"case\" ADD COLUMN \"request_appeal_ruling_not_to_be_published\" \"enum_request_appeal_ruling_not_to_be_published\"[];",
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'request_appeal_ruling_not_to_be_published', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_request_appeal_ruling_not_to_be_published";',
            { transaction: t },
          ),
        ),
    )
  },
}
