const {
  getGenericEndorsementList,
  getGenericEndorsement,
} = require('../../../../../../test/seedHelpers')

const authNationalId = '0000000004'
const listYouOwnListId = '9c0b4106-4213-43be-a6b2-ff324f4ba0c8'
const listYouDoNotOwnListId = 'cb3f3185-a3f8-42d1-8206-212cbb943aaf'

module.exports = {
  authNationalId,
  listYouOwnListId,
  listYouDoNotOwnListId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      id: listYouOwnListId,
      owner: authNationalId,
    },
    // {
    //   ...getGenericEndorsementList(),
    //   id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    //   owner: authNationalId,
    //   tags: ['generalPetition'],
    // },
    {
      ...getGenericEndorsementList(),
      id: listYouDoNotOwnListId,
      owner: "1305775399",
      tags: ['generalPetition'],
    },
  ],
  endorsements: [
    {
      ...getGenericEndorsement(),
      endorsement_list_id: listYouOwnListId,
    },
    {
      ...getGenericEndorsement(),
      endorsement_list_id: listYouOwnListId,
    },
    // {
    //   ...getGenericEndorsement(),
    //   endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    // },
    // {
    //   ...getGenericEndorsement(),
    //   endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    // },
    // {
    //   ...getGenericEndorsement(),
    //   endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    // },
    // {
    //   ...getGenericEndorsement(),
    //   endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    // },
    // {
    //   ...getGenericEndorsement(),
    //   endorsement_list_id: 'aa042d38-9ff8-45b7-b0b2-9ca1d9cec543',
    // },
  ],
}
