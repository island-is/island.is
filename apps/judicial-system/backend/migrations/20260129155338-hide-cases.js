'use strict'

module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((transaction) =>
      Promise.all([
        // these are all cases we need to temporarily hide used to test real prod cases
        queryInterface.sequelize.query(
          `UPDATE "case"
              SET "state" = 'DELETED'
              WHERE "id" IN (
              '6756ac13-a8fd-4594-8c38-c90a0dbe16ec',
              'e2d8ced7-1a47-4284-a2dc-964e19851083',
              '2d753937-0ceb-4a15-ad19-f8386d9c9a51',
              'b40fb244-a271-493b-96b0-01bcc96323a0',
              'bf026a8f-7b4a-49f0-bb2f-5c0856318de0',
              '859b6c62-09eb-4b7d-beb6-002d3e31f61e',
              '97f1565d-34f1-4000-a8ee-99447f7b0688',
              'beb1335e-7082-4ca8-946b-60b738b90772',
              'fcbcfd8a-c8ba-495b-91d8-b86e28d45f33',
              'aef4dc5a-adb6-48a3-95be-b7999159c0ae',
              '51bba865-e069-4104-85d9-3541d7372485',
              '4993bc4e-520b-4e05-a696-04138f01ab3d',
              'e4865a66-63b5-4227-8f37-e122763cc6a0',
              'eb19fd65-7e8b-43ff-8b94-bfb693a23054',
              'd7eab17a-06df-4ef5-b10f-d987bd442a3b'
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
