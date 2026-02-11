import { json, ref } from './dsl'
import {
  EnvironmentVariables,
  EnvironmentVariableValue,
  Secrets,
  XroadConfig,
} from './types/input-types'

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
    XROAD_DMR_MEMBER_CODE: {
      dev: '10014',
      staging: '5804170510',
      prod: '5804170510',
    },
    XROAD_COURT_API_PATH: '/Domstolasyslan/JusticePortal-v1',
    XROAD_POLICE_API_PATH: '/Logreglan-Private/rettarvarsla-v1',
    XROAD_DMR_CRIMINAL_RECORD_API_PATH: {
      dev: '/DMR-Protected/sakaskra-dev',
      staging: '/DMR-Protected/sakaskra-dev',
      prod: '/DMR-Protected/sakaskra',
    },
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

export const RskCarRentalRate = new XroadConf({
  env: {
    XROAD_RSK_RENTAL_RATE_PATH: {
      dev: 'IS-DEV/GOV/10006/Skatturinn/rentaldayrate-v1',
      staging: 'IS-TEST/GOV/5402696029/Skatturinn/rentaldayrate-v1',
      prod: 'IS/GOV/5402696029/Skatturinn/rentaldayrate-v1',
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
      staging: 'IS-TEST/GOV/10021/FJS-Public/financeIsland',
      prod: 'IS/GOV/5402697509/FJS-Public/financeIsland',
    },
    XROAD_FINANCES_V2_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/financeServicesFJS_v2',
      staging: 'IS-TEST/GOV/10021/FJS-Public/financeServicesFJS_v2',
      prod: 'IS/GOV/5402697509/FJS-Public/financeServicesFJS_v2',
    },
    XROAD_HMS_LOANS_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/libra-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/libra-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/libra-v1',
    },
    XROAD_HMS_HOUSING_BENEFITS_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/husbot-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/husbot-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/husbot-v1',
    },
  },
})

