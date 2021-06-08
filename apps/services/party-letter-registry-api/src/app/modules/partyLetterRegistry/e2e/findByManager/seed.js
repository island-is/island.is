const {
  getGenericPartyLetterRegistry,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  partyLetterRegistry: [
    {
      ...getGenericPartyLetterRegistry(),
      owner: '0101305069',
      managers: ['0101305069'],
      party_letter: 'Q',
    },
  ],
}
