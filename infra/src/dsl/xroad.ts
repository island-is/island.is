import { EnvironmentVariables, Secrets, XroadConfig } from './types/input-types'
import { json } from './dsl'

type XroadSectionConfig = {
  secrets?: Secrets
  env?: EnvironmentVariables
}

export class XroadConf implements XroadConfig {
  config: XroadSectionConfig

  constructor(config: XroadSectionConfig) {
    this.config = config
  }
  getEnv(): EnvironmentVariables {
    return this.config.env || {}
  }
  getSecrets(): Secrets {
    return this.config.secrets || {}
  }
}

export const Base = new XroadConf({
  env: {
    XROAD_BASE_PATH: {
      dev: 'http://securityserver.dev01.devland.is',
      staging: 'http://securityserver.staging01.devland.is',
      prod: 'http://securityserver.island.is',
    },
    XROAD_BASE_PATH_WITH_ENV: {
      dev: 'http://securityserver.dev01.devland.is/r1/IS-DEV',
      staging: 'http://securityserver.staging01.devland.is/r1/IS-TEST',
      prod: 'http://securityserver.island.is/r1/IS',
    },
    XROAD_TLS_BASE_PATH: {
      dev: 'https://securityserver.dev01.devland.is',
      staging: 'https://securityserver.staging01.devland.is',
      prod: 'https://securityserver.island.is',
    },
    XROAD_TLS_BASE_PATH_WITH_ENV: {
      dev: 'https://securityserver.dev01.devland.is/r1/IS-DEV',
      staging: 'https://securityserver.staging01.devland.is/r1/IS-TEST',
      prod: 'https://securityserver.island.is/r1/IS',
    },
  },
})

export const Client = new XroadConf({
  env: {
    XROAD_CLIENT_ID: {
      dev: 'IS-DEV/GOV/10000/island-is-client',
      staging: 'IS-TEST/GOV/5501692829/island-is-client',
      prod: 'IS/GOV/5501692829/island-is-client',
    },
  },
})

export const JudicialSystem = new XroadConf({
  env: {
    XROAD_CLIENT_ID: {
      dev: 'IS-DEV/GOV/10014/Rettarvorslugatt-Client',
      staging: 'IS-TEST/GOV/5804170510/Rettarvorslugatt-Client',
      prod: 'IS/GOV/5804170510/Rettarvorslugatt-Client',
    },
    XROAD_COURT_MEMBER_CODE: {
      dev: '10019',
      staging: '4707171140',
      prod: '4707171140',
    },
    XROAD_POLICE_MEMBER_CODE: {
      dev: '10005',
      staging: '5309672079',
      prod: '5309672079',
    },
    XROAD_COURT_API_PATH: '/Domstolasyslan/JusticePortal-v1',
    XROAD_POLICE_API_PATH: '/Logreglan-Private/loke-api-v1',
  },
  secrets: {
    XROAD_CLIENT_CERT: '/k8s/judicial-system/XROAD_CLIENT_CERT',
    XROAD_CLIENT_KEY: '/k8s/judicial-system/XROAD_CLIENT_KEY',
    XROAD_CLIENT_PEM: '/k8s/judicial-system/XROAD_CLIENT_PEM',
    XROAD_COURTS_CREDENTIALS: '/k8s/judicial-system/COURTS_CREDENTIALS',
  },
})

export const DrivingLicense = new XroadConf({
  env: {
    XROAD_DRIVING_LICENSE_PATH: {
      dev: 'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1',
      staging:
        'r1/IS/GOV/5309672079/Logreglan-Protected/RafraentOkuskirteini-v1',
      prod: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v1',
    },
    XROAD_DRIVING_LICENSE_V2_PATH: {
      dev: 'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v2',
      staging:
        'r1/IS/GOV/5309672079/Logreglan-Protected/RafraentOkuskirteini-v2',
      prod: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v1',
    },
  },
  secrets: {
    XROAD_DRIVING_LICENSE_SECRET: '/k8s/api/DRIVING_LICENSE_SECRET',
  },
})

