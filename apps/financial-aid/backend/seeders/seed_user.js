'use strict'

const staffSeeds = `[
    {
      "id" : "114cf6e2-207e-11ec-9621-0242ac130002",
      "modified" : "2021-11-04 14:21:11.81+00",
      "roles" : ["Employee"],
      "phone_number" : "2401460",
      "active" : true,
      "national_id" : "0000000002",
      "municipality_ids" : ["1400"],
      "use_pseudo_name" : false,
      "created" : "2021-09-28 17:04:06.377791+00",
      "nickname" : "",
      "email" : "klara@klara.is",
      "name" : "Klára Línudóttir"
    },
    {
      "id" : "114cf6e2-207e-11ec-9621-0242ac130003",
      "modified" : "2021-10-28 15:20:49.886617+00",
      "roles" : ["SuperAdmin", "Admin"],
      "phone_number" : "0102719",
      "active" : true,
      "national_id" : "0101302719",
      "municipality_ids" : ["0"],
      "use_pseudo_name" : false,
      "created" : "2021-10-28 15:20:49.886617+00",
      "nickname" : null,
      "email" : null,
      "name" : "HljómFreyr arnar rikardo levottino"
    },
    {
      "id" : "1816a13a-7374-4f21-bb5f-5ebef7503aa0",
      "modified" : "2021-11-18 15:53:12.431+00",
      "roles" : ["Admin"],
      "phone_number" : null,
      "active" : true,
      "national_id" : "0101302399",
      "municipality_ids" : ["3714"],
      "use_pseudo_name" : false,
      "created" : "2021-11-18 15:53:12.431+00",
      "nickname" : null,
      "email" : "gervo@gervo.is",
      "name" : "GerviMaður "
    }
]`

const municipalitySeeds = `[
  {
    "active" : true,
    "id" : "a6927092-354e-47b3-94bd-a60133229af1",
    "municipality_id" : "1400",
    "cohabitation_aid_id" : "58f6578a-76b6-4c07-9c76-b33a68645b66",
    "rules_homepage" : null,
    "created" : "2021-10-20 11:43:08.168002+00",
    "email" : "hafnarfjordur@hafnarfjordur.is",
    "modified" : "2021-10-20 11:43:08.168002+00",
    "homepage" : "https://www.hafnarfjordur.is",
    "name" : "hfj",
    "individual_aid_id" : "c88bab0e-813d-40b8-85b8-1371f94daeb8"
  }
]`

module.exports = {
  up: (queryInterface, Sequelize) => {
    var model = queryInterface.sequelize.define('staff', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      created: Sequelize.DATE,
      modified: Sequelize.DATE,
      phone_number: Sequelize.STRING,
      national_id: Sequelize.STRING,
      municipality_ids: Sequelize.ARRAY(Sequelize.STRING),
      name: Sequelize.STRING,
      active: Sequelize.BOOLEAN,
      use_pseudo_name: Sequelize.BOOLEAN,
      roles: Sequelize.ARRAY(Sequelize.ENUM),
      nickname: Sequelize.STRING,
      email: Sequelize.STRING,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(staffSeeds).map((staff) =>
          queryInterface.upsert(
            'staff',
            {
              ...staff,
              created: new Date(),
              modified: new Date(),
            },
            {
              ...staff,
              modified: new Date(),
            },
            { id: staff.id },
            { transaction: t, model },
          ),
        ),
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkDelete('staff', null, { transaction: t }),
    )
  },
}
