const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')
const authNationalId = '0101303369' // we use gervimaður national id here to pass national id checks
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c4',
      closed_date: '2029-11-01T10:53:39.882Z',
      tags: ['generalPetition'],
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c4',
    },
  ],
}
