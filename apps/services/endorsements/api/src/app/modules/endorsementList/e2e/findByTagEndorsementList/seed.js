const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      tags: ['partyLetterSudurkjordaemi2021'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['partyLetterSudurkjordaemi2021'],
    },
  ],
}
