'use strict'

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface.removeColumn('institution', 'notification_email', {
        transaction,
      }),
    )
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction((transaction) =>
      queryInterface
        .addColumn(
          'institution',
          'notification_email',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        )
        .then(() =>
          Promise.all([
            queryInterface.bulkUpdate(
              'institution',
              { notification_email: 'heradsdomur.vesturlands@domstolar.is' },
              { id: '9acb7d8e-426c-45a3-b3ef-5657bab629a3' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              { notification_email: 'heradsdomur.vestfjarda@domstolar.is' },
              { id: 'e997eb13-9963-46ef-b1d8-6b806a1965eb' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email:
                  'heradsdomur.nordurlands.vestra@domstolar.is',
              },
              { id: '7299ab8f-2fcc-40be-8194-8c2f749b4791' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email:
                  'heradsdomur.nordurlands.eystra@domstolar.is',
              },
              { id: 'c98547fd-cc63-408c-815a-9c5d33ee5ba0' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email: 'heradsdomur.austurlands@domstolar.is',
              },
              { id: '73ef0f01-7ae6-477c-af4a-9e86c2bc3440' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email: 'heradsdomur.sudurlands@domstolar.is',
              },
              { id: 'f350f77a-85b9-4267-a7e9-f3f29873486c' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email: 'tilkynningar.hdr@domstolar.is',
              },
              { id: 'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf' },
              { transaction },
            ),
            queryInterface.bulkUpdate(
              'institution',
              {
                notification_email: 'tilkynningar.hdrn@domstolar.is ',
              },
              { id: 'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d' },
              { transaction },
            ),
          ]),
        ),
    )
  },
}
