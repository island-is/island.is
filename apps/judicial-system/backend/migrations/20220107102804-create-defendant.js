'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .createTable(
          'defendant',
          {
            id: {
              type: Sequelize.UUID,
              primaryKey: true,
              allowNull: false,
              defaultValue: Sequelize.UUIDV4,
            },
            created: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            modified: {
              type: 'TIMESTAMP WITH TIME ZONE',
              defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
              allowNull: false,
            },
            case_id: {
              type: Sequelize.UUID,
              references: {
                model: 'case',
                key: 'id',
              },
              allowNull: false,
            },
            national_id: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            name: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            gender: {
              type: Sequelize.ENUM('MALE', 'FEMALE', 'OTHER'),
              allowNull: true,
            },
            address: {
              type: Sequelize.STRING,
              allowNull: true,
            },
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `insert into defendant (id, case_id, national_id, name, gender, address)
               select md5(random()::text || clock_timestamp()::text)::uuid, id, accused_national_id, accused_name, cast(cast(accused_gender as text) as enum_defendant_gender), accused_address
               from "case"`,
            { transaction: t },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.removeColumn('case', 'accused_national_id', {
              transaction: t,
            }),
            queryInterface.removeColumn('case', 'accused_name', {
              transaction: t,
            }),
            queryInterface
              .removeColumn('case', 'accused_gender', {
                transaction: t,
              })
              .then(() =>
                queryInterface.sequelize.query(
                  'drop type if exists enum_case_gender',
                  { transaction: t },
                ),
              ),
            queryInterface.removeColumn('case', 'accused_address', {
              transaction: t,
            }),
          ]),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.addColumn(
          'case',
          'accused_national_id',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'accused_name',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
        queryInterface.sequelize.query(
          `create type enum_case_gender as enum ('MALE', 'FEMALE', 'OTHER');
           alter table "case" add column "accused_gender" "enum_case_gender"`,
          { transaction: t },
        ),
        queryInterface.addColumn(
          'case',
          'accused_address',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        ),
      ])
        .then(() =>
          queryInterface.sequelize.query(
            `update "case"
               set accused_national_id = d.national_id,
               accused_name = d.name,
               accused_gender = cast(cast(d.gender as text) as enum_case_gender),
               accused_address = d.address
             from (
               select distinct on (case_id) *
               from defendant
               order by case_id, created
             ) d
             where "case".id = d.case_id`,
            { transaction: t },
          ),
        )
        .then(() =>
          Promise.all([
            queryInterface.changeColumn(
              'case',
              'accused_national_id',
              {
                type: Sequelize.STRING,
                allowNull: false,
              },
              { transaction: t },
            ),
            queryInterface.dropTable('defendant', { transaction: t }),
          ]),
        ),
    )
  },
}
