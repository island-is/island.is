import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'

import { getConnectionToken } from '@nestjs/sequelize'
import { INestApplication, Type } from '@nestjs/common'

import { testServer, TestServerOptions } from '@island.is/infra-nest-server'

import { AppModule } from '../src/app'

jest.mock('pdfkit', function () {
  class MockPDFDocument {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    pipe(stream: any) {
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
    bufferedPageRange() {
      return this
    }
    end() {
      return this
    }
  }

  return MockPDFDocument
})

jest.mock('stream-buffers', function () {
  class MockWritableStreamBuffer {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    on(_: any, fn: () => void) {
      fn()
    }
    getContentsAsString() {
      return ''
    }
    getContents() {
      // eslint-disable-line @typescript-eslint/no-empty-function
    }
  }

  return {
    WritableStreamBuffer: MockWritableStreamBuffer,
  }
})

let app: INestApplication
let sequelize: Sequelize

const truncate = async () => {
  if (!sequelize) {
    return
  }

  await Promise.all(
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

beforeAll(truncate)

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
