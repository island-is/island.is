const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000004'

module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c8',
      owner: authNationalId,
    },
    {
      ...getGenericEndorsementList(),
      id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
      owner: authNationalId,
      tags: ['generalPetition'],
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c8',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c8',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    },
  ],
}
