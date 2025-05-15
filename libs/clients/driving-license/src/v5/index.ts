export * from '../../gen/fetch/v5'
import {
  OkuskirteiniApi,
  Configuration,
  CodetablesApi,
  ApplicationApi,
  ImageApi,
} from '../../gen/fetch/v5'

export const DRIVING_LICENSE_API_VERSION_V5 = '5.0'
export const DRIVING_LICENSE_API_USER_ID = 'SYS1'

export class ConfigV5 extends Configuration {}
export class ApiV5 extends OkuskirteiniApi {}
export class CodeTableV5 extends CodetablesApi {}
export class ApplicationApiV5 extends ApplicationApi {}
export class ImageApiV5 extends ImageApi {}
