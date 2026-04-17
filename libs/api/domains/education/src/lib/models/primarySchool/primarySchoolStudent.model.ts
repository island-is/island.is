import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AgentType } from '../../enums/primarySchool.enum'

@ObjectType('EducationPrimarySchoolStudent')
export class PrimarySchoolStudent {
  @Field(() => ID)
  id!: string

  @Field({ nullable: true })
  name?: string

  @Field({ nullable: true })
  nationalId?: string

  @Field(() => AgentType, {
    nullable: true,
    description:
      'The relationship between the logged-in user and this student (e.g. Parent, Guardian, Sibling). Present only when the logged-in user is not the student themselves.',
  })
  contactType?: AgentType

  @Field({ nullable: true })
  schoolName?: string

  @Field({ nullable: true })
  contactTeacherName?: string

  @Field({ nullable: true })
  homeRoomName?: string
}
