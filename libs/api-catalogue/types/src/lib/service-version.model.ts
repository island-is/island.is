import { ServiceDetail } from './service-detail.model'

export interface ServiceVersion {
  /**
   * Id of the service version. We use
   * serviceCode from the X-Road environment.
   */
  versionId: string

  /**
   * List of service details for a specific
   * X-Road environment.
   */
  details: Array<ServiceDetail>
}
