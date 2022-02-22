'use strict'

module.exports = {
  up: (queryInterface) => {
    return Promise.all([
      queryInterface.addIndex('personal_representative', {
        fields: ['national_id_personal_representative'],
      }),
      queryInterface.addIndex('personal_representative', {
        fields: ['national_id_represented_person'],
      }),
    ])
  },

  down: (queryInterface) => {
    return Promise.all([
      queryInterface.removeIndex(
        'personal_representative',
        'personal_representative_national_id_personal_representative',
      ),
      queryInterface.removeIndex(
        'personal_representative',
        'personal_representative_national_id_represented_person',
      ),
    ])
  },
}
