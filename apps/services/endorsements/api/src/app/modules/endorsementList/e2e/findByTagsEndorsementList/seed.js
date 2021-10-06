const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
  ],
}
