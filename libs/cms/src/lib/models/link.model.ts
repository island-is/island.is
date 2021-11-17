import { Field, ID, ObjectType } from '@nestjs/graphql'
import { syslog } from 'winston/lib/winston/config'
import { ILink } from '../generated/contentfulTypes'

@ObjectType()
export class Link {
  @Field(() => ID)
  id!: string

  @Field()
  text!: string

  @Field()
  url!: string

  @Field({ nullable: true })
  description?: string

  @Field(() => [String], { nullable: true })
  labels: string[] = []
}

export const mapLink = ({ sys, fields }: ILink): Link => {
  return {
    id: sys.id,
    text: fields?.text ?? '',
    url: fields?.url ?? '',
    description: fields?.description ?? '',
    labels: fields?.labels ?? [],
  }
}
