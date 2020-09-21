import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IEmbeddedVideo } from '../generated/contentfulTypes'

@ObjectType()
export class EmbeddedVideo {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field()
  title: string

  @Field()
  url: string
}

export const mapEmbeddedVideo = ({
  fields,
  sys,
}: IEmbeddedVideo): EmbeddedVideo => ({
  typename: 'EmbeddedVideo',
  id: sys.id,
  ...fields,
})
