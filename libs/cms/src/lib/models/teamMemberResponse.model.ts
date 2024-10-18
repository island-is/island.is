import { Field, Int, ObjectType } from '@nestjs/graphql'
import { CacheField } from '@island.is/nest/graphql'
import { TeamMember } from './teamMember.model'
import { GetTeamMembersInput } from '../dto/getTeamMembers.input'

@ObjectType()
export class TeamMemberResponse {
  @CacheField(() => GetTeamMembersInput)
  input!: GetTeamMembersInput

  @CacheField(() => [TeamMember])
  items!: TeamMember[]

  @Field(() => Int)
  total!: number
}
