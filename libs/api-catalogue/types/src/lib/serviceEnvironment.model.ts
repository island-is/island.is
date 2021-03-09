import { Environment } from '@island.is/api-catalogue/consts'
import { ServiceDetail } from './serviceDetail.model'

export interface ServiceEnvironment {
  /**
   * The environment name
   */
  environment: Environment

  /**
   * List of service details for a specific environment.
   */
  details: Array<ServiceDetail>
}
