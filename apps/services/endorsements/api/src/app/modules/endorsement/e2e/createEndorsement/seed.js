const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')
const authNationalId = '0101302989' // we use gervimaður national id here to pass national id checks
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c4',
      closed_date: new Date(),
      tags: ['megaTestTag'],
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c5',
      tags: ['megaTestTag'],
      endorsement_meta: ['fullName', 'address'],
    },
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba011',
      endorsement_metadata: JSON.stringify([
        { field: 'fullName' },
        { field: 'address' },
        { field: 'voterRegion' },
      ]),
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