export const FireCompensation = new XroadConf({
  env: {
    XROAD_HMS_APPLICATION_SYSTEM_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/formbuilder-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/formbuilder-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/formbuilder-v1',
    },
    XROAD_HMS_APPLICATION_SYSTEM_CLIENT_HEADER: {
      dev: 'IS-DEV/GOV/10000/island-is-client',
      staging: 'IS-TEST/GOV/5501692829/test-client',
      prod: 'IS/GOV/5501692829/island-is-client',
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

export const PropertySearch = new XroadConf({
  env: {
    XROAD_HMS_PROPERTY_SEARCH_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/fasteignir-v2-beta',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/fasteignir-v2-beta',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/Fasteignir-v2',
    },
    XROAD_HMS_PROPERTY_SEARCH_CLIENT_HEADER: {
      dev: 'IS-DEV/GOV/10000/island-is-client',
      staging: 'IS-TEST/GOV/5501692829/test-client',
      prod: 'IS/GOV/5501692829/island-is-client',
    },
  },
})

export const RentalService = new XroadConf({
  env: {
    XROAD_HMS_RENTAL_SERVICE_PATH: {
      dev: 'IS-DEV/GOV/10033/HMS-Protected/Leigusamningar-v1',
      staging: 'IS-TEST/GOV/5812191480/HMS-Protected/Leigusamningar-v1',
      prod: 'IS/GOV/5812191480/Husnaeds-og-mannvirkjastofnun-Protected/Leigusamningar-v1',
    },
    XROAD_HMS_RENTAL_SERVICE_CLIENT_HEADER: {
      dev: 'IS-DEV/GOV/10000/island-is-client',
      staging: 'IS-TEST/GOV/5501692829/test-client',
      prod: 'IS/GOV/5501692829/island-is-client',
    },
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

export const SeminarsVer = new XroadConf({
  env: {
    XROAD_SEMINARS_VER_PATH: {
      dev: 'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/namskeid',
      staging: 'IS-TEST/GOV/4201810439/Vinnueftirlitid-Protected/namskeid',
      prod: 'IS/GOV/4201810439/Vinnueftirlitid-Protected/namskeid',
    },
  },
})

export const WorkAccidents = new XroadConf({
  env: {
    XROAD_WORK_ACCIDENT_PATH: {
      dev: 'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/slysaskraning-token',
      staging:
        'IS-TEST/GOV/4201810439/Vinnueftirlitid-Protected/slysaskraning-token',
      prod: 'IS/GOV/4201810439/Vinnueftirlitid-Protected/slysaskraning-token',
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

export const PracticalExams = new XroadConf({
  env: {
    XROAD_PRACTICAL_EXAMS_PATH: {
      dev: 'IS-DEV/GOV/10013/Vinnueftirlitid-Protected/verkleg-prof-token',
      staging:
        'IS-TEST/GOV/4201810439/Vinnueftirlitid-Protected/verkleg-prof-token',
      prod: 'IS/GOV/4201810439/Vinnueftirlitid-Protected/verkleg-prof-token',
    },
  },
})

export const JudicialAdministration = new XroadConf({
  env: {
    XROAD_COURT_BANKRUPTCY_CERT_PATH: {
      dev: 'IS-DEV/GOV/10019/Domstolasyslan/JusticePortal-v1',
      staging: 'IS-TEST/GOV/10019/Domstolasyslan/JusticePortal-v1',
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
      staging: 'IS-TEST/GOV/10015/EmbaettiLandlaeknis-Protected/landlaeknir',
      prod: 'IS/GOV/7101695009/EmbaettiLandlaeknis-Protected/landlaeknir',
    },
  },
})

export const DistrictCommissionersPCard = new XroadConf({
  env: {
    XROAD_DISTRICT_COMMISSIONERS_P_CARD_PATH: {
      dev: 'IS-DEV/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
      staging: 'IS-TEST/GOV/10016/Syslumenn-Protected/IslandMinarSidur',
      prod: 'IS/GOV/5512201410/Syslumenn-Protected/IslandMinarSidur',
    },
  },
})
export const DistrictCommissionersLicenses = new XroadConf({
  env: {
    XROAD_DISTRICT_COMMISSIONERS_LICENSES_PATH: {
      dev: 'IS-DEV/GOV/10016/Syslumenn-Protected/RettindiIslandis',
      staging: 'IS-TEST/GOV/10016/Syslumenn-Protected/RettindiIslandis',
      prod: 'IS/GOV/5512201410/Syslumenn-Protected/RettindiIslandis',
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

export const PoliceCases = new XroadConf({
  env: {
    XROAD_POLICE_CASES_PATH: {
      dev: 'IS-DEV/GOV/10005/Logreglan-Protected/MittLogreglanApi-v1',
      staging: 'IS/GOV/5309672079/Logreglan-Protected/MittLogreglanApi-v1',
      prod: 'IS/GOV/5309672079/Logreglan-Protected/MittLogreglanApi-v1',
    },
  },
})

export const NVSPermits = new XroadConf({
  env: {
    XROAD_NVS_PERMITS_PATH: {
      dev: 'IS-DEV/GOV/10085/NVS-Protected/api',
      staging: 'IS-TEST/GOV/10085/NVS-Protected/api',
      prod: 'IS/GOV/7009241570/NVS-Protected/api',
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

export const UniversityCareers = new XroadConf({
  env: {
    XROAD_UNIVERSITY_OF_AKUREYRI_PATH: {
      dev: 'IS-DEV/EDU/10054/UNAK-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10054/UNAK-Protected/brautskraning-v1',
      prod: 'IS/EDU/5206871229/UNAK-Protected/brautskraning-v1',
    },
    XROAD_AGRICULTURAL_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10056/LBHI-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10056/LBHI-Protected/brautskraning-v1',
      prod: 'IS/EDU/4112043590/LBHI-Protected/brautskraning-v1',
    },
    XROAD_BIFROST_UNIVERSITY_PATH: {
      dev: 'IS-DEV/EDU/10057/Bifrost-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10057/Bifrost-Protected/brautskraning-v1',
      prod: 'IS/EDU/5502690239/Bifrost-Protected/brautskraning-v1',
    },
    XROAD_HOLAR_UNIVERSITY_PATH: {
      dev: 'IS-DEV/EDU/10055/Holar-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10055/Holar-Protected/brautskraning-v1',
      prod: 'IS/EDU/5001694359/Holar-Protected/brautskraning-v1',
    },
    XROAD_ICELAND_UNIVERSITY_OF_THE_ARTS_PATH: {
      dev: 'IS-DEV/EDU/10049/LHI-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10049/LHI-Protected/brautskraning-v1',
      prod: 'IS/EDU/4210984099/LHI-Protected/brautskraning-v1',
    },
    XROAD_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10010/HI-Protected/brautskraning-v1',
      staging: 'IS-TEST/EDU/10010/HI-Protected/brautskraning-v1',
      prod: 'IS/EDU/6001692039/HI-Protected/brautskraning-v1',
    },
  },
})

export const Education = new XroadConf({
  env: {
    XROAD_MMS_LICENSE_SERVICE_ID: {
      dev: 'IS-DEV/GOV/10066/MMS-Protected/license-api-v1',
      staging: 'IS-TEST/GOV/6601241280/MMS-Protected/license-api-v1',
      prod: 'IS/GOV/6601241280/MMS-Protected/license-api-v1',
    },
    XROAD_MMS_GRADE_SERVICE_ID: {
      dev: 'IS-DEV/GOV/10066/MMS-Protected/grade-api-v1',
      staging: 'IS-TEST/GOV/6601241280/MMS-Protected/grade-api-v1',
      prod: 'IS/GOV/6601241280/MMS-Protected/grade-api-v1',
    },
  },
})

export const NationalRegistry = new XroadConf({
  env: {
    XROAD_NATIONAL_REGISTRY_SERVICE_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Einstaklingar-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Einstaklingar-v1',
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
    XROAD_TJODSKRA_API_PATH: '/SKRA-Cloud-Protected/Einstaklingar-v1',
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
        'https://skraidentitystaging.b2clogin.com/skraidentitystaging.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
      prod: 'https://skraidentity.b2clogin.com/skraidentity.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
    },
    NATIONAL_REGISTRY_B2C_SCOPE: {
      dev: 'https://skraidentitydev.onmicrosoft.com/midlun/.default',
      staging: 'https://skraidentitystaging.onmicrosoft.com/midlun/.default',
      prod: 'https://skraidentity.onmicrosoft.com/midlun/.default',
    },
    NATIONAL_REGISTRY_B2C_APPLICATION_SCOPE: {
      dev: 'https://skraidentitydev.onmicrosoft.com/midlunumsoknir/.default',
      staging:
        'https://skraidentitystaging.onmicrosoft.com/midlunumsoknir/.default',
      prod: 'https://skraidentity.onmicrosoft.com/midlunumsoknir/.default',
    },
    NATIONAL_REGISTRY_B2C_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Midlun-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Midlun-v1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Midlun-v1',
    },
    NATIONAL_REGISTRY_B2C_APPLICATION_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/MidlunUmsoknir-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/MidlunUmsoknir-v1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/MidlunUmsoknir-v1',
    },
  },
})

export const NationalRegistryAuthB2C = new XroadConf({
  env: {
    NATIONAL_REGISTRY_B2C_CLIENT_ID: {
      dev: '6cf94113-d326-4e4d-b97c-1fea12d2f5e1',
      staging: '19e7d60e-920e-4a6f-a125-25ea283ee1a4',
      prod: '8271bbc2-d8de-480f-8540-ea43fc40b7ae',
    },
    NATIONAL_REGISTRY_B2C_ENDPOINT: {
      dev: 'https://skraidentitydev.b2clogin.com/skraidentitydev.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
      staging:
        'https://skraidentitystaging.b2clogin.com/skraidentitystaging.onmicrosoft.com/b2c_1_midlun_flow/oauth2/v2.0/token',
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
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Forskraning-V1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Forskraning-V1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Forskraning-V1',
    },
  },
})

export const SignatureCollection = new XroadConf({
  env: {
    XROAD_SIGNATURE_COLLECTION_PATH: {
      dev: 'IS-DEV/GOV/10001/SKRA-Cloud-Protected/Medmaeli-v1',
      staging: 'IS-TEST/GOV/6503760649/SKRA-Cloud-Protected/Medmaeli-v1',
      prod: 'IS/GOV/6503760649/SKRA-Cloud-Protected/Medmaeli-v1',
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
      staging: 'IS-TEST/GOV/10021/FJS-Public/paymentSchedule_v1',
      prod: 'IS/GOV/5402697509/FJS-Public/paymentSchedule_v1',
    },
  },
})

export const IntellectualProperties = new XroadConf({
  env: {
    XROAD_INTELLECTUAL_PROPERTIES_PATH: {
      dev: 'IS-DEV/GOV/10030/WebAPI-Public/HUG-webAPI',
      staging: 'IS-TEST/GOV/6501912189/WebAPI-Public/HUG-webAPI',
      prod: 'IS/GOV/6501912189/WebAPI-Public/HUG-webAPI',
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

export const Inna = new XroadConf({
  env: {
    XROAD_INNA_PATH: {
      dev: 'IS-DEV/GOV/10066/MMS-Protected/inna-v1',
      staging: 'IS-TEST/GOV/6601241280/MMS-Protected/inna-v1',
      prod: 'IS/GOV/6601241280/MMS-Protected/inna-v1',
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
      staging: 'IS-TEST/GOV/10021/FJS-Public/chargeFJS_v2',
      prod: 'IS/GOV/5402697509/FJS-Public/chargeFJS_v2',
    },
  },
})

export const EnergyFunds = new XroadConf({
  env: {
    XROAD_ENERGY_FUNDS_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/ElectricCarSubSidyService_v1',
      staging: 'IS-TEST/GOV/10021/FJS-Public/ElectricCarSubSidyService_v1',
      prod: 'IS/GOV/5402697509/FJS-Public/ElectricCarSubSidyService_v1',
    },
  },
})

export const VehicleServiceFjsV1 = new XroadConf({
  env: {
    XROAD_VEHICLE_SERVICE_FJS_V1_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Public/VehicleServiceFJS_v1',
      staging: 'IS-TEST/GOV/10021/FJS-Public/VehicleServiceFJS_v1',
      prod: 'IS/GOV/5402697509/FJS-Public/VehicleServiceFJS_v1',
    },
  },
})

export const TransportAuthority = new XroadConf({
  env: {
    XROAD_VEHICLE_CODETABLES_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Codetables-V1',
      staging:
        'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-Codetables-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Codetables-V1',
    },
    XROAD_VEHICLE_INFOLOCKS_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Infolocks-V1',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-Infolocks-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Infolocks-V1',
    },
    XROAD_VEHICLE_OPERATORS_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Operators-V3',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-Operators-V3',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Operators-V3',
    },
    XROAD_VEHICLE_OWNER_CHANGE_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
      staging:
        'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Ownerchange-V2',
    },
    XROAD_VEHICLE_PLATE_ORDERING_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
      staging:
        'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-PlateOrdering-V1',
    },
    XROAD_VEHICLE_PLATE_RENEWAL_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
      staging:
        'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-PlateOwnership-V1',
    },
    XROAD_VEHICLE_PRINTING_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Vehicle-Printing-V1',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Vehicle-Printing-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Vehicle-Printing-V1',
    },
    XROAD_DIGITAL_TACHOGRAPH_DRIVERS_CARD_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Okuritar-V1',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Okuritar-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Okuritar-V1',
    },
    XROAD_EXEMPTION_FOR_TRANSPORTATION_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Leyfur-V1',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Leyfur-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/Leyfur-V1',
    },
  },
})

export const IcelandicGovernmentInstitutionVacancies = new XroadConf({
  env: {
    XROAD_ICELANDIC_GOVERNMENT_INSTITUTION_VACANCIES_PATH: {
      dev: 'IS-DEV/GOV/10021/FJS-Protected/recruitment-v1',
      staging: 'IS-TEST/GOV/10021/FJS-Protected/recruitment-v1',
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

export const IcelandicGovernmentEmployees = new XroadConf({
  env: {
    FINANCIAL_MANAGEMENT_AUTHORITY_BASE_PATH: {
      dev: 'https://fjs-cdn-endpoint-elfur-dev-hhesbzhxabbwbqen.a03.azurefd.net',
      staging:
        'https://fjs-cdn-endpoint-elfur-test-hhesbzhxabbwbqen.a03.azurefd.net',
      prod: 'https://fjs-cdn-endpoint-elfur-prod-hhesbzhxabbwbqen.a03.azurefd.net',
    },
    FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_ID: {
      dev: '@fjs.is/stafraent-island-api-elfur',
      staging: '@fjs.is/stafraent-island-api-elfur',
      prod: '@fjs.is/stafraent-island-api-elfur',
    },
    FINANCIAL_MANAGEMENT_AUTHORITY_IDS_URL: {
      dev: 'https://identity-server.staging01.devland.is',
      staging: 'https://identity-server.staging01.devland.is',
      prod: 'https://innskra.island.is',
    },
  },
  secrets: {
    FINANCIAL_MANAGEMENT_AUTHORITY_CLIENT_SECRET:
      '/k8s/api/ELFUR_SI_ACCOUNT_CLIENT_SECRET',
    FINANCIAL_MANAGEMENT_AUTHORITY_EXECUTE_AS_USERNAME: '/k8s/api/ELFUR_API_USERNAME_KEY',
  },
})

export const AircraftRegistry = new XroadConf({
  env: {
    XROAD_AIRCRAFT_REGISTRY_PATH: {
      dev: 'IS-DEV/GOV/10017/Samgongustofa-Protected/Loftfaraskra-V1',
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/Loftfaraskra-V1',
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
      staging: 'IS-TEST/GOV/10017/Samgongustofa-Protected/skipaskra-V1',
      prod: 'IS/GOV/5405131040/Samgongustofa-Protected/skipaskra-V1',
    },
  },
})

export const DirectorateOfImmigration = new XroadConf({
  env: {
    XROAD_DIRECTORATE_OF_IMMIGRATION_PATH: {
      dev: 'IS-DEV/GOV/10011/UTL-Protected/Utl-Umsokn-v1',
      staging: 'IS-TEST/GOV/10011/UTL-Protected/Utl-Umsokn-v1',
      prod: 'IS/GOV/6702696399/UTL-Protected/Utl-Umsokn-v1',
    },
  },
})

export const UniversityGatewayUniversityOfIceland = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10010/HI-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10010/HI-Protected/umsoknir-v1',
      prod: 'IS/EDU/6001692039/HI-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayUniversityOfAkureyri = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_UNIVERSITY_OF_AKUREYRI_PATH: {
      dev: 'IS-DEV/EDU/10054/UNAK-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10054/UNAK-Protected/umsoknir-v1',
      prod: 'IS/EDU/5206871229/UNAK-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayBifrostUniversity = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_BIFROST_UNIVERSITY_PATH: {
      dev: 'IS-DEV/EDU/10057/Bifrost-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10057/Bifrost-Protected/umsoknir-v1',
      prod: 'IS/EDU/5502690239/Bifrost-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayIcelandUniversityOfTheArts = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_ICELAND_UNIVERSITY_OF_THE_ARTS_PATH: {
      dev: 'IS-DEV/EDU/10049/LHI-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10049/LHI-Protected/umsoknir-v1',
      prod: 'IS/EDU/4210984099/LHI-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayAgriculturalUniversityOfIceland = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_AGRICULTURAL_UNIVERSITY_OF_ICELAND_PATH: {
      dev: 'IS-DEV/EDU/10056/LBHI-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10056/LBHI-Protected/umsoknir-v1',
      prod: 'IS/EDU/4112043590/LBHI-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayHolarUniversity = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_HOLAR_UNIVERSITY_PATH: {
      dev: 'IS-DEV/EDU/10055/Holar-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/10055/Holar-Protected/umsoknir-v1',
      prod: 'IS/EDU/5001694359/Holar-Protected/umsoknir-v1',
    },
  },
})

export const UniversityGatewayReykjavikUniversity = new XroadConf({
  env: {
    XROAD_UNIVERSITY_GATEWAY_REYKJAVIK_UNIVERSITY_PATH: {
      dev: 'IS-DEV/EDU/10062/RvkUni-Hvin-Protected/umsoknir-v1',
      staging: 'IS-TEST/EDU/5101054190/RvkUni-Hvin-Protected/umsoknir-v1',
      prod: 'IS/EDU/5101054190/RvkUni-Hvin-Protected/umsoknir-v1',
    },
  },
})

export const JudicialSystemServicePortal = new XroadConf({
  env: {
    XROAD_JUDICIAL_SYSTEM_SP_PATH: {
      dev: 'IS-DEV/GOV/10014/Rettarvorslugatt-Private/judicial-system-mailbox-api',
      staging:
        'IS-TEST/GOV/10014/Rettarvorslugatt-Private/judicial-system-mailbox-api',
      prod: 'IS/GOV/5804170510/Rettarvorslugatt-Private/judicial-system-mailbox-api',
    },
  },
})

export const SocialInsuranceAdministration = new XroadConf({
  env: {
    XROAD_TR_PATH: {
      dev: 'IS-DEV/GOV/10008/TR-Protected/external-v1',
      staging: 'IS-TEST/GOV/5012130120/TR-Protected/external-v1',
      prod: 'IS/GOV/5012130120/TR-Protected/external-v1',
    },
    XROAD_TR_PATH_V2: {
      dev: 'IS-DEV/GOV/10008/TR-Protected/external-v2',
      staging: 'IS-TEST/GOV/5012130120/TR-Protected/external-v2',
      prod: 'IS/GOV/5012130120/TR-Protected/external-v2',
    },
  },
})

export const ArborgWorkpoint = new XroadConf({
  env: {
    WORKPOINT_ARBORG_SERVICE_PATH: {
      dev: 'IS-DEV/MUN/10036/Arborg-Protected/tengill-application-v1',
      staging: 'IS-TEST/MUN/10036/Arborg-Protected/tengill-application-v1',
      prod: 'IS/MUN/10036/Arborg-Protected/tengill-application-v1',
    },
  },
})

export const OfficialJournalOfIceland = new XroadConf({
  env: {
    XROAD_OFFICIAL_JOURNAL_PATH: {
      dev: 'IS-DEV/GOV/10014/DMR-Protected/official-journal',
      staging: 'IS-TEST/GOV/10014/DMR-Protected/official-journal',
      prod: 'IS/GOV/5804170510/DMR-Protected/official-journal',
    },
  },
})

export const OfficialJournalOfIcelandApplication = new XroadConf({
  env: {
    XROAD_OFFICIAL_JOURNAL_APPLICATION_PATH: {
      dev: 'IS-DEV/GOV/10014/DMR-Protected/official-journal-application',
      staging: 'IS-TEST/GOV/10014/DMR-Protected/official-journal-application',
      prod: 'IS/GOV/5804170510/DMR-Protected/official-journal-application',
    },
  },
})

export const LegalGazette = new XroadConf({
  env: {
    XROAD_LEGAL_GAZETTE_PATH: {
      dev: 'IS-DEV/GOV/10014/DMR-Protected/legal-gazette-api',
      staging: 'IS-TEST/GOV/10014/DMR-Protected/legal-gazette-api',
      prod: 'IS/GOV/5804170510/DMR-Protected/legal-gazette-api',
    },
  },
})

export const Frigg = new XroadConf({
  env: {
    XROAD_MMS_FRIGG_PATH: {
      dev: 'IS-DEV/GOV/10066/MMS-Protected/frigg-form-api',
      staging: 'IS-TEST/GOV/6601241280/MMS-Protected/frigg-form-api',
      prod: 'IS/GOV/6601241280/MMS-Protected/frigg-form-api',
    },
  },
})

export const HealthDirectorateOrganDonation = new XroadConf({
  env: {
    XROAD_HEALTH_DIRECTORATE_ORGAN_DONATION_PATH: {
      dev: 'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/organ-donation-v1',
      staging:
        'IS-TEST/GOV/7101695009/EmbaettiLandlaeknis-Protected/organ-donation-v1',
      prod: 'IS/GOV/7101695009/EmbaettiLandlaeknis-Protected/organ-donation-v1',
    },
  },
})

export const HealthDirectorateVaccination = new XroadConf({
  env: {
    XROAD_HEALTH_DIRECTORATE_VACCINATION_PATH: {
      dev: 'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/vaccination-v1',
      staging:
        'IS-TEST/GOV/7101695009/EmbaettiLandlaeknis-Protected/vaccination-v1',
      prod: 'IS/GOV/7101695009/EmbaettiLandlaeknis-Protected/vaccination-v1',
    },
  },
})

export const HealthDirectorateHealthService = new XroadConf({
  env: {
    XROAD_HEALTH_DIRECTORATE_HEALTH_PATH: {
      dev: 'IS-DEV/GOV/10015/EmbaettiLandlaeknis-Protected/health-service-v1',
      staging:
        'IS-TEST/GOV/7101695009/EmbaettiLandlaeknis-Protected/health-service-v1',
      prod: 'IS/GOV/7101695009/EmbaettiLandlaeknis-Protected/health-service-v1',
    },
  },
})

export const SecondarySchool = new XroadConf({
  env: {
    XROAD_SECONDARY_SCHOOL_PATH: {
      dev: 'IS-DEV/GOV/10066/MMS-Protected/umsoknagatt',
      staging: 'IS-TEST/GOV/10066/MMS-Protected/umsoknagatt',
      prod: 'IS/GOV/6601241280/MMS-Protected/umsoknagatt',
    },
  },
})

export const LSH = new XroadConf({
  env: {
    XROAD_LSH_PATH: {
      dev: 'IS-DEV/GOV/10022/Landspitali-Protected/external-patient-api-v1',
      staging:
        'IS-TEST/GOV/10022/Landspitali-Protected/external-patient-api-v1',
      prod: 'IS/GOV/5003002130/Landspitali-Protected/external-patient-api-v1',
    },
  },
})

export const VMSTUnemployment = new XroadConf({
  env: {
    VMST_UNEMPLOYMENT_XROAD_PATH: {
      dev: 'IS-DEV/GOV/10003/VMST-Protected/XRoadDev-v1',
      staging: 'IS-TEST/GOV/7005942039/VMST-Protected/XRoadDev-v1',
      prod: 'IS/GOV/7005942039/VMST-Protected/vmst-umsoknir-v1',
    },
  },
  secrets: {
    XROAD_VMST_UNEMPLOYMENT_USERNAME:
      '/k8s/xroad/XROAD_VMST_UNEMPLOYMENT_USERNAME',
    XROAD_VMST_UNEMPLOYMENT_PASSWORD:
      '/k8s/xroad/XROAD_VMST_UNEMPLOYMENT_PASSWORD',
  },
})

export const GoProVerdicts = new XroadConf({
  env: {
    XROAD_VERDICTS_GOPRO_PATH: {
      dev: 'IS-DEV/GOV/10019/Domstolasyslan-Client/Island-is',
      staging: 'IS-TEST/GOV/10019/Domstolasyslan-Client/Island-is',
      prod: 'IS/GOV/4707171140/Domstolasyslan-Client/Island-is',
    },
  },
})
