'use strict'

module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'vehicle_owner',
    {
      national_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      personname: {
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
  queryInterface.dropTable('vehicle_owner')

// 'use strict'

// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       BEGIN;

//         CREATE TABLE vehicleOwner(
//           national_id VARCHAR PRIMARY KEY,
//           personname VARCHAR NOT NULL,
//           created TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           modified TIMESTAMP WITH TIME ZONE
//         );

//       COMMIT;
//     `)
//   },

//   down: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       DROP TABLE vehicleOwner;
//     `)
//   },
// }
