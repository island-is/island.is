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
              allowNull: false,
            },
            active: {
              type: Sequelize.BOOLEAN,
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
            starting_semester_year: {
              type: Sequelize.INTEGER,
              allowNull: false,
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
              allowNull: false,
            },
            application_end_date: {
              type: Sequelize.DATE,
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
              allowNull: false,
            },
            credits: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            description_is: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            description_en: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            duration_in_years: {
              type: Sequelize.INTEGER,
              allowNull: false,
            },
            cost_per_year: {
              type: Sequelize.INTEGER,
              allowNull: true, //TODO bíða eftir niðurstöðu efnishóps
            },
            isced_code: {
              type: Sequelize.STRING,
              allowNull: false,
            },
            external_url_is: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            external_url_en: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            admission_requirements_is: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            admission_requirements_en: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            study_requirements_is: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            study_requirements_en: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            cost_information_is: {
              type: Sequelize.STRING,
              allowNull: true,
            },
            cost_information_en: {
              type: Sequelize.STRING,
              allowNull: true,
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
