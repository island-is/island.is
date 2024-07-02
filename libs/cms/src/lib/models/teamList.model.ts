import { Field, ObjectType, ID } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { ITeamList } from '../generated/contentfulTypes'
import { SystemMetadata } from '@island.is/shared/types'
import { TeamMember, mapTeamMember } from './teamMember.model'
import { GenericTag, mapGenericTag } from './genericTag.model'

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
}: ITeamList): SystemMetadata<TeamList> => ({
  typename: 'TeamList',
  id: sys.id,
  teamMembers: (fields.teamMembers ?? []).map(mapTeamMember),
  variant: fields.variant === 'accordion' ? 'accordion' : 'card',
  filterTags: fields.filterTags ? fields.filterTags.map(mapGenericTag) : [],
})
