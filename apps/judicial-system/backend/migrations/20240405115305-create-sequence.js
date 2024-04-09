'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query(
        'CREATE SEQUENCE robot_email_seq START WITH 1 INCREMENT BY 1 MINVALUE 1 MAXVALUE 999999999 CYCLE',
        { transaction: t },
      ),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.sequelize.query('DROP SEQUENCE robot_email_seq', {
        transaction: t,
      }),
    )
  },
}
