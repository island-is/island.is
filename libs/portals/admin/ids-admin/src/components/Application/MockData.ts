export const MockApplicationItem = {
  tag: 'Web Application',
  name: 'My App name',
  availableEnvironments: {
    development: {
      basicInfo: {
        applicationId: '@hugverk.is/web/hugverkastofa-dev',
        applicationSecret: 'secret',
        idsURL: 'http://innskra.island.is',
      },
      translations: [
        {
          locale: 'is',
          displayName: 'Mitt App - Dev',
        },
        {
          locale: 'en',
          displayName: 'My App - Dev',
        },
      ],
      applicationUrls: {
        callBackUrl: [
          'http://localhost:4200/callbackdev',
          'http://localhost:4200/callback2dev',
        ],
        logoutUrl: [
          'http://localhost:4200/logout',
          'http://localhost:4200/logout2',
        ],
        cors: ['http://localhost:4200', 'http://localhost:4200'],
      },
      lifeTime: {
        absoluteLifeTime: 2592000,
        inactivityExpiration: false,
        inactivityLifeTime: 1296000,
      },
    },
    staging: {
      basicInfo: {
        applicationId: '@hugverk.is/web/hugverkastofa-staging',
        applicationSecret: 'secret',
        idsURL: 'http://innskra.island.is',
      },
      translations: [
        {
          locale: 'is',
          displayName: 'Mitt App - Staging',
        },
        {
          locale: 'en',
          displayName: 'My App - Staging',
        },
      ],
      applicationUrls: {
        callBackUrl: [
          'http://localhost:4200/callback',
          'http://localhost:4200/callback2',
        ],
        logoutUrl: [
          'http://localhost:4200/logout',
          'http://localhost:4200/logout2',
        ],
        cors: ['http://localhost:4200', 'http://localhost:4200'],
      },
      lifeTime: {
        absoluteLifeTime: 2592000,
        inactivityExpiration: false,
        inactivityLifeTime: 1296000,
      },
    },
    production: {
      basicInfo: {
        applicationId: '@hugverk.is/web/hugverkastofa-prod',
        applicationSecret: 'secret',
        idsURL: 'http://innskra.island.is',
      },
      translations: [
        {
          locale: 'is',
          displayName: 'Mitt App - Prod',
        },
        {
          locale: 'en',
          displayName: 'My App - Prod',
        },
      ],
      applicationUrls: {
        callBackUrl: [],
        logoutUrl: [],
        cors: [],
      },
      lifeTime: {
        absoluteLifeTime: 2592000,
        inactivityExpiration: false,
        inactivityLifeTime: 1296000,
      },
    },
  },
}

export const MockEnvironments = ['Production', 'Development', 'Staging']
