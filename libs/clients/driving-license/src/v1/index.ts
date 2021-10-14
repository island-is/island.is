export const DRIVING_LICENSE_API_VERSION_V1 = '1.0'
export * from './gen/fetch'
import { OkuskirteiniApi, Configuration } from './gen/fetch'

export class ConfigV1 extends Configuration {}
export class ApiV1 extends OkuskirteiniApi {}
