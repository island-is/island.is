import { DataCategory, PricingCategory } from '@island.is/api-catalogue/consts'
import {
  InfoObject,
  ServerObject,
  PathsObject,
  ComponentsObject,
  SecurityRequirementObject,
  TagObject,
  ExternalDocumentationObject,
  ContactObject,
  LicenseObject,
} from 'openapi3-ts'

export interface OpenApi {
  openapi: string
  info: ExtendedInfoObject
  servers?: ServerObject[]
  paths: PathsObject
  components?: ComponentsObject
  security?: SecurityRequirementObject[]
  tags?: TagObject[]
  externalDocs?: ExternalDocumentationObject
}

export interface ExtendedInfoObject extends InfoObject {
  x_category: Array<DataCategory>
  x_pricing: Array<PricingCategory>
  x_links: LinksObject
}

export interface LinksObject {
  responsibleParty: string
  documentation: string
  bugReport: string
  featureRequest: string
}
