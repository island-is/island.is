import { Field, ID,ObjectType } from '@nestjs/graphql'

import { SystemMetadata } from '@island.is/shared/types'

import { ITeamList } from '../generated/contentfulTypes'

import { mapTeamMember,TeamMember } from './teamMember.model'

@ObjectType()
export class TeamList {
  @Field(() => ID)
  id!: string

  @Field(() => [TeamMember])
  teamMembers?: Array<TeamMember>
}

export const mapTeamList = ({
  fields,
  sys,
}: ITeamList): SystemMetadata<TeamList> => ({
  typename: 'TeamList',
  id: sys.id,
  teamMembers: (fields.teamMembers ?? []).map(mapTeamMember),
})
