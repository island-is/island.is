'use strict'

module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'gdpr',
    {
      national_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      gdpr_status: {
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

module.exports.down = (queryInterface) => queryInterface.dropTable('gdpr')

// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       BEGIN;

//         CREATE TABLE gdpr(
//           national_id VARCHAR NOT NULL,
//           gdpr_status boolean NOT NULL,
//           created TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           modified TIMESTAMP WITH TIME ZONE,
//           PRIMARY KEY (national_id)
//         );

//       COMMIT;
//     `)
//   },

//   down: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       DROP TABLE gdpr;
//     `)
//   },
// }
