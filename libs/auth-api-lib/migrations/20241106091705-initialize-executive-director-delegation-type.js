'use strict'

module.exports = {
  async up(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `INSERT INTO delegation_type (id, provider, name, description) values ('ExecutiveDirector', 'fyrirtaekjaskra', 'Executive Director', 'Executive Director delegation type');`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `INSERT INTO api_scope_delegation_types (api_scope_name, delegation_type) select api_scope_name, 'ExecutiveDirector' from api_scope_delegation_types where delegation_type = 'ProcurationHolder';`,
        { transaction },
      )
    })
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `DELETE FROM api_scope_delegation_types where delegation_type = 'ExecutiveDirector';`,
        { transaction },
      )

      await queryInterface.sequelize.query(
        `DELETE FROM delegation_type where id = 'ExecutiveDirector';`,
        { transaction },
      )
    })
  },
}
