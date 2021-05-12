const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000005'

module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c9',
      owner: authNationalId,
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba010',
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c9',
      endorser: authNationalId,
    },
  ],
}
