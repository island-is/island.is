const faker = require('faker')

module.exports = {
  getGenericVoterRegistry: () => ({
    national_id: faker.phone.phoneNumber('##########'),
    region_number: faker.phone.phoneNumber('#'),
    region_name: faker.lorem.words(2),
    version: faker.phone.phoneNumber('#'),
    created: new Date(),
    modified: new Date(),
  }),
}
