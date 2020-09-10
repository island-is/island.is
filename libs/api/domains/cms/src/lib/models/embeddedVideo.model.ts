import { Field, ID, ObjectType } from '@nestjs/graphql'

import { IEmbeddedVideo } from '../generated/contentfulTypes'

@ObjectType()
export class EmbeddedVideo {
  constructor(initializer: EmbeddedVideo) {
    Object.assign(this, initializer)
  }

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
}: IEmbeddedVideo): EmbeddedVideo =>
  new EmbeddedVideo({
    id: sys.id,
    ...fields,
  })
