/* eslint-disable local-rules/disallow-kennitalas */
'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      Promise.all([
        queryInterface.bulkUpdate(
          'defendant',
          { defender_national_id: '1012795459' },
          { id: '3b35d1e8-268f-4e90-9c80-2d4002da8758' },
          { transaction: t },
        ),
        queryInterface.bulkUpdate(
          'defendant',
          { defender_national_id: '1805842939' },
          { id: 'acdb388f-723f-411d-ae11-0053eed1307d' },
          { transaction: t },
        ),
        queryInterface.bulkUpdate(
          'defendant',
          { defender_national_id: '1608823609' },
          { id: '1a7e4737-0fdc-4fc1-bb77-312311deee83' },
          { transaction: t },
        ),
      ]),
    )
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.bulkUpdate(
        'defendant',
        { defender_national_id: null },
        {
          id: [
            '3b35d1e8-268f-4e90-9c80-2d4002da8758',
            'acdb388f-723f-411d-ae11-0053eed1307d',
            '1a7e4737-0fdc-4fc1-bb77-312311deee83',
          ],
        },
        { transaction: t },
      ),
    )
  },
}