export const HealthInsurance = new XroadConf({
  env: {
    XROAD_HEALTH_INSURANCE_WSDLURL: {
      dev: 'https://test-huld.sjukra.is/islandrg?wsdl',
      staging: 'https://test-huld.sjukra.is/islandrg?wsdl',
      prod: 'https://huld.sjukra.is/islandrg?wsdl',
    },
    XROAD_HEALTH_INSURANCE_ID: {
      dev: 'IS-DEV/GOV/10007/SJUKRA-Protected',
      staging: 'IS-TEST/GOV/4804080550/SJUKRA-Protected',
      prod: 'IS/GOV/4804080550/SJUKRA-Protected',
    },
  },
  secrets: {
    XROAD_HEALTH_INSURANCE_USERNAME: '/k8s/health-insurance/XROAD-USER',
    XROAD_HEALTH_INSURANCE_PASSWORD: '/k8s/health-insurance/XROAD-PASSWORD',
    XROAD_HEALTH_INSURANCE_V2_XROAD_USERNAME:
      '/k8s/api/HEALTH_INSURANCE_V2_XROAD_USERNAME',
    XROAD_HEALTH_INSURANCE_V2_XROAD_PASSWORD:
      '/k8s/api/HEALTH_INSURANCE_V2_XROAD_PASSWORD',
  },
})

export const RskProcuring = new XroadConf({
  env: {
    XROAD_RSK_PROCURING_REDIS_NODES: {
      dev:
        '["clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379"]',
      staging:
        '["clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379"]',
      prod:
        '["clustercfg.general-redis-cluster-group.dnugi2.euw1.cache.amazonaws.com:6379"]',
    },
    XROAD_RSK_PROCURING_PATH: {
      dev: 'IS-DEV/GOV/10006/Skatturinn/prokura-v1',
      staging: 'IS-TEST/GOV/5402696029/Skatturinn/prokura-v1',
      prod: 'IS/GOV/5402696029/Skatturinn/prokura-v1',
    },
  },
  secrets: {
    RSK_USERNAME: '/k8s/xroad/client/RSK/USERNAME',
    RSK_PASSWORD: '/k8s/xroad/client/RSK/PASSWORD',
  },
})

export const Payment = new XroadConf({
  env: {
    XROAD_PAYMENT_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10021/FJS-Public',
      staging: 'IS-TEST/GOV/10021/FJS-DEV-Public',
      prod: 'IS/GOV/5402697509/FJS-Public',
    },
    XROAD_PAYMENT_BASE_CALLBACK_URL: {
      dev: 'XROAD:/IS-DEV/GOV/10000/island-is/application-payment-v1/',
      staging: 'XROAD:',
      prod: 'XROAD:/IS/GOV/5501692829/island-is/application-payment-v1/',
    },
    XROAD_PAYMENT_ADDITION_CALLBACK_URL: '/',
  },
  secrets: {
    XROAD_PAYMENT_USER: '/k8s/application-system-api/PAYMENT_USER',
    XROAD_PAYMENT_PASSWORD: '/k8s/application-system-api/PAYMENT_PASSWORD',
  },
})

export const Finance = new XroadConf({
  env: {
    XROAD_FINANCES_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/financeIsland',
      staging: 'IS-DEV/GOV/10021/FJS-Public/financeIsland',
      prod: 'IS/GOV/5402697509/FJS-Public/financeIsland',
    },
  },
})

export const Properties = new XroadConf({
  env: {
    XROAD_PROPERTIES_SERVICE_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Protected/Fasteignir-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Fasteignir-v1',
      prod: 'IS/GOV/6503760649/SKRA-Protected/Fasteignir-v1',
    },
    XROAD_PROPERTIES_SERVICE_V2_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/Fasteignir-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/Fasteignir-v1',
      prod:
        'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/Fasteignir-v1',
    },
    // Deprecated:
    XROAD_PROPERTIES_API_PATH: '/SKRA-Protected/Fasteignir-v1',
  },
  secrets: {
    XROAD_PROPERTIES_CLIENT_SECRET:
      '/k8s/xroad/client/NATIONAL-REGISTRY/IDENTITYSERVER_SECRET',
  },
})

