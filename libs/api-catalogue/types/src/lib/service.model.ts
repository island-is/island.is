import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { ServiceVersion } from './service-version.model'
import { XroadIdentifier } from './xroadIdentifier.model'

export interface Service {
  /**
   * Unique id of the service.
   */
  id: string

  /**
   * Title of the service. From OAS3.info.title
   */
  title: string

  /**
   * Shorter highlighting description what the service does.
   * From OAS3.info.x-summary
   */
  summary: string

  /**
   * Longer description for more detailed information, if needed.
   * From OAS3.info.description
   * */
  description: string

  /**
   * Name of the service owner. Provided from X-Road Member Name.
   */
  owner: string

  /**
   * Type of the service. Provided from the nature
   * of where the service data is collected.
   */
  type: TypeCategory

  /**
   * Aggregated pricing details for all versions
   * of the service. From OAS3.info.x-pricing
   */
  pricing: Array<PricingCategory>

  /**
   * Aggregated data categories for all versions
   * of the service. From OAS3.info.x-category
   */
  data: Array<DataCategory>

  /**
   * Aggregated info where the service is accessable from.
   * From all version of the service. i.e. X-Road and/or API GW
   */
  access: Array<AccessCategory>

  /**
   * Array of all versions of the service.
   */
  versions: Array<ServiceVersion>
}
