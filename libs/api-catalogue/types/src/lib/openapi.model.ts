import {
  ComponentsObject,
  ExternalDocumentationObject,
  InfoObject,
  PathsObject,
  SecurityRequirementObject,
  ServerObject,
  TagObject,
} from 'openapi3-ts'

import { DataCategory, PricingCategory } from '@island.is/api-catalogue/consts'

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
  'x-category': Array<DataCategory>
  'x-pricing': Array<PricingCategory>
  'x-links': LinksObject
  'x-hide-api-catalogue': boolean
}

export interface LinksObject {
  responsibleParty: string
  documentation: string
  bugReport: string
  featureRequest: string
}
