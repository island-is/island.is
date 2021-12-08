import { ExternalServiceProvidersApiKeys } from '../app/modules/consts/external-service-providers'

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative-external',
  },
  externalServiceProvidersApiKeys: {
    [ExternalServiceProvidersApiKeys.heilsuvera]:
      ExternalServiceProvidersApiKeys.heilsuvera,
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative-external',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative-external',
  },
  externalServiceProvidersApiKeys: {
    [ExternalServiceProvidersApiKeys.heilsuvera]:
      process.env.HEILSUVERA_API_KEY,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
