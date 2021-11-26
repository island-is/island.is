const faker = require('faker')

module.exports = {
  getGenericRightType: () => ({
    code: faker.random.alpha({ count: 1, uppercase: true }),
    decscription: faker.random.alpha({count: 20, uppercase: false}),
    created: new Date(),
    modified: new Date(),
  }),
}
