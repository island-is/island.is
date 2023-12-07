import { Field, ObjectType, ID } from '@nestjs/graphql'
import { ISectionWithImage } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { SystemMetadata } from '@island.is/shared/types'
import { CacheField } from '@island.is/nest/graphql'
import { mapDocument, SliceUnion } from '../unions/slice.union'

@ObjectType()
export class SectionWithImage {
  @Field(() => ID)
  id!: string

  @Field()
  title?: string

  @CacheField(() => Image, { nullable: true })
  image?: Image | null

  @CacheField(() => [SliceUnion], { nullable: true })
  content?: Array<typeof SliceUnion>
}

export const mapSectionWithImage = ({
  fields,
  sys,
}: ISectionWithImage): SystemMetadata<SectionWithImage> => ({
  typename: 'SectionWithImage',
  id: sys.id,
  title: fields.title ?? '',
  image: fields.image?.fields?.file ? mapImage(fields.image) : null,
  content: fields.body
    ? mapDocument(fields.body, sys.id + ':content')
    : [],
})
