import { Field, ObjectType } from '@nestjs/graphql'

import { IVidspyrnaTag } from '../generated/contentfulTypes'

@ObjectType()
export class VidspyrnaTag {
  @Field()
  title: string
}

export const mapVidspyrnaTag = ({ fields }: IVidspyrnaTag): VidspyrnaTag => ({
  title: fields.title,
})
