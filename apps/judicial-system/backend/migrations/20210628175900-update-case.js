'use strict'

function upColumn(queryInterface, originalColumn, Sequelize, t) {
  return queryInterface
    .addColumn(
      'case',
      `${originalColumn}_list`,
      {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      { transaction: t },
    )
    .then(() =>
      queryInterface.sequelize.query(
        `UPDATE "case"
         SET "${originalColumn}_list" = ARRAY["${originalColumn}"]`,
        { transaction: t },
      ),
    )
    .then(() =>
      queryInterface.changeColumn(
        'case',
        `${originalColumn}_list`,
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
        },
        { transaction: t },
      ),
    )
    .then(() =>
      queryInterface.removeColumn('case', originalColumn, {
        transaction: t,
      }),
    )
}

function downColumn(queryInterface, originalColumn, nullable, Sequelize, t) {
  return queryInterface
    .addColumn(
      'case',
      originalColumn,
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
      { transaction: t },
    )
    .then(() =>
      queryInterface.sequelize.query(
        `UPDATE "case" \
         SET "${originalColumn}" = "${originalColumn}_list"[1]`,
        { transaction: t },
      ),
    )
    .then(() =>
      queryInterface.changeColumn(
        'case',
        originalColumn,
        {
          type: Sequelize.STRING,
          allowNull: nullable,
        },
        { transaction: t },
      ),
    )
    .then(() =>
      queryInterface.removeColumn('case', `${originalColumn}_list`, {
        transaction: t,
      }),
    )
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        upColumn(queryInterface, 'accused_national_id', Sequelize, t),
        upColumn(queryInterface, 'accused_name', Sequelize, t),
        upColumn(queryInterface, 'accused_address', Sequelize, t),
        queryInterface.sequelize
          .query(
            'ALTER TABLE "case" ADD COLUMN "accused_gender_list" "enum_case_gender"[]',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              'UPDATE "case" \
               SET "accused_gender_list" = ARRAY["accused_gender"]',
              { transaction: t },
            ),
          )
          .then(() =>
            queryInterface.sequelize.query(
              'ALTER TABLE "case" ALTER COLUMN "accused_gender_list" SET NOT NULL',
              { transaction: t },
            ),
          )
          .then(() =>
            queryInterface.removeColumn('case', 'accused_gender', {
              transaction: t,
            }),
          ),
      ]),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        downColumn(queryInterface, 'accused_national_id', false, Sequelize, t),
        downColumn(queryInterface, 'accused_name', true, Sequelize, t),
        downColumn(queryInterface, 'accused_address', true, Sequelize, t),
        queryInterface.sequelize
          .query(
            'ALTER TABLE "case" ADD COLUMN "accused_gender" "enum_case_gender"',
            { transaction: t },
          )
          .then(() =>
            queryInterface.sequelize.query(
              'UPDATE "case" \
               SET "accused_gender" = "accused_gender_list"[1]',
              { transaction: t },
            ),
          )
          .then(() =>
            queryInterface.removeColumn('case', 'accused_gender_list', {
              transaction: t,
            }),
          ),
      ]),
    )
  },
}
