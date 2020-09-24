import { Field, ObjectType } from '@nestjs/graphql'
import { ILink } from '../generated/contentfulTypes'

@ObjectType()
export class Link {
  @Field()
  text: string

  @Field()
  url: string

  @Field({ nullable: true })
  page?: string
}

export const mapLink = ({ fields }: ILink): Link => {
  return {
    text: fields?.text ?? '',
    url: fields?.url ?? '',
    page: (fields.page && JSON.stringify(fields.page)) ?? '',
  }
}
