import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ITeamMember } from '../generated/contentfulTypes'
import { Image, mapImage } from './image.model'
import { GenericTag, mapGenericTag } from './genericTag.model'
import { SliceUnion, mapDocument } from '../unions/slice.union'

@ObjectType()
export class TeamMemberTagGroup {
  @Field()
  groupId!: string

  @Field()
  groupLabel!: string

  @Field(() => [String])
  tagLabels!: string[]
}

@ObjectType()
export class TeamMember {
  @Field(() => ID)
  id?: string

  @Field()
  name!: string

  @Field()
  title!: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  phone?: string

  @CacheField(() => Image, { nullable: true })
  image!: Image | null

  @CacheField(() => Image, { nullable: true })
  imageOnSelect?: Image | null

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]

  @CacheField(() => [SliceUnion], { nullable: true })
  intro?: Array<typeof SliceUnion> = []

  @CacheField(() => [TeamMemberTagGroup], { nullable: true })
  tagGroups?: TeamMemberTagGroup[]

  @Field({ nullable: true })
  createdAt?: string
}

export const mapTeamMember = ({ fields, sys }: ITeamMember): TeamMember => {
  const tagGroups: TeamMemberTagGroup[] = []

  const filterTags = fields.filterTags
    ? fields.filterTags.map(mapGenericTag)
    : []

  for (const tag of filterTags) {
    if (!tag.genericTagGroup?.title || !tag.title) {
      continue
    }
    const index = tagGroups.findIndex(
      (group) => group.groupLabel === tag.genericTagGroup?.title,
    )
    if (index >= 0) {
      tagGroups[index].tagLabels.push(tag.title)
    } else {
      tagGroups.push({
        groupLabel: tag.genericTagGroup.title,
        tagLabels: [tag.title],
        groupId: tag.genericTagGroup.id,
      })
    }

    // Add a colon to the end of group labels if it doesn't have one
    for (const group of tagGroups) {
      if (!group.groupLabel.endsWith(':')) {
        group.groupLabel += ':'
      }
    }
  }

  return {
    id: sys.id,
    name: fields.name ?? '',
    title: fields.title ?? '',
    image: fields.mynd ? mapImage(fields.mynd) : null,
    imageOnSelect: fields.imageOnSelect ? mapImage(fields.imageOnSelect) : null,
    filterTags,
    intro: fields.intro ? mapDocument(fields.intro, `${sys.id}:intro`) : [],
    email: fields.email,
    phone: fields.phone,
    tagGroups,
    createdAt: sys.createdAt,
  }
}
