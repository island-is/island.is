'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'program_course',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
          },
          program_id: {
            type: Sequelize.UUID,
            references: {
              model: 'program',
              key: 'id',
            },
            allowNull: false,
          },
          course_id: {
            type: Sequelize.UUID,
            onDelete: 'CASCADE',
            references: {
              model: 'course',
              key: 'id',
            },
            allowNull: false,
          },
          requirement: {
            type: Sequelize.ENUM(
              'MANDATORY',
              'FREE_ELECTIVE',
              'RESTRICTED_ELECTIVE',
            ),
            allowNull: false,
          },
          semester_year: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          semester_season: {
            type: Sequelize.ENUM('FALL', 'SPRING', 'SUMMER'),
            allowNull: false,
          },
          created: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          modified: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.dropTable('program_course', { transaction: t }),
    )
  },
}
