const {
  getGenericPartyLetterRegistry,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  partyLetterRegistry: [
    {
      ...getGenericPartyLetterRegistry(),
      party_letter: 'Y',
    },
  ],
}
