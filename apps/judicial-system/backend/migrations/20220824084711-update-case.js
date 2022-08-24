'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface.addColumn(
        'case_file',
        'subtype',
        {
          type: Sequelize.ENUM(
            'COVER_LETTER',
            'INDICTMENT',
            'CRIMINAL_RECORD',
            'COST_BREAKDOWN',
            'CASE_FILE_CONTENTS',
            'CASE_FILE',
          ),
          allowNull: true,
        },
        { transaction: t },
      ),
    )
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) =>
      queryInterface
        .removeColumn('case_file', 'subtype', {
          transaction: t,
        })
        .then(() => {
          queryInterface.sequelize.query(
            'DROP TYPE IF EXISTS "enum_case_file_subtype";',
            { transaction: t },
          )
        }),
    )
  },
}
