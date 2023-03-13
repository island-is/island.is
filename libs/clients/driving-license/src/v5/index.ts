export * from '../../gen/fetch/v5'
import { OkuskirteiniApi, Configuration } from '../../gen/fetch/v5'

export const DRIVING_LICENSE_API_VERSION_V2 = '5.0'

export class ConfigV5 extends Configuration {}
export class ApiV5 extends OkuskirteiniApi {}
