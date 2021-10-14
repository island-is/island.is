export const DRIVING_LICENSE_API_VERSION_V1 = '1.0'
export * from '../../gen/fetch/v1'
import { OkuskirteiniApi, Configuration } from '../../gen/fetch/v1'

export class ConfigV1 extends Configuration {}
export class ApiV1 extends OkuskirteiniApi {}
