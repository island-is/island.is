import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'

import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'

import { testServer, TestServerOptions } from '@island.is/infra-nest-server'

import { AppModule } from '../src/app'

// A bit of a hack for now, until we simulate login in tests
export const user = {
  id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
  nationalId: '1112902539',
  name: 'Ívar Oddsson',
  title: 'héraðsdómari',
  mobileNumber: '6904031',
  email: 'ivaro@kolibri.is',
  role: 'JUDGE',
}

jest.mock('pdfkit', function () {
  class MockPDFDocument {
    pipe(stream) {
      return stream
    }
    font() {
      return this
    }
    fontSize() {
      return this
    }
    lineGap() {
      return this
    }
    text() {
      return this
    }
    end() {
      return this
    }
  }
  return {
    default: MockPDFDocument,
  }
})

jest.mock('stream-buffers', function () {
  class MockWritableStreamBuffer {
    on(_, fn) {
      fn()
    }
    getContentsAsString() {
      // eslint-disable-line @typescript-eslint/no-empty-function
    }
  }
  return {
    default: {
      WritableStreamBuffer: MockWritableStreamBuffer,
    },
  }
})

let app: INestApplication
let sequelize: Sequelize

const truncate = () => {
  if (!sequelize) {
    return
  }

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
}

export const setup = async (options?: Partial<TestServerOptions>) => {
  app = await testServer({
    appModule: AppModule,
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  // Need to use sequelize-cli becuase sequelize.sync does not keep track of completed migrations
  // await sequelize.sync()
  execSync('yarn nx run judicial-system-backend:migrate')

  // Seed the database
  execSync('yarn nx run judicial-system-backend:seed')

  return app
}

beforeAll(() => truncate())

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
