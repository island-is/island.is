'use strict'

module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'recycling_request',
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      vehicle_id: {
        allowNull: false,
        references: {
          key: 'vehicle_id',
          model: 'vehicle',
        },
        type: DataTypes.STRING,
      },
      recycling_partner_id: {
        allowNull: true,
        references: {
          key: 'company_id',
          model: 'recycling_partner',
        },
        type: DataTypes.STRING,
      },
      request_type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      name_of_requestor: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      created_at: {
        type: DataTypes.DATE,
        //defaultValue: DataTypes.fn('now'),
      },
      updated_at: {
        type: DataTypes.DATE,
        //defaultValue: DataTypes.fn('now'),
      },
    },
    {
      charset: 'utf8',
    },
  )
}

module.exports.down = (queryInterface) =>
  queryInterface.dropTable('recycling_request')

// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       BEGIN;

//         CREATE TABLE recycling_request(
//           vehicle_id VARCHAR PRIMARY KEY,
//           request_type VARCHAR NOT NULL,
//           name_of_requestor VARCHAR NOT NULL,
//           created TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           modified TIMESTAMP WITH TIME ZONE,
//           FOREIGN KEY (vehicle_id) REFERENCES vehicle(vehicle_id)
//         );

//       COMMIT;
//     `)
//   },

//   down: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       DROP TABLE recycling_request;
//     `)
//   },
// }
