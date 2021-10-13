const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0101302989' // we use gervimaður national id here to pass national id check
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c1',
      owner: authNationalId,
      endorsement_meta: ['fullName', 'address', 'voterRegion'],
      endorsement_metadata: JSON.stringify([
        { field: 'fullName' },
        { field: 'address' },
        { field: 'voterRegion' },
      ]),
      tags: ['conflictingTag'],
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
      closed_date: new Date(),
      owner: authNationalId,
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c3',
      tags: ['conflictingTag'],
    },
  ],
  endorsements: [
    // to test invalidate other endorsements
    {
      ...getGenericEndorsement(),
      endorser: authNationalId,
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c3',
    },
  ],
}
