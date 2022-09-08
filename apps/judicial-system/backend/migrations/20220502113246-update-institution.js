'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.addColumn(
          'institution',
          'default_court_id',
          {
            type: Sequelize.UUID,
            references: {
              model: 'institution',
              key: 'id',
            },
            allowNull: true,
          },
          { transaction },
        ),
        queryInterface.addColumn(
          'institution',
          'police_case_number_prefix',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        ),
      ]).then(() =>
        queryInterface.sequelize.query(
          `UPDATE institution
             SET default_court_id = 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf', police_case_number_prefix = '007'
             WHERE id in ('53581d7b-0591-45e5-9cbe-c96b2f82da85','fbbe0ebd-33f1-4a8f-84ba-8e4b8e8b16b1','8f9e2f6d-6a00-4a5e-b39b-95fd110d762e');
             UPDATE institution
             SET default_court_id = 'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d', police_case_number_prefix = '008'
             WHERE id = '0b4e39bb-2177-4dfc-bb7b-7bb6bc42a661';
             UPDATE institution
             SET default_court_id = 'c98547fd-cc63-408c-815a-9c5d33ee5ba0', police_case_number_prefix = '316'
             WHERE id = 'a4b204f3-b072-41b6-853c-42ec4b263bd6';
             UPDATE institution
             SET default_court_id = 'f350f77a-85b9-4267-a7e9-f3f29873486c', police_case_number_prefix = '318'
             WHERE id = '26136a67-c3d6-4b73-82e2-3265669a36d3';
             UPDATE institution
             SET default_court_id = '9acb7d8e-426c-45a3-b3ef-5657bab629a3', police_case_number_prefix = '313'
             WHERE id = '34d35fa7-2805-4488-84f6-d22c6bae3dd3';`,
          { transaction },
        ),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        queryInterface.removeColumn('institution', 'default_court_id', {
          transaction,
        }),
        queryInterface.removeColumn(
          'institution',
          'police_case_number_prefix',
          {
            transaction,
          },
        ),
      ]),
    )
  },
}
