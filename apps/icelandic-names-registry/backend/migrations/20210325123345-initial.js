'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.query(`
      BEGIN;

        CREATE TABLE icelandic_names (
          id INTEGER NOT NULL,
          icelandic_name VARCHAR NOT NULL,
          afgreitt VARCHAR DEFAULT NULL,
          birta INTEGER DEFAULT 1,
          tegund VARCHAR DEFAULT NULL,
          skyring VARCHAR DEFAULT NULL,
          urskurdur VARCHAR DEFAULT NULL,
          PRIMARY KEY (id)
        );

      COMMIT;
    `)
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.query(`
      DROP TABLE icelandic_names;
    `)
  },
  // up: (queryInterface, Sequelize) => {
  //   return queryInterface.createTable('names', {
  //     id: {
  //       type: Sequelize.INTEGER,
  //       allowNull: false,
  //       autoIncrement: true,
  //       primaryKey: true,
  //     },
  //     name: {
  //       type: Sequelize.STRING,
  //       allowNull: false,
  //     },
  //     type: {
  //       type: Sequelize.STRING,
  //       allowNull: false,
  //     },
  //     status: {
  //       type: Sequelize.STRING,
  //       allowNull: true,
  //     },
  //     description: {
  //       type: Sequelize.STRING,
  //       allowNull: true,
  //     },
  //     verdict_date: {
  //       type: Sequelize.DATE,
  //       allowNull: true,
  //     },
  //     visible: {
  //       type: Sequelize.INTEGER,
  //       allowNull: true,
  //     },
  //     created: {
  //       allowNull: false,
  //       type: Sequelize.DATE,
  //     },
  //     modified: {
  //       allowNull: false,
  //       type: Sequelize.DATE,
  //     },
  //   })
  // },

  // down: (queryInterface, Sequelize) => {
  //   return queryInterface.dropTable('names')
  // },
}
