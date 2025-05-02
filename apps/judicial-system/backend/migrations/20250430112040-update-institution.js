'use strict'

module.exports = {
  async up(queryInterface) {
    queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface.bulkInsert(
        'institution',
        [
          {
            id: 'a4c16ca4-6452-4bcf-bed9-93994d082510',
            name: 'Ríkislögreglustjóri',
            type: 'NATIONAL_COMMISSIONERS_OFFICE',
            active: true,
            // eslint-disable-next-line local-rules/disallow-kennitalas
            national_id: '5306972079',
          },
          {
            id: '73281c39-f4ec-41e0-9e48-0a4b217969c8',
            name: 'Dómstólasýslan',
            type: 'COURT_ADMINISTRATION_OFFICE',
            active: true,
            // eslint-disable-next-line local-rules/disallow-kennitalas
            national_id: '4707171140',
          },
        ],
        { transaction },
      ),
    )
  },

  async down(queryInterface) {
    queryInterface.sequelize.transaction(async (transaction) =>
      queryInterface.bulkDelete(
        'institution',
        {
          id: [
            'a4c16ca4-6452-4bcf-bed9-93994d082510',
            '73281c39-f4ec-41e0-9e48-0a4b217969c8',
          ],
        },
        { transaction },
      ),
    )
  },
}
