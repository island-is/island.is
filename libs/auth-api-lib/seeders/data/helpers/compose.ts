import { QueryInterface } from 'sequelize'

export const compose =
  <T extends (queryInterface: QueryInterface) => Promise<unknown>>(
    ...handlers: T[]
  ) =>
  async (queryInterface: QueryInterface) => {
    for (const handler of handlers) {
      await handler(queryInterface)
    }
  }
