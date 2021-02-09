'use strict'

const localEnv = {
  userSeeds: 'gudjon,baldur,ivar',
  gudjon: `[
  {
    "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    "national_id": "0000000000",
    "name": "Áki Ákærandi",
    "title": "ákærandi",
    "mobile_number": "0000000",
    "email": "aki@dmr.is",
    "role": "PROSECUTOR",
    "institution": "Lögreglustjórinn"
  }
]`,

  baldur: `[
  {
    "id": "cef1ba9b-99b6-47fc-a216-55c8194830aa",
    "national_id": "1111111111",
    "name": "Dalli Dómritari",
    "title": "dómritari",
    "mobile_number": "1111111",
    "email": "dalli@dmr.is",
    "role": "REGISTRAR",
    "institution": "Héraðsdómurinn"
  }
]`,

  ivar: `[
  {
    "id": "9c0b4106-4213-43be-a6b2-ff324f4ba0c2",
    "national_id": "2222222222",
    "name": "Dóra Dómari",
    "title": "dómari",
    "mobile_number": "2222222",
    "email": "dora@dmr.is",
    "role": "JUDGE",
    "institution": "Héraðsdómurinn"
  }
]`,
}

const userSeed = () => {
  const seedVars = process.env.USER_SEEDS || localEnv.userSeeds

  return seedVars
    .split(',')
    .reduce(
      (seeds, seed) =>
        seeds.concat(JSON.parse(process.env[seed] || localEnv[seed])),
      [],
    )
}

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
      institution: Sequelize.STRING,
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        userSeed().map((user) =>
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
