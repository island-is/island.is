'use strict'

const generatePartners = () => {
  const partners = []
  for (let index = 0; index < 666; index++) {
    partners.push({
      company_id: '8888888888' + index.toString(),
      company_name: 'Recycling Co - ' + index,
      address: 'Some street 2',
      postnumber: '105',
      city: 'Reykjavík',
      website: '',
      phone: '888-8888',
      active: true,
      created_at: '2025-09-08 04:05:06',
      updated_at: '2025-09-08 04:05:06',
    })
  }
  return partners
}

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'recycling_partner',
      [
        {
          company_id: '8888888888',
          company_name: 'Vaka',
          address: 'Héðinsgata 2',
          postnumber: '105',
          city: 'Reykjavík',
          website: 'https://vaka.is/',
          phone: '888-8888',
          active: true,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        {
          company_id: '9999999999',
          company_name: 'Hringrás',
          address: 'Götugata 2',
          postnumber: '115',
          city: 'Reykjavík',
          website: 'https://hringrás.is/',
          phone: '777-7777',
          active: true,
          created_at: '2020-09-08 04:05:06',
          updated_at: '2020-09-08 04:05:06',
        },
        ...generatePartners(),
      ],
      {},
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('recycling_request', null, {})
  },
}
