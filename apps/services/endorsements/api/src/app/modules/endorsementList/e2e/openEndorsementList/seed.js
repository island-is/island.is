const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000011'
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba017',
      closed_date: new Date(),
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba018',
      owner: authNationalId,
      closed_date: new Date(),
    },
  ],
}
