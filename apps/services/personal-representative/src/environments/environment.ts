import { ChildServiceApiKeys } from '../app/modules/consts/childServices'

const devConfig = {
  production: false,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
  },
  childServiceApiKeys: {
    [ChildServiceApiKeys.felagsmalaraduneytid]:
      ChildServiceApiKeys.felagsmalaraduneytid,
  },
}

const prodConfig = {
  production: true,
  audit: {
    defaultNamespace: '@island.is/personal-representative',
    groupName: process.env.AUDIT_GROUP_NAME,
    serviceName: 'services-personal-representative',
  },
  childServiceApiKeys: {
    [ChildServiceApiKeys.felagsmalaraduneytid]:
      process.env.FELAGSMALARADUNEYTI_API_KEY,
  },
}

export default process.env.NODE_ENV === 'production' ? prodConfig : devConfig
