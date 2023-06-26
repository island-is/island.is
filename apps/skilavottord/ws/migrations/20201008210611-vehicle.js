'use strict'
//           newreg_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           vin_number VARCHAR,
module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'vehicle',
    {
      vehicle_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      owner_national_id: {
        allowNull: false,
        references: {
          key: 'national_id',
          model: 'vehicle_owner',
        },
        type: DataTypes.STRING,
      },
      vehicle_type: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      vehicle_color: {
        type: DataTypes.STRING,
      },
      newreg_date: {
        type: DataTypes.DATE,
      },
      vin_number: {
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

module.exports.down = (queryInterface) => queryInterface.dropTable('vehicle')

// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       BEGIN;

//         CREATE TABLE vehicle(
//           vehicle_id VARCHAR PRIMARY KEY,
//           vehicle_owner_id VARCHAR NOT NULL,
//           vehicle_type VARCHAR NOT NULL,
//           vehicle_color VARCHAR NOT NULL,
//           newreg_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           vin_number VARCHAR,
//           created TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           modified TIMESTAMP WITH TIME ZONE,
//           FOREIGN KEY (vehicle_owner_id) REFERENCES vehicleowner(national_id)
//         );

//       COMMIT;
//     `)
//   },

//   down: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       DROP TABLE vehicle;
//     `)
//   },
// }
