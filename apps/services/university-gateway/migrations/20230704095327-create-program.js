'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.createTable(
        'program',
        {
          id: {
            type: Sequelize.UUID,
            primaryKey: true,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
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
          specialization_external_id: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          specialization_name_is: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          specialization_name_en: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          university_id: {
            type: Sequelize.UUID,
            references: {
              model: 'university',
              key: 'id',
            },
            allowNull: false,
          },
          department_name_is: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          department_name_en: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          starting_semester_year: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          starting_semester_season: {
            type: Sequelize.ENUM('FALL', 'SPRING', 'SUMMER'),
            allowNull: false,
          },
          application_start_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          application_end_date: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          school_answer_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          student_answer_date: {
            type: Sequelize.DATE,
            allowNull: true,
          },
          degree_type: {
            type: Sequelize.ENUM(
              'DIPLOMA',
              'UNDERGRADUATE',
              'POSTGRADUATE',
              'DOCTORAL',
              'OTHER',
            ),
            allowNull: false,
          },
          degree_abbreviation: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          credits: {
            type: Sequelize.FLOAT,
            allowNull: false,
          },
          description_is: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          description_en: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          duration_in_years: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          cost_per_year: {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          isced_code: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          languages: {
            type: Sequelize.ARRAY(Sequelize.STRING),
            defaultValue: [],
            allowNull: false,
          },
          external_url_is: {
            type: Sequelize.STRING(500),
            allowNull: true,
          },
          external_url_en: {
            type: Sequelize.STRING(500),
            allowNull: true,
          },
          admission_requirements_is: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          admission_requirements_en: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          study_requirements_is: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          study_requirements_en: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          cost_information_is: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          cost_information_en: {
            type: Sequelize.TEXT,
            allowNull: true,
          },
          active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
          tmp_active: {
            type: Sequelize.BOOLEAN,
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
      queryInterface.dropTable('program', { transaction: t }),
    )
  },
}
