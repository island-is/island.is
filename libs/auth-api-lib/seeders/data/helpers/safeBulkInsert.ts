import { QueryInterface } from 'sequelize'

export const safeBulkInsert = async <T extends object>(
  queryInterface: QueryInterface,
  tableName: string,
  records: T[],
  getDescriptor: (record: T) => string,
) => {
  for (const record of records) {
    const descriptor = getDescriptor(record)
    try {
      await queryInterface.bulkInsert(tableName, [record])
      console.log(`Success ${descriptor}.`)
    } catch (error) {
      let message = error.message
      let ignored = false
      if (error.name === 'SequelizeUniqueConstraintError') {
        ignored = true
        if (error.original?.detail) {
          message = error.original?.detail
        }
      }

      console.warn(`Error ${descriptor}: ${message}`)
      if (!ignored) {
        throw error
      }
    }
  }
}
