'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
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
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.dropTable('program_course', { transaction: t }),
      ])
    })
  },
}
