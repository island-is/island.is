const faker = require('faker')

module.exports = {
  getGenericPartyLetterRegistry: () => ({
    party_letter: faker.random.alpha({ count: 1, uppercase: true }),
    party_name: faker.company.companyName(),
    owner: faker.phone.phoneNumber('##########'),
    managers: [
      faker.phone.phoneNumber('##########'),
      faker.phone.phoneNumber('##########'),
      faker.phone.phoneNumber('##########'),
    ],
    created: new Date(),
    modified: new Date(),
  }),
}
