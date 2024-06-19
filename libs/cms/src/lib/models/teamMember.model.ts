import { Field, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ITeamMember } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { GenericTag, mapGenericTag } from './genericTag.model'

@ObjectType()
export class TeamMember {
  @Field()
  name!: string

  @Field()
  title!: string

  @CacheField(() => Image)
  image!: Image

  @CacheField(() => Image, { nullable: true })
  imageOnSelect?: Image | null

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]
}

export const mapTeamMember = ({ fields }: ITeamMember): TeamMember => ({
  name: fields.name ?? '',
  title: fields.title ?? '',
  image: mapImage(fields.mynd),
  imageOnSelect: fields.imageOnSelect ? mapImage(fields.imageOnSelect) : null,
  filterTags: fields.filterTags ? fields.filterTags.map(mapGenericTag) : [],
})
