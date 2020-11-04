'use strict'

module.exports.up = (queryInterface, DataTypes) => {
  return queryInterface.createTable(
    'recycling_partner',
    {
      company_id: {
        allowNull: false,
        primaryKey: true,
        type: DataTypes.STRING,
      },
      company_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      address: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      postnumber: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      city: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      website: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      phone: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      active: {
        allowNull: false,
        type: DataTypes.BOOLEAN,
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
  queryInterface.dropTable('recycling_partner')

// module.exports = {
//   up: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       BEGIN;

//         CREATE TABLE recycling_partner(
//           company_id VARCHAR NOT NULL,
//           company_name VARCHAR NOT NULL,
//           address VARCHAR NOT NULL,
//           postnumber VARCHAR NOT NULL,
//           city VARCHAR NOT NULL,
//           website VARCHAR,
//           phone VARCHAR,
//           active boolean,
//           created TIMESTAMP WITH TIME ZONE DEFAULT now(),
//           modified TIMESTAMP WITH TIME ZONE,
//           PRIMARY KEY (company_id)
//         );

//       COMMIT;
//     `)
//   },

//   down: (queryInterface) => {
//     return queryInterface.sequelize.query(`
//       DROP TABLE recycling_partner;
//     `)
//   },
// }
