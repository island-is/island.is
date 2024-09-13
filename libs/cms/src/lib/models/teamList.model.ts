import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ITeamList } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { TeamMember, mapTeamMember } from './teamMember.model'
import { GenericTag } from './genericTag.model'

@ObjectType()
export class TeamList {
  @Field(() => ID)
  id!: string

  @CacheField(() => [TeamMember])
  teamMembers?: Array<TeamMember>

  @Field(() => String, { nullable: true })
  variant?: 'card' | 'accordion'

  @CacheField(() => [GenericTag], { nullable: true })
  filterTags?: GenericTag[]
}

export const mapTeamList = ({
  fields,
  sys,
}: ITeamList): SystemMetadata<TeamList> => {
  const teamMembers = (fields.teamMembers ?? []).map(mapTeamMember)

  const filterTags: GenericTag[] = []

  for (const teamMember of teamMembers) {
    for (const tag of teamMember.filterTags ?? []) {
      const tagBelongsToAFilterGroup = fields.filterGroups?.some(
        (group) => group?.sys?.id === tag?.genericTagGroup?.id,
      )
      if (tag?.genericTagGroup?.id && tagBelongsToAFilterGroup) {
        const tagHasAlreadyBeenAdded = filterTags.some((t) => t.id === tag.id)
        if (!tagHasAlreadyBeenAdded) {
          filterTags.push(tag)
        }
      }
    }

    // Reorder the team member tag groups so they are in the same order as the team list filter groups
    const tagGroups = []
    for (const filterGroup of fields.filterGroups ?? []) {
      const group = teamMember.tagGroups?.find(
        (g) => g.groupId === filterGroup.sys.id,
      )
      if (group) {
        tagGroups.push(group)
      }
    }
    teamMember.tagGroups = tagGroups
  }

  return {
    typename: 'TeamList',
    id: sys.id,
    teamMembers,
    variant: fields.variant === 'accordion' ? 'accordion' : 'card',
    filterTags,
  }
}
