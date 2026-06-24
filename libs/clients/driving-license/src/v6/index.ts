export * from '../../gen/fetch/v6'
import {
  OkuskirteiniApi,
  Configuration,
  CodetablesApi,
  ApplicationApi,
  ImageApi,
  LicenseOrderingApi,
  LicenseServiceApi,
  RLSApplicationProxyApi,
  StatisticsApi,
} from '../../gen/fetch/v6'

export const DRIVING_LICENSE_API_VERSION_V6 = '6.0'

export class ConfigV6 extends Configuration {}
export class ApiV6 extends OkuskirteiniApi {}
export class CodeTableV6 extends CodetablesApi {}
export class ApplicationApiV6 extends ApplicationApi {}
export class ImageApiV6 extends ImageApi {}
export class LicenseOrderingApiV6 extends LicenseOrderingApi {}
export class LicenseServiceApiV6 extends LicenseServiceApi {}
export class RLSApplicationProxyApiV6 extends RLSApplicationProxyApi {}
export class StatisticsApiV6 extends StatisticsApi {}
