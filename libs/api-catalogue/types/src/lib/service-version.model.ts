import {
  AccessCategory,
  DataCategory,
  PricingCategory,
  TypeCategory,
} from '@island.is/api-catalogue/consts'
import { XroadIdentifier } from './xroadIdentifier.model'

export interface ServiceVersion {
  /**
   * Id of the service version. We use
   * serviceCode from the X-Road environment.
   */
  versionId: string

  /**
   * Title of the service. From OAS3.info.title
   */
  title: string

  /**
   * Shorter highlight description what the service does.
   * From OAS3.info.x-summary
   */
  summary: string

  /**
   * Longer description for more detailed information, if needed.
   * From OAS3.info.description
   */
  description: string

  /**
   * Specifies which type of web service this version is implemented in.
   * i.e. REST, SOAP ...
   */
  type: TypeCategory

  /**
   * Pricing details of the service. From OAS3.info.x-pricing
   */
  pricing: Array<PricingCategory>

  /**
   * Data categories of the service. From OAS3.info.x-category
   */
  data: Array<DataCategory>

  /**
   * X-Road identifying the service in different X-Road environments.
   */
  xroadIdentifier: Array<XroadIdentifier>
}
