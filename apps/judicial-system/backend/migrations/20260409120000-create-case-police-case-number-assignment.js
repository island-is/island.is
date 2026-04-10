'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .createTable(
          'case_police_case_number_assignment',
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
            CREATE UNIQUE INDEX case_police_case_number_assignment_case_id_police_unassigned_uniq
            ON case_police_case_number_assignment (case_id, police_case_number)
            WHERE defendant_id IS NULL
            `,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            CREATE UNIQUE INDEX case_police_case_number_assignment_case_defendant_police_assigned_uniq
            ON case_police_case_number_assignment (case_id, defendant_id, police_case_number)
            WHERE defendant_id IS NOT NULL
            `,
            { transaction },
          ),
        )
        .then(() =>
          queryInterface.addIndex(
            'case_police_case_number_assignment',
            ['case_id'],
            {
              name: 'case_police_case_number_assignment_case_id_idx',
              transaction,
            },
          ),
        )
        .then(() =>
          queryInterface.addIndex(
            'case_police_case_number_assignment',
            ['defendant_id'],
            {
              name: 'case_police_case_number_assignment_defendant_id_idx',
              transaction,
            },
          ),
        )
        .then(() =>
          queryInterface.sequelize.query(
            `
            INSERT INTO case_police_case_number_assignment (
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
            ) dedup
            `,
            { transaction },
          ),
        ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.dropTable('case_police_case_number_assignment', {
        transaction,
      }),
    )
  },
}
