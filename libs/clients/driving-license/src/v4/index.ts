export * from '../../gen/fetch/v4'
import { OkuskirteiniApi, Configuration } from '../../gen/fetch/v4'

export const DRIVING_LICENSE_API_VERSION_V4 = '4.0'

export class ConfigV4 extends Configuration {}
export class ApiV4 extends OkuskirteiniApi {}
