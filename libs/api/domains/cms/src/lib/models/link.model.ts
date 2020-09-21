import { logger } from '@island.is/logging'
import { Field, ObjectType } from '@nestjs/graphql'
import { isEmpty } from 'lodash'
import { ILink } from '../generated/contentfulTypes'

@ObjectType()
export class Link {
  @Field()
  text: string

  @Field()
  url: string
}

export const mapLink = ({ fields }: ILink): Link => {
  return {
    text: fields?.text ?? '',
    url: fields?.url ?? '',
  }
}
