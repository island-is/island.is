'use strict'

const userSeeds = `[
  {
    "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    "national_id": "0000000009",
    "name": "Áki Ákærandi",
    "title": "ákærandi",
    "mobile_number": "0000000",
    "email": "aki@dummy.dd",
    "role": "PROSECUTOR",
    "institution_id": "53581d7b-0591-45e5-9cbe-c96b2f82da85"
  },
  {
    "id": "cef1ba9b-99b6-47fc-a216-55c8194830aa",
    "national_id": "0000001119",
    "name": "Dalli Dómritari",
    "title": "dómritari",
    "mobile_number": "1111111",
    "email": "dalli@dummy.dd",
    "role": "REGISTRAR",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
  {
    "id": "9c0b4106-4213-43be-a6b2-ff324f4ba0c2",
    "national_id": "0000002229",
    "name": "Dóra Dómari",
    "title": "dómari",
    "mobile_number": "2222222",
    "email": "dora@dummy.dd",
    "role": "JUDGE",
    "institution_id": "d1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf"
  },
  {
    "id": "4bbf247c-c14f-40b5-8f4c-dd3236e7f667",
    "national_id": "0000003339",
    "name": "Lalli Landsréttardómari",
    "title": "landsréttardómari",
    "mobile_number": "3333333",
    "email": "lalli@dummy.dd",
    "role": "JUDGE",
    "institution_id": "4676f08b-aab4-4b4f-a366-697540788088"
  }
]`

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('user', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      updated: Sequelize.DATE,
      national_id: Sequelize.STRING,
      name: Sequelize.STRING,
      title: Sequelize.STRING,
      mobile_number: Sequelize.STRING,
      email: Sequelize.STRING,
      role: Sequelize.STRING,
      institution_id: Sequelize.UUID,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(userSeeds).map((user) =>
          queryInterface.upsert(
            'user',
            {
              ...user,
              created: new Date(),
              modified: new Date(),
            },
            {
              ...user,
              modified: new Date(),
            },
            { id: user.id },
            model,
            { transaction: t },
          ),
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('user', null, { transaction: t }),
    )
  },
}
