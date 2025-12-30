'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        // these are all cases for fake users used to test real prod cases
        queryInterface.sequelize.query(
          `UPDATE "case"
              SET "state" = 'DELETED'
              WHERE "id" IN (
              '232aa9a1-f423-4200-a9b8-ee3742115726',
              '31a5ac64-6d3f-4f9d-a883-efbc7c2bffbd',
              '50f4bcaf-4b9a-4534-b250-159d633d0a42',
              '78955bb2-df05-48bb-ba0a-b20fcda28bbd',
              '7b29291f-32f0-4b18-98af-36b74d9c91f8',
              '8392a204-4468-4393-af3f-9ff9d615e4ba',
              'ac3af774-6626-4f6d-a4d1-bb8f4524e037',
              'c167a71a-7e34-4c98-b83a-46a6bc9fa724',
              'c7d15ddb-3b00-4394-87a0-4fc6136614af'
              )`,
          { transaction },
        ),
      ]),
    )
  },

  down: () => {
    return Promise.resolve()
  },
}
