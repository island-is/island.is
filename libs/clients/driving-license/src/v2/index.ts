export * from '../../gen/fetch/v2'
import { OkuskirteiniApi, Configuration } from '../../gen/fetch/v2'

export const DRIVING_LICENSE_API_VERSION_V2 = '2.0'

export class ConfigV2 extends Configuration {}
export class ApiV2 extends OkuskirteiniApi {}
