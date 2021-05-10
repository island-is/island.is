const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000003'

module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c6',
      closed_date: new Date(),
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c7',
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c6',
    },
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c7',
    },
  ],
}
