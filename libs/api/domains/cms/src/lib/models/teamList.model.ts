import { Field, ObjectType, ID } from '@nestjs/graphql'

import { ITeamList } from '../generated/contentfulTypes'

import { TeamMember, mapTeamMember } from './teamMember.model'

@ObjectType()
export class TeamList {
  @Field()
  typename: string

  @Field(() => ID)
  id: string

  @Field(() => [TeamMember])
  teamMembers: Array<TeamMember>
}

export const mapTeamList = ({ fields, sys }: ITeamList): TeamList => ({
  typename: 'TeamList',
  id: sys.id,
  teamMembers: (fields.teamMembers ?? []).map(mapTeamMember),
})
