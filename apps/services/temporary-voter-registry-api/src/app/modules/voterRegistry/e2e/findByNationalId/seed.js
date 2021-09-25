const {
  getGenericVoterRegistry,
} = require('../../../../../../test/seedHelpers')

module.exports = {
  voterRegistry: [
    {
      ...getGenericVoterRegistry(),
      version: 1,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101304929',
      version: 1,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101304339',
      version: 2,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101307789',
      version: 3,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101304929',
      version: 3,
    },
  ],
}
