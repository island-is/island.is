import { GraphQLJSONObject } from 'graphql-type-json'
import type { SystemMetadata } from '@island.is/shared/types'
import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { AlertBanner, mapAlertBanner } from './alertBanner.model'
import { Image, mapImage } from './image.model'
import type { ICustomPage } from '../generated/contentfulTypes'
import { SliceUnion, mapDocument } from '../unions/slice.union'

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

  @CacheField(() => GraphQLJSONObject)
  translationStrings!: Record<string, string>

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>

  @Field(() => String, { nullable: true })
  ogTitle?: string

  @Field(() => String, { nullable: true })
  ogDescription?: string

  @CacheField(() => Image, { nullable: true })
  ogImage?: Image | null
}

export const mapCustomPage = ({
  sys,
  fields,
}: ICustomPage): SystemMetadata<CustomPage> => {
  return {
    typename: 'CustomPage',
    id: sys.id,
    uniqueIdentifier: fields.uniqueIdentifier || '',
    alertBanner: fields.alertBanner ? mapAlertBanner(fields.alertBanner) : null,
    configJson: fields.configJson,
    translationStrings: fields.translationNamespace?.fields?.strings || {},
    content: fields.content
      ? mapDocument(fields.content, sys.id + ':content')
      : [],
    ogTitle: fields.ogTitle,
    ogDescription: fields.ogDescription,
    ogImage: fields.ogImage ? mapImage(fields.ogImage) : null,
  }
}
