/* eslint-disable local-rules/disallow-kennitalas */
'use strict'
const uuid = require('uuidv4').uuid

const today = new Date()
const tenYears = new Date()
tenYears.setFullYear(today.getFullYear() + 10)

const rightType1 = {
  code: 'health',
  description: 'Gives access to view health info',
  valid_from: today,
  valid_to: tenYears,
  created: today,
  modified: null,
}

const rightType2 = {
  code: 'finance',
  description: 'Gives access to view finance info',
  valid_from: today,
  valid_to: tenYears,
  created: today,
  modified: null,
}

const rightTypes = [rightType1, rightType2]

const personalRepresentativeType1 = {
  code: 'personal_representative_for_disabled_person',
  name: 'Persónulegur talsmaður fatlaðs einstaklings',
  description:
    'Persónulegur talsmaður fatlaðs einstaklings samkvæmt reglugerð 972/2012',
}

const personalRepresentativeTypes = [personalRepresentativeType1]

const personalRepresentative1 = {
  id: uuid(),
  national_id_personal_representative: '2011651489',
  national_id_represented_person: '0103961589',
  valid_to: tenYears,
  created: today,
  modified: null,
  personal_representative_type_code: personalRepresentativeType1.code,
  contract_id: 'data_for_local_dev',
  external_user_id: 'data_for_local_dev',
}

const personalRepresetatives = [personalRepresentative1]

const personalRepresentativeRight1 = {
  id: uuid(),
  personal_representative_id: personalRepresentative1.id,
  right_type_code: rightType1.code,
  created: today,
  modified: null,
}

const personalRepresentatvieRights = [personalRepresentativeRight1]

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()

    try {
      await queryInterface.bulkInsert(
        'personal_representative_right_type',
        rightTypes,
        {
          transaction,
        },
      )
      await queryInterface.bulkInsert(
        'personal_representative_type',
        personalRepresentativeTypes,
        {
          transaction,
        },
      )
      await queryInterface.bulkInsert(
        'personal_representative',
        personalRepresetatives,
        {
          transaction,
        },
      )
      await queryInterface.bulkInsert(
        'personal_representative_right',
        personalRepresentatvieRights,
        {
          transaction,
        },
      )
    } catch (err) {
      await transaction.rollback()
      throw err
    }

    transaction.commit()
  },

  down: async () => {
    // Do nothing
  },
}
