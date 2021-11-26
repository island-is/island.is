const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
  }
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative',
  }
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
