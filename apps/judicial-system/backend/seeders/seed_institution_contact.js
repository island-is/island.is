'use strict'

const institutionContactSeeds = `[
  {
    "id": "81bbdee8-9b29-4a7d-8ba8-96bc8879c553",
    "institution_id": "53581d7b-0591-45e5-9cbe-c96b2f82da85",
    "value": "domar@lrh.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "48bd025a-e507-4b99-9fdf-cc59bb531912",
    "institution_id": "0b4e39bb-2177-4dfc-bb7b-7bb6bc42a661",
    "value": "svipting.lss@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "744f9c11-6173-4731-b475-6f688fef044e",
    "institution_id": "34d35fa7-2805-4488-84f6-d22c6bae3dd3",
    "value": "vesturland.domar@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "fcb7592a-f430-4a6e-89d7-c6691d9707fa",
    "institution_id": "26136a67-c3d6-4b73-82e2-3265669a36d3",
    "value": "sudurland@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "4049b030-7065-44d3-8bfe-de5db1bbf365",
    "institution_id": "1c45b4c5-e5d3-45ba-96f8-219568982268",
    "value": "austurland@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "54bc620f-93cd-4206-a34c-0a97063dea21",
    "institution_id": "0be621ec-c063-4df3-ab15-61f6e421ed7c",
    "value": "nordurland.vestra@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "621ab045-9189-495e-accb-3b4a73777797",
    "institution_id": "a4b204f3-b072-41b6-853c-42ec4b263bd6",
    "value": "akaerusvidlne@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  },
  {
    "id": "215529e9-5bf3-4271-8a69-90b5305a19be",
    "institution_id": "affee2cd-5519-450e-b11c-bdd61229e1ad",
    "value": "domar-lvf@logreglan.is",
    "type": "DRIVING_LICENSE_SUSPENSION"
  }
]`

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('communication', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      updated: Sequelize.DATE,
      institution_id: Sequelize.UUID,
      value: Sequelize.STRING,
      type: Sequelize.STRING,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(institutionContactSeeds).map((institutionContact) =>
          queryInterface.upsert(
            'communication',
            {
              ...institutionContact,
              created: new Date(),
              modified: new Date(),
            },
            {
              ...institutionContact,
              modified: new Date(),
            },
            { id: institutionContact.id },
            { transaction: t, model },
          ),
        ),
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('communication', null, {
        transaction: t,
      }),
    )
  },
}
