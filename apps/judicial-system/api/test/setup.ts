import { Sequelize } from 'sequelize-typescript'
import { execSync } from 'child_process'

import { getConnectionToken } from '@nestjs/sequelize'
import {
  INestApplication,
  Type,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common'

import { testServer, TestServerOptions } from '@island.is/infra-nest-server'

import { JwtAuthGuard } from '../src/app/modules/auth'
import { AppModule } from '../src/app'

// A bit of a hack for now, until we simulate login in tests
export const user = {
  id: '9c0b4106-4213-43be-a6b2-ff324f4ba0c2',
  nationalId: '1112902539',
  name: 'Ívar Oddsson',
  title: 'héraðsdómari',
  mobileNumber: '6904031',
  role: 'JUDGE',
}

jest.mock('pug', function () {
  return {
    default: {
      compileFile: function () {
        return function () {
          return 'html'
        }
      },
    },
  }
})

jest.mock('puppeteer', function () {
  return {
    default: {
      launch: function () {
        return {
          newPage: function () {
            return {
              setContent: function () {
                return
              },
              pdf: function () {
                return 'pdf'
              },
            }
          },
          close: function () {
            return
          },
        }
      },
    },
  }
})

const noGuard: CanActivate = {
  canActivate: jest.fn(async (context: ExecutionContext) => {
    // Fake the logged in user - move somewhere else!!!
    const request = context.switchToHttp().getRequest()
    request.user = request.user || user
    return true
  }),
}

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
    override: (builder) =>
      builder.overrideGuard(JwtAuthGuard).useValue(noGuard),
    ...options,
  })
  sequelize = await app.resolve(getConnectionToken() as Type<Sequelize>)

  // Need to use sequelize-cli becuase sequelize.sync does not keep track of completed migrations
  // await sequelize.sync()
  execSync('yarn nx run judicial-system-api:migrate')

  // Seed the database
  execSync('yarn nx run judicial-system-api:seed')

  return app
}

beforeAll(() => truncate())

afterAll(async () => {
  if (app && sequelize) {
    await app.close()
    await sequelize.close()
  }
})