export const AdrAndMachine = new XroadConf({
  env: {
    XROAD_ADR_MACHINE_LICENSE_PATH: {
      dev: 'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/rettindi-token-v1',
      staging:
        'IS-TEST/GOV/4201810439/Vinnueftirlitid-Protected/rettindi-token-v1',
      prod: 'IS/GOV/4201810439/Vinnueftirlitid-Protected/rettindi-token-v1',
    },
  },
})

export const Firearm = new XroadConf({
  env: {
    XROAD_FIREARM_LICENSE_PATH: {
      dev: 'IS-DEV/GOV/10005/Logreglan-Protected/island-api-v1',
      staging: 'IS/GOV/5309672079/Logreglan-Protected/island-api-v1',
      prod: 'IS/GOV/5309672079/Logreglan-Protected/island-api-v1',
    },
  },
})

export const Education = new XroadConf({
  env: {
    XROAD_MMS_LICENSE_SERVICE_ID: {
      dev: 'IS-DEV/EDU/10020/MMS-Protected/license-api-v1',
      staging: 'IS-TEST/EDU/5708150320/MMS-Protected/license-api-v1',
      prod: 'IS/EDU/5708150320/MMS-Protected/license-api-v1',
    },
    XROAD_MMS_GRADE_SERVICE_ID: {
      dev: 'IS-DEV/EDU/10020/MMS-Protected/grade-api-v1',
      staging: 'IS-TEST/EDU/5708150320/MMS-Protected/grade-api-v1',
      prod: 'IS/EDU/5708150320/MMS-Protected/grade-api-v1',
    },
  },
})

export const NationalRegistry = new XroadConf({
  env: {
    XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Protected/Einstaklingar-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
      prod: 'IS/GOV/6503760649/SKRA-Protected/Einstaklingar-v1',
    },
    XROAD_NATIONAL_REGISTRY_REDIS_NODES: {
      dev: json([
        'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
      ]),
      staging: json([
        'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
      ]),
      prod: json([
        'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      ]),
    },
    // Deprecated:
    XROAD_TJODSKRA_API_PATH: '/SKRA-Protected/Einstaklingar-v1',
    XROAD_TJODSKRA_MEMBER_CODE: {
      prod: '6503760649',
      dev: '10001',
      staging: '6503760649',
    },
  },
})

export const Passports = new XroadConf({
  env: {
    XROAD_PASSPORT_LICENSE_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Protected/Forskraning-V1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Protected/Forskraning-V1',
      prod: 'IS/GOV/6503760649/SKRA-Protected/Forskraning-V1',
    },
  },
})

export const Labor = new XroadConf({
  env: {
    XROAD_VMST_API_PATH: {
      dev: '/VMST-ParentalLeave-Protected/ParentalLeaveApplication-v1',
      staging: '/VMST-ParentalLeave-Protected/ParentalLeaveApplication-v1',
      prod: '/VMST-ParentalLeave-Protected/ParentalLeaveApplication-v1',
    },
    XROAD_VMST_MEMBER_CODE: {
      dev: '10003',
      staging: '7005942039',
      prod: '7005942039',
    },
  },
  secrets: {
    XROAD_VMST_API_KEY: '/k8s/vmst-client/VMST_API_KEY',
  },
})

export const PaymentSchedule = new XroadConf({
  env: {
    PAYMENT_SCHEDULE_XROAD_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10021/FJS-Public',
      staging: 'IS-DEV/GOV/10021/FJS-Public',
      prod: 'IS/GOV/5402697509/FJS-Public',
    },
  },
  secrets: {
    PAYMENT_SCHEDULE_USER: '/k8s/api/PAYMENT_SCHEDULE_USER',
    PAYMENT_SCHEDULE_PASSWORD: '/k8s/api/PAYMENT_SCHEDULE_PASSWORD',
  },
})

