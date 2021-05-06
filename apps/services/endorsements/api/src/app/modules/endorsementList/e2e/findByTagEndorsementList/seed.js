const {
  getGenericEndorsementList,
} = require('../../../../utils/seedHelpers.js')

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
