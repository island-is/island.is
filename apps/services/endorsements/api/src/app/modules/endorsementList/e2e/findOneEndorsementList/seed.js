const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000010'
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba016',
    },
    {
      ...getGenericEndorsementList(),
      id: '7d6c2b91-8d8d-42d0-82f7-cd64ce16d753',
      tags: ['generalPetition'],
    },
  ],
}
