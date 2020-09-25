import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ILink } from '../generated/contentfulTypes'
import { LinkedPage, mapLinkedPage } from './linkedPage.model'

@ObjectType()
export class Link {
  @Field(() => ID)
  id: string

  @Field()
  text: string

  @Field()
  url: string

  @Field(() => LinkedPage, { nullable: true })
  linkedPage?: LinkedPage
}

export const mapLink = ({ fields, sys }: ILink): Link => ({
  id: sys.id,
  text: fields.text,
  url: fields.url,
  linkedPage: fields.linkedPage ? mapLinkedPage(fields.linkedPage) : null,
})
