import { Environment } from '../entities/common/Environment'

export class EnvironmentUtils {
  public static getEnvironment(uri: string = null) {
    // TODO: Should we set uri's in next.js config and do our checks there?
    if (uri.includes('dev01')) {
      return Environment.DEV
    }

    if (uri.includes('staging01')) {
      return Environment.STAGING
    }

    if (uri.includes('localhost')) {
      return Environment.LOCAL
    }

    return Environment.PROD
  }
}
