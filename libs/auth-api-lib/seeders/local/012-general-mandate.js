const { uuid } = require('uuidv4')

module.exports = {
  up: async (queryInterface) => {
    const transaction = await queryInterface.sequelize.transaction()
    const id = uuid()

    try {
      await queryInterface.bulkInsert(
        'delegation',
        [
          {
            id,
            to_national_id: '0101302399',
            from_national_id: '0101307789',
            from_display_name: 'Gervimaður útlönd',
            to_name: 'Gervimaður Færeyjar',
          },
        ],
        { transaction },
      )

      await queryInterface.bulkInsert(
        'delegation_delegation_type',
        [
          {
            delegation_id: id,
            delegation_type_id: 'GeneralMandate',
          },
        ],
        { transaction },
      )

      await transaction.commit()
    } catch (err) {
      await transaction.rollback()
      console.log(err)
      throw err
    }
  },
  down: async () => {
    // Do nothing
  },
}
