export * from './gen/fetch'
import { OkuskirteiniApi, Configuration } from './gen/fetch'

export const DRIVING_LICENSE_API_VERSION_V2 = '2.0'

export class ConfigV2 extends Configuration {}
export class ApiV2 extends OkuskirteiniApi {}
