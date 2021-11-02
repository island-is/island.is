const {
  getGenericEndorsementList,
} = require('../../../../../../test/seedHelpers')
const authNationalId = '0101302399'
module.exports = {
  authNationalId,
  endorsementLists: [
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
    {
      ...getGenericEndorsementList(),
      tags: ['generalPetition'],
    },
  ],
}
