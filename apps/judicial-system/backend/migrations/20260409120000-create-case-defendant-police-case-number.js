'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'case_defendant_police_case_number',
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
              allowNull: false,
              onDelete: 'CASCADE',
              references: { model: 'case', key: 'id' },
            },
            defendant_id: {
              type: Sequelize.UUID,
              allowNull: true,
              onDelete: 'CASCADE',
              references: { model: 'defendant', key: 'id' },
            },
            police_case_number: {
              type: Sequelize.STRING,
              allowNull: false,
            },
          },
          { transaction },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            CREATE UNIQUE INDEX case_def_police_cnum_unassigned_uniq
            ON case_defendant_police_case_number (case_id, police_case_number)
            WHERE defendant_id IS NULL
            `,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            CREATE UNIQUE INDEX case_def_police_cnum_assigned_uniq
            ON case_defendant_police_case_number (case_id, defendant_id, police_case_number)
            WHERE defendant_id IS NOT NULL
            `,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addIndex(
            'case_defendant_police_case_number',
            ['case_id'],
            {
              name: 'case_def_police_cnum_case_id_idx',
              transaction,
            },
          ),
        )
        .then(() =>
          queryInterface.addIndex(
            'case_defendant_police_case_number',
            ['defendant_id'],
            {
              name: 'case_def_police_cnum_defendant_id_idx',
              transaction,
            },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            INSERT INTO case_defendant_police_case_number (
              id,
              created,
              modified,
              case_id,
              defendant_id,
              police_case_number
            )
            SELECT
              gen_random_uuid(),
              NOW(),
              NOW(),
              dedup.case_id,
              NULL,
              dedup.police_case_number
            FROM (
              SELECT DISTINCT c.id AS case_id, x.nr AS police_case_number
              FROM "case" c
              CROSS JOIN LATERAL unnest(c.police_case_numbers) AS x(nr)
              WHERE c.police_case_numbers IS NOT NULL
                AND cardinality(c.police_case_numbers) > 0
                AND x.nr IS NOT NULL
                AND trim(x.nr) <> ''
            ) dedup
            `,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('case_defendant_police_case_number', {
        transaction,
      }),
    )
  },
}
