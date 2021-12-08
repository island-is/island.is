import { AppModule } from '../src/app/app.module'
import { testServer, useDatabase, TestApp } from '@island.is/testing/nest'
import { SequelizeConfigService } from '@island.is/auth-api-lib/personal-representative'

// needed for generic error validation
expect.extend({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  anyOf(value: any, classTypes: any[]) {
    const types = classTypes.map((type) => type.name).join(', ')
    const message = `expected to be any of type: ${types}`
    for (let i = 0; i < classTypes.length; i++) {
      if (value.constructor === classTypes[i]) {
        return {
          pass: true,
          message: () => message,
        }
      }
    }

    return {
      pass: false,
      message: () => message,
    }
  },
})

export const setupWithoutAuth = async (): Promise<TestApp> => {
  const app = await testServer<AppModule>({
    appModule: AppModule,
    hooks: [useDatabase({ type: 'sqlite', provider: SequelizeConfigService })],
  })

  return app
}
