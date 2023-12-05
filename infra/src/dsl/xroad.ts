import {
  EnvironmentVariables,
  EnvironmentVariableValue,
  Secrets,
  XroadConfig,
} from './types/input-types'
import { json, ref } from './dsl'

export type XroadSectionConfig = {
  secrets?: Secrets
  env?: EnvironmentVariables
}

export class XroadConf<I extends XroadSectionConfig> implements XroadConfig {
  config: XroadSectionConfig

  constructor(config: I) {
    this.config = config
  }

  getEnv(): EnvironmentVariables {
    return this.config.env || {}
  }

  getEnvVarByName(name: keyof I['env']): EnvironmentVariableValue | undefined {
    return this.config.env?.[name]
  }

  getSecrets(): Secrets {
    return this.config.secrets || {}
  }
}

export type XRoadEnvs<T extends XroadSectionConfig> =
  T extends XroadSectionConfig ? keyof T['env'] : never

export const Base = new XroadConf({
  env: {
    XROAD_BASE_PATH: {
      dev: ref((h) => h.svc('http://securityserver.dev01.devland.is')),
      staging: ref((h) => h.svc('http://securityserver.staging01.devland.is')),
      prod: 'http://securityserver.island.is',
      local: ref((h) => h.svc('http://localhost:8081')), // x-road proxy
    },
    XROAD_BASE_PATH_WITH_ENV: {
      dev: ref(
        (h) => `${h.svc('http://securityserver.dev01.devland.is')}/r1/IS-DEV`,
      ),
      staging: 'http://securityserver.staging01.devland.is/r1/IS-TEST',
      prod: 'http://securityserver.island.is/r1/IS',
      local: ref((h) => `${h.svc('http://localhost:8081')}/r1/IS-DEV`), // x-road proxy
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
    XROAD_POLICE_API_PATH: '/Logreglan-Private/rettarvarsla-v1',
  },
  secrets: {
    XROAD_CLIENT_CERT: '/k8s/judicial-system/XROAD_CLIENT_CERT',
    XROAD_CLIENT_KEY: '/k8s/judicial-system/XROAD_CLIENT_KEY',
    XROAD_CLIENT_PEM: '/k8s/judicial-system/XROAD_CLIENT_PEM',
    XROAD_COURTS_CREDENTIALS: '/k8s/judicial-system/COURTS_CREDENTIALS',
    XROAD_POLICE_API_KEY: '/k8s/judicial-system/XROAD_POLICE_API_KEY',
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
    XROAD_DRIVING_LICENSE_V4_PATH: {
      dev: 'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v4',
      staging: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v4',
      prod: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v4',
    },
    XROAD_DRIVING_LICENSE_V5_PATH: {
      dev: 'r1/IS-DEV/GOV/10005/Logreglan-Protected/Okuskirteini-v5',
      staging: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v5',
      prod: 'r1/IS/GOV/5309672079/Logreglan-Protected/Okuskirteini-v5',
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
    XROAD_HEALTH_INSURANCE_MY_PAGES_PATH: {
      dev: 'IS-DEV/GOV/10007/SJUKRA-Protected/minarsidur',
      staging: 'IS-TEST/GOV/4804080550/SJUKRA-Protected/minarsidur',
      prod: 'IS/GOV/4804080550/SJUKRA-Protected/minarsidur',
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
    XROAD_RSK_PROCURING_PATH: {
      dev: 'IS-DEV/GOV/10006/Skatturinn/relationships-v1',
      staging: 'IS-TEST/GOV/5402696029/Skatturinn/relationships-v1',
      prod: 'IS/GOV/5402696029/Skatturinn/relationships-v1',
    },
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
      dev: 'XROAD:/IS-DEV/GOV/10000/island-is/application-callback-v2/application-payment/',
      staging: 'XROAD:',
      prod: 'XROAD:/IS/GOV/5501692829/island-is/application-callback-v2/application-payment/',
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
    XROAD_FINANCES_V2_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v2',
      staging: 'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v2',
      prod: 'IS/GOV/5402697509/FJS-Public/financeServicesFJS_v2',
    },
    XROAD_HMS_LOANS_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/libra-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/libra-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/libra-v1',
    },
  },
})

export const Properties = new XroadConf({
  env: {
    XROAD_PROPERTIES_SERVICE_V2_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/Fasteignir-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/Fasteignir-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/Fasteignir-v1',
    },
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

export const WorkMachines = new XroadConf({
  env: {
    XROAD_WORK_MACHINE_LICENSE_PATH: {
      dev: 'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/vinnuvelar-token',
      staging:
        'IS-TEST/GOV/4201810439/Vinnueftirlitid-Protected/vinnuvelar-token',
      prod: 'IS/GOV/4201810439/Vinnueftirlitid-Protected/vinnuvelar-token',
    },
  },
})

export const JudicialAdministration = new XroadConf({
  env: {
    XROAD_COURT_BANKRUPTCY_CERT_PATH: {
      dev: 'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
      staging: 'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
      prod: 'IS/GOV/4707171140/Domstolasyslan/JusticePortal-v1',
    },
  },
  secrets: {
    DOMSYSLA_PASSWORD: '/k8s/api/DOMSYSLA_PASSWORD',
    DOMSYSLA_USERNAME: '/k8s/api/DOMSYSLA_USERNAME',
  },
})

export const OccupationalLicenses = new XroadConf({
  env: {
    XROAD_HEALTH_DIRECTORATE_PATH: {
      dev: 'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
      staging: 'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
      prod: 'IS/GOV/7101695009/EmbaettiLandlaeknis-Protected/landlaeknir',
    },
  },
})

export const DistrictCommissioners = new XroadConf({
  env: {
    XROAD_DISTRICT_COMMISSIONERS_PATH: {
      dev: 'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
      staging: 'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
      prod: 'IS/GOV/5512201410/Syslumenn-Protected/IslandMinarSidur',
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

export const Disability = new XroadConf({
  env: {
    XROAD_DISABILITY_LICENSE_PATH: {
      dev: 'IS-DEV/GOV/10008/TR-Protected/oryrki-v1',
      staging: 'IS-TEST/GOV/5012130120/TR-Protected/oryrki-v1',
      prod: 'IS/GOV/5012130120/TR-Protected/oryrki-v1',
    },
  },
})

export const EHIC = new XroadConf({
  env: {
    EHIC_XROAD_PROVIDER_ID: {
      dev: 'IS-DEV/GOV/10007/SJUKRA-Protected/ehic',
      staging: 'IS-TEST/GOV/4804080550/SJUKRA-Protected/ehic',
      prod: 'IS/GOV/4804080550/SJUKRA-Protected/ehic',
    },
  },
})

export const UniversityOfIceland = new XroadConf({
  env: {
    XROAD_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10010/HI-Protected/brautskraning-v1',
      staging: 'IS-DEV/EDU/10010/HI-Protected/brautskraning-v1',
      prod: 'IS/EDU/6001692039/HI-Protected/brautskraning-v1',
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

export const NationalRegistryB2C = new XroadConf({
  env: {
    NATIONAL_REGISTRY_B2C_CLIENT_ID: {
      dev: 'b464afdd-056b-406d-b650-6d41733cfeb7',
      staging: 'ca128c23-b43c-443d-bade-ec5a146a933f',
      prod: '2304d7ca-7ed3-4188-8b6d-e1b7e0e3df7f',
    },
    NATIONAL_REGISTRY_B2C_ENDPOINT: {
      dev: 'https://skraidentitydev.b2clogin.com/skraidentitydev.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
      staging:
        'https://skraidentitydev.b2clogin.com/skraidentitystaging.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
      prod: 'https://skraidentity.b2clogin.com/skraidentity.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
    },
    NATIONAL_REGISTRY_B2C_SCOPE: {
      dev: 'https://skraidentitydev.onmicrosoft.com/midlun/.default',
      staging: 'https://skraidentitystaging.onmicrosoft.com/midlun/.default',
      prod: 'https://skraidentity.onmicrosoft.com/midlun/.default',
    },
    NATIONAL_REGISTRY_B2C_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Midlun-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Midlun-v1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Midlun-v1',
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
    XROAD_PAYMENT_SCHEDULE_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/paymentSchedule_v1',
      staging: 'IS-DEV/GOV/10021/FJS-Public/paymentSchedule_v1',
      prod: 'IS/GOV/5402697509/FJS-Public/paymentSchedule_v1',
    },
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

export const VehiclesMileage = new XroadConf({
  env: {
    XROAD_VEHICLES_MILEAGE_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Mileagereading-V1',
      staging:
        'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Mileagereading-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Mileagereading-V1',
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

export const VehicleServiceFjsV1 = new XroadConf({
  env: {
    XROAD_VEHICLE_SERVICE_FJS_V1_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/VehicleServiceFJS_v1',
      staging: 'IS-DEV/GOV/10021/FJS-Public/VehicleServiceFJS_v1',
      prod: 'IS/GOV/5402697509/FJS-Public/VehicleServiceFJS_v1',
    },
  },
})

export const TransportAuthority = new XroadConf({
  env: {
    XROAD_VEHICLE_CODETABLES_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Codetables-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Codetables-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Codetables-V1',
    },
    XROAD_VEHICLE_INFOLOCKS_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Infolocks-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Infolocks-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Infolocks-V1',
    },
    XROAD_VEHICLE_OPERATORS_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Operators-V3',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Operators-V3',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Operators-V3',
    },
    XROAD_VEHICLE_OWNER_CHANGE_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
      staging:
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
    },
    XROAD_VEHICLE_PLATE_ORDERING_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
      staging:
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
    },
    XROAD_VEHICLE_PLATE_RENEWAL_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
      staging:
        'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
    },
    XROAD_VEHICLE_PRINTING_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Printing-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Printing-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Printing-V1',
    },
    XROAD_DIGITAL_TACHOGRAPH_DRIVERS_CARD_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Okuritar-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Okuritar-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Okuritar-V1',
    },
  },
})

export const IcelandicGovernmentInstitutionVacancies = new XroadConf({
  env: {
    XROAD_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Protected/recruitment-v1',
      staging: 'IS-DEV/GOV/10021/FJS-Protected/recruitment-v1',
      prod: 'IS/GOV/5402697509/FJS-Protected/recruitment-v1',
    },
  },
  secrets: {
    ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_USERNAME:
      '/k8s/xroad/client/ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_USERNAME',
    ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PASSWORD:
      '/k8s/xroad/client/ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PASSWORD',
  },
})

export const AircraftRegistry = new XroadConf({
  env: {
    XROAD_AIRCRAFT_REGISTRY_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Loftfaraskra-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Loftfaraskra-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Loftfaraskra-V1',
    },
  },
})

export const HousingBenefitCalculator = new XroadConf({
  env: {
    XROAD_HOUSING_BENEFIT_CALCULATOR_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/calc-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/calc-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/calc-v1',
    },
  },
  secrets: {
    HOUSING_BENEFIT_CALCULATOR_USERNAME:
      '/k8s/xroad/client/HOUSING_BENEFIT_CALCULATOR_USERNAME',
    HOUSING_BENEFIT_CALCULATOR_PASSWORD:
      '/k8s/xroad/client/HOUSING_BENEFIT_CALCULATOR_PASSWORD',
  },
})

export const ShipRegistry = new XroadConf({
  env: {
    XROAD_SHIP_REGISTRY_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/skipaskra-V1',
      staging: 'IS-DEV/GOV/10017/Samgongustofa-Protected/skipaskra-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/skipaskra-V1',
    },
  },
})

export const DirectorateOfImmigration = new XroadConf({
  env: {
    XROAD_DIRECTORATE_OF_IMMIGRATION_PATH: {
      dev: 'IS-DEV/GOV/10011/UTL-Protected/Utl-Umsokn-v1',
      staging: 'IS-DEV/GOV/10011/UTL-Protected/Utl-Umsokn-v1',
      prod: 'IS/GOV/6702696399/UTL-Protected/Utl-Umsokn-v1',
    },
  },
})

export const UniversityGatewayUniversityOfIceland = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10010/HI-Protected/umsoknir-v1',
      staging: 'IS-DEV/EDU/10010/HI-Protected/umsoknir-v1',
      prod: 'IS/EDU/6001692039/HI-Protected/umsoknir-v1',
    },
  },
})

export const SocialInsuranceAdministration = new XroadConf({
  env: {
    TR_XROAD_PATH: {
      dev: 'IS-DEV/GOV/10008/TR-Protected/external-v1/api/protected/v1',
      staging: 'IS-DEV/GOV/10008/TR-Protected/external-v1/api/protected/v1',
      prod: 'IS/GOV/5012130120/TR-Protected/external-v1/api/protected/v1'
    }
  }
})