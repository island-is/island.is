'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'endorsement_list',
        'endorsement_metadata',
        {
          type: Sequelize.JSONB,
          defaultValue: '[]',
          allowNull: false,
        },
        { transaction: t },
      )

      const newMetadataFields = [
        {
          field: 'fullName',
        },
        {
          field: 'signedTags',
        },
        {
          field: 'address',
          keepUpToDate: true,
        },
      ]

      // add correct metadata fields for existing partyLetter lists
      await queryInterface.bulkUpdate(
        'endorsement_list',
        {
          endorsement_metadata: JSON.stringify(newMetadataFields),
        },
        {
          tags: {
            [Sequelize.Op.overlap]: queryInterface.sequelize.cast(
              ['partyLetter2021'],
              'varchar[]',
            ),
          },
        },
        { transaction: t },
      )

      // add correct metadata fields for existing partyApplication lists
      await queryInterface.bulkUpdate(
        'endorsement_list',
        {
          endorsement_metadata: JSON.stringify([
            ...newMetadataFields,
            {
              field: 'voterRegion',
              keepUpToDate: true,
            },
          ]),
        },
        {
          tags: {
            [Sequelize.Op.overlap]: queryInterface.sequelize.cast(
              [
                'partyApplicationNordausturkjordaemi2021',
                'partyApplicationNordvesturkjordaemi2021',
                'partyApplicationReykjavikurkjordaemiNordur2021',
                'partyApplicationReykjavikurkjordaemiSudur2021',
                'partyApplicationSudurkjordaemi2021',
                'partyApplicationSudvesturkjordaemi2021',
              ],
              'varchar[]',
            ),
          },
        },
        { transaction: t },
      )
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'endorsement_list',
      'endorsement_metadata',
    )
  },
}
