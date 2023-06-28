'use strict';

'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'course',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            allowNull: false,
            defaultValue: Sequelize.UUIDV4,
          },
          external_id: {
            type: Sequelize.STRING,
          },
          name_is: {
            type: Sequelize.STRING,
          },
          name_en: {
            type: Sequelize.STRING,
          },
          university_id: {
            type: Sequelize.UUID,
            references: {
              model: 'university',
              key: 'id',
            },
            allowNull: false,
          },
          credits: {
            type: Sequelize.INTEGER,
          },
          semester_year: {
            type: Sequelize.INTEGER,
          },
          semester_season: {
            type: Sequelize.ENUM('FALL', 'SPRING', 'SUMMER'),
          },
          description_is: {
            type: Sequelize.STRING,
          },
          description_en: {
            type: Sequelize.STRING,
          },
        external_url_is: {
            type: Sequelize.STRING,
          },
        external_url_en: {
            type: Sequelize.STRING,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('course', { transaction: t }),
    )
  },
}
