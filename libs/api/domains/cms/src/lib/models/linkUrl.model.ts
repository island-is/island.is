import { Field, ObjectType } from '@nestjs/graphql'

import { ILinkUrl } from '../generated/contentfulTypes'

@ObjectType()
export class LinkUrl {
  @Field()
  url: string
}

export const mapLinkUrl = ({ fields }: ILinkUrl): LinkUrl => ({
  url: fields.url,
})
