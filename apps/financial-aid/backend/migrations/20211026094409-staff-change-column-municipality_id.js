'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'staff',
          'municipality_ids',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
            allowNull: false,
            defaultValue: [],
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, municipality_id
             FROM staff`,
            {
              transaction: t,
            },
          ),
        )
        .then((res) =>
          Promise.all(
            res[0].map(async (s) =>
              queryInterface.sequelize.query(
                `UPDATE staff \
                    SET municipality_ids = '{${s.municipality_id}}' \
                    WHERE id = '${s.id}'`,
                {
                  transaction: t,
                },
              ),
            ),
          ),
        )
        .then(() =>
          queryInterface.removeColumn('staff', 'municipality_id', {
            transaction: t,
          }),
        ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .addColumn(
          'staff',
          'municipality_id',
          {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: '',
          },
          { transaction: t },
        )
        .then(() =>
          queryInterface.sequelize.query(
            `SELECT id, municipality_ids
           FROM staff`,
            {
              transaction: t,
            },
          ),
        )
        .then((res) =>
          Promise.all(
            res[0].map(async (s) =>
              queryInterface.sequelize.query(
                `UPDATE staff \
                  SET municipality_id = '${s.municipality_ids[0]}' \
                  WHERE id = '${s.id}'`,
                {
                  transaction: t,
                },
              ),
            ),
          ),
        )
        .then(() =>
          queryInterface.removeColumn('staff', 'municipality_ids', {
            transaction: t,
          }),
        ),
    )
  },
}
