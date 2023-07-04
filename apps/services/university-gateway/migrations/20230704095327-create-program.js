'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.createTable(
          'program',
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
            starting_semester_year: {
              type: Sequelize.INTEGER,
            },
            starting_semester_season_id: {
              type: Sequelize.UUID,
              references: {
                model: 'semester_season',
                key: 'id',
              },
              allowNull: false,
            },
            application_start_date: {
              type: Sequelize.DATE,
            },
            application_end_date: {
              type: Sequelize.DATE,
            },
            department_name_is: {
              type: Sequelize.STRING,
            },
            department_name_en: {
              type: Sequelize.STRING,
            },
            degree_type_id: {
              type: Sequelize.UUID,
              references: {
                model: 'degree_type',
                key: 'id',
              },
              allowNull: false,
            },
            degree_abbreviation: {
              type: Sequelize.STRING,
            },
            credits: {
              type: Sequelize.INTEGER,
            },
            description_is: {
              type: Sequelize.STRING,
            },
            description_en: {
              type: Sequelize.STRING,
            },
            duration_in_years: {
              type: Sequelize.INTEGER,
            },
            cost_per_year: {
              type: Sequelize.INTEGER,
            },
            isced_code: {
              type: Sequelize.STRING,
            },
            external_url_is: {
              type: Sequelize.STRING,
            },
            external_url_en: {
              type: Sequelize.STRING,
            },
            admission_requirements_is: {
              type: Sequelize.STRING,
            },
            admission_requirements_en: {
              type: Sequelize.STRING,
            },
            study_requirements_is: {
              type: Sequelize.STRING,
            },
            study_requirements_en: {
              type: Sequelize.STRING,
            },
            cost_information_is: {
              type: Sequelize.STRING,
            },
            cost_information_en: {
              type: Sequelize.STRING,
            },
            active: {
              type: Sequelize.BOOLEAN,
            },
          },
          { transaction: t },
        ),
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('program', { transaction: t }),
      ])
    })
  },
}
