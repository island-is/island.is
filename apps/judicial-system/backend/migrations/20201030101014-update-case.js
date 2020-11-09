'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        'CREATE TYPE "enum_case_gender" AS ENUM (\'MALE\', \'FEMALE\', \'OTHER\');\
           ALTER TABLE "case" ADD COLUMN "accused_gender" "enum_case_gender";',
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case', 'accused_gender', {
          transaction: t,
        })
        .then(() =>
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_gender";',
            { transaction: t },
          ),
        ),
    )
  },
}
