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
      national_id: '0101302989',
      version: 1,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101303019',
      version: 2,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101303369',
      version: 3,
    },
    {
      ...getGenericVoterRegistry(),
      national_id: '0101302989',
      version: 3,
    },
  ],
}
