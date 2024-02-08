import { GraphQLJSONObject } from 'graphql-type-json'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'
import { ICustomPage } from '../generated/contentfulTypes'
import { SystemMetadata } from 'api-cms-domain'

@ObjectType()
export class CustomPage {
  @Field(() => ID)
  id!: string

  @Field(() => String)
  uniqueIdentifier!: string

  @CacheField(() => GraphQLJSONObject, { nullable: true })
  configJson?: Record<string, unknown> | null

  @CacheField(() => AlertBanner, { nullable: true })
  alertBanner?: AlertBanner | null
}

export const mapCustomPage = ({
  sys,
  fields,
}: ICustomPage): SystemMetadata<CustomPage> => {
  return {
    typename: 'CustomPage',
    id: sys.id,
    uniqueIdentifier: fields.uniqueIdentifier,
    alertBanner: fields.alertBanner ? mapAlertBanner(fields.alertBanner) : null,
    configJson: fields.configJson,
  }
}
