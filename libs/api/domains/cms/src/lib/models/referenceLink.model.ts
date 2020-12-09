import { Field, ObjectType } from '@nestjs/graphql'
import { ILinkUrl } from '../generated/contentfulTypes'
import { PageTypes } from '../unions/page.union'

@ObjectType()
export class ReferenceLink {
  @Field()
  slug: string

  @Field()
  type: string
}

export const mapReferenceLink = ({ sys, fields }: PageTypes | ILinkUrl): ReferenceLink => ({
  slug: (fields as PageTypes['fields']).slug ?? (fields as ILinkUrl['fields']).url ?? '',
  type: sys.contentType.sys.id
})
