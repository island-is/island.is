'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'university',
      [
        {
          id: '07D8A581-2027-47D8-BF88-906A891E325D',
          national_id: '6001692039',
          contentful_key: 'university_of_iceland',
        },
        {
          id: '79BAD08B-38D6-4CEF-AD19-2B7C35231557',
          national_id: '5101054190',
          contentful_key: 'reykjavik_university',
        },
        {
          id: '3D659798-B00A-4F88-958A-AE1381E82EBB',
          national_id: '5206871229',
          contentful_key: 'university_of_akureyri',
        },
        {
          id: '702B5D88-7584-4024-8447-65F43B0DDCCD',
          national_id: '5502690239',
          contentful_key: 'bifrost_university',
        },
        {
          id: 'DF6F0F22-38F1-4C90-B506-BB617B7BED4F',
          national_id: '4210984099',
          contentful_key: 'iceland_university_of_the_arts',
        },
        {
          id: '062524B3-C6C0-4059-A6A7-EC262FE1F17C',
          national_id: '4112043590',
          contentful_key: 'agricultural_university_of_iceland',
        },
        {
          id: '7E8C26DF-9847-4375-B9E8-E9487DD804BF',
          national_id: '5001694359',
          contentful_key: 'holar_university',
        },
      ],
      {},
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('university', {
      national_id: [
        '6001692039',
        '5101054190',
        '5206871229',
        '5502690239',
        '4210984099',
        '4112043590',
        '5001694359',
      ],
    })
  },
}
