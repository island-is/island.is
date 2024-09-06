'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('institution', 'address', {
      type: Sequelize.STRING,
      allowNull: true,
    })

    const institutionsToUpdate = [
      {
        name: 'Héraðsdómur Reykjavíkur',
        address: 'Dómhúsið við Lækjartorg, Reykjavík',
      },
      { name: 'Héraðsdómur Reykjaness', address: 'Fjarðargata 9, Hafnarfirði' },
      {
        name: 'Héraðsdómur Vesturlands',
        address: 'Bjarnarbraut 8, Borgarnesi',
      },
      { name: 'Héraðsdómur Vestfjarða', address: 'Hafnarstræti 9, Ísafirði' },
      {
        name: 'Héraðsdómur Norðurlands vestra',
        address: 'Skagfirðingabraut 21, Sauðárkróki',
      },
      {
        name: 'Héraðsdómur Norðurlands eystra',
        address: 'Hafnarstræti 107, 4. hæð, Akureyri',
      },
      { name: 'Héraðsdómur Austurlands', address: 'Lyngás 15, Egilsstöðum' },
      { name: 'Héraðsdómur Suðurlands', address: 'Austurvegur 4, Selfossi' },
    ]

    await queryInterface.sequelize.transaction(async (transaction) => {
      for (const institution of institutionsToUpdate) {
        await queryInterface.bulkUpdate(
          'institution',
          { address: institution.address },
          { name: institution.name },
          { transaction },
        )
      }
    })
  },

  down: async (queryInterface) => {
    await queryInterface.removeColumn('institution', 'address')
  },
}
