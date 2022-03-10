import { Field, ObjectType, ID } from '@nestjs/graphql'
import { IVidspyrnaTag } from '../generated/contentfulTypes'

@ObjectType()
export class AdgerdirTag {
  @Field(() => ID)
  id!: string

  @Field()
  title!: string
}

export const mapAdgerdirTag = ({
  sys,
  fields,
}: IVidspyrnaTag): AdgerdirTag => ({
  id: sys?.id ?? '',
  title: fields?.title ?? '',
})
