import { sequelize } from '@island.is/gjafakort/application/extensions'

export const truncate = () =>
  Promise.all(
    Object.values(sequelize.models).map((model) => {
      if (model.tableName.toLowerCase() === 'sequelize') {
        return null
      }

      return model.destroy({
        where: {},
        cascade: true,
        truncate: true,
        force: true,
      })
    }),
  )

beforeEach(() => truncate())

beforeAll(() => sequelize.sync())

afterAll(() => sequelize.close())
