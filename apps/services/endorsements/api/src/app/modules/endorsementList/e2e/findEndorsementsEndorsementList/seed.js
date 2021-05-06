const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000009'
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba014',
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba015',
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba014',
    },
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba015',
    },
  ],
}
