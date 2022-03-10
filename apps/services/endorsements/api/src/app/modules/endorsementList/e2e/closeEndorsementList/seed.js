const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000007'
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba012',
      owner: authNationalId,
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba013',
    },
  ],
}
