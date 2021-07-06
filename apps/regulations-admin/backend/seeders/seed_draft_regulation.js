'use strict'

const draftRegulationSeed = `[
  {
    "id": "a1fd62db-18a6-4741-88eb-a7b7a7e05833",
    "draftingStatus": "draft",
    "name": "1234-1234",
    "title": "Reglugerð um x",
    "text": "<p>Lorem ipsum dolor</p>",
    draftingNotes: "",
    idealPublishDate: "",
    ministryId: "fsr",
    signatureDate: "",
    effectiveDate: "",
    type: "base"
  },
  {
    "id": "a0bdbe60-2aa3-4036-80d1-8a3d448312d1",
    "draftingStatus": "proposal",
    "name": "4321-4321",
    "title": "Breytingareglugerð um y",
    "text": "<p>Lorem ipsum dolor</p>",
    draftingNotes: "",
    idealPublishDate: "",
    ministryId: "avnsr",
    signatureDate: "",
    effectiveDate: "",
    type: "amending"
  },
  {
    "id": "0cb3a68b-f368-4d01-a594-ba73e0dc396d",
    "draftingStatus": "draft",
    "name": "3241-2314",
    "title": "Breytingareglugerð um z",
    "text": "<p>Lorem ipsum dolor</p>",
    draftingNotes: "",
    idealPublishDate: "",
    ministryId: "ssvr",
    signatureDate: "",
    effectiveDate: "",
    type: "amending"
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
      draftingStatus: Sequelize.ENUM('draft', 'proposal', 'shipped'),
      name: Sequelize.STRING,
      title: Sequelize.STRING,
      text: Sequelize.TEXT,
      draftingNotes: Sequelize.TEXT,
      idealPublishDate: Sequelize.DATEONLY,
      ministryId: Sequelize.STRING,
      signatureDate: Sequelize.DATEONLY,
      effectiveDate: Sequelize.DATEONLY,
      type: Sequelize.ENUM('base', 'amending'),
    })

    return queryInterface.sequelize.transaction((t) =>
      Promise.all(
        JSON.parse(draftRegulationSeed).map((reg) =>
          queryInterface.upsert(
            'draft_regulation',
            {
              ...reg,
              created: new Date(),
              modified: new Date(),
            },
            { id: reg.id },
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
