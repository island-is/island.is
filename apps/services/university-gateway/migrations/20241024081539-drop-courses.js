'use strict'

//TODOx update DB schema (dbdiagram)
module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('program_course', { transaction })
      await queryInterface.dropTable('course', { transaction })
    })
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.createTable(
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
            allowNull: false,
          },
          name_is: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          name_en: {
            type: Sequelize.STRING,
            allowNull: false,
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
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          description_is: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          description_en: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          external_url_is: {
            type: Sequelize.STRING(500),
            allowNull: true,
          },
          external_url_en: {
            type: Sequelize.STRING(500),
            allowNull: true,
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
      )

      await queryInterface.createTable(
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
            type: Sequelize.ENUM(
              'FALL',
              'SPRING',
              'SUMMER',
              'WHOLE_YEAR',
              'ANY',
            ),
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
      )
    })
  },
}