export const CriminalRecord = new XroadConf({
  env: {
    XROAD_CRIMINAL_RECORD_PATH: {
      dev: 'r1/IS-DEV/GOV/10005/Logreglan-Protected/Sakavottord-PDF-v2',
      staging: 'r1/IS/GOV/5309672079/Logreglan-Protected/Sakaskra-v1',
      prod: 'r1/IS/GOV/5309672079/Logreglan-Protected/Sakaskra-v1',
    },
  },
})

export const RskCompanyInfo = new XroadConf({
  env: {
    COMPANY_REGISTRY_XROAD_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10006/Skatturinn/ft-v1',
      staging: 'IS-TEST/GOV/5402696029/Skatturinn/ft-v1',
      prod: 'IS/GOV/5402696029/Skatturinn/ft-v1',
    },
    COMPANY_REGISTRY_REDIS_NODES: {
      dev: json([
        'clustercfg.general-redis-cluster-group.5fzau3.euw1.cache.amazonaws.com:6379',
      ]),
      staging: json([
        'clustercfg.general-redis-cluster-group.ab9ckb.euw1.cache.amazonaws.com:6379',
      ]),
      prod: json([
        'clustercfg.general-redis-cluster-group.whakos.euw1.cache.amazonaws.com:6379',
      ]),
    },
  },
})

export const DataProtectionComplaint = new XroadConf({
  env: {
    DATA_PROTECTION_COMPLAINT_XROAD_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10026/gopro/kvortun-v1',
      staging: 'IS-TEST/GOV/5608002820/gopro/kvortun-v1',
      prod: 'IS/GOV/5608002820/gopro/kvortun-v1',
    },
  },
  secrets: {
    DATA_PROTECTION_COMPLAINT_API_USERNAME:
      '/k8s/xroad/client/DATA_PROTECTION_COMPLAINT_API_USERNAME',
    DATA_PROTECTION_COMPLAINT_API_PASSWORD:
      '/k8s/xroad/client/DATA_PROTECTION_COMPLAINT_API_PASSWORD',
  },
})

export const DrivingLicenseBook = new XroadConf({
  env: {},
  secrets: {
    DRIVING_LICENSE_BOOK_XROAD_PATH: '/k8s/api/DRIVING_LICENSE_BOOK_XROAD_PATH',
    DRIVING_LICENSE_BOOK_USERNAME: '/k8s/api/DRIVING_LICENSE_BOOK_USERNAME',
    DRIVING_LICENSE_BOOK_PASSWORD: '/k8s/api/DRIVING_LICENSE_BOOK_PASSWORD',
  },
})

export const FishingLicense = new XroadConf({
  env: {
    FISHING_LICENSE_XROAD_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10012/Fiskistofa-Protected/veidileyfi-v1',
      staging: 'IS-TEST/GOV/6608922069/Fiskistofa-Protected/veidileyfi-v1',
      prod: 'IS/GOV/6608922069/Fiskistofa-Protected/veidileyfi-v1',
    },
  },
})

export const MunicipalitiesFinancialAid = new XroadConf({
  env: {
    XROAD_FINANCIAL_AID_BACKEND_PATH: {
      dev: 'IS-DEV/MUN/10023/samband-sveitarfelaga/financial-aid-backend',
      staging:
        'IS-TEST/MUN/5502694739/samband-sveitarfelaga/financial-aid-backend',
      prod: 'IS/MUN/5502694739/samband-sveitarfelaga/financial-aid-backend',
    },
  },
})

export const Vehicles = new XroadConf({
  env: {
    XROAD_VEHICLES_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Mitt-Svaedi-V1',
      staging: 'IS/GOV/5405131040/Samgongustofa-Protected/Mitt-Svaedi-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Mitt-Svaedi-V1',
    },
  },
})

export const ChargeFjsV2 = new XroadConf({
  env: {
    XROAD_CHARGE_FJS_V2_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
      staging: 'IS-DEV/GOV/10021/FJS-Public/chargeFJS_v2',
      prod: 'IS/GOV/5402697509/FJS-Public/chargeFJS_v2',
    },
  },
})
