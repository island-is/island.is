import { sequelize } from '@island.is/application/extensions'
import application from '@island.is/application/api/domains/applications/model'

const models = [application]

export const truncate = () => {
  Promise.all(
    models.map((model) => {
      if (['sequelize', 'Sequelize'].includes(model.tableName)) {
        return null
      }

      return model.destroy({ where: {}, force: true })
    }),
  )
}

beforeEach(() => truncate())

beforeAll(() => sequelize.sync())

afterAll(() => sequelize.close())
