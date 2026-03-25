import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { AgentType } from '@island.is/clients/mms/primary-school'

registerEnumType(AgentType, {
  name: 'EducationPrimarySchoolContactType',
  description:
    'The relationship between a logged-in user and a student in their care (e.g. Parent, Guardian, Sibling)',
  valuesMap: {
    GUARDIAN: { description: 'Legal guardian of the student' },
    RELATIVE: { description: 'Extended family member' },
    SIBLING: { description: 'Sibling of the student' },
    PARENT: { description: 'Parent of the student' },
    EMERGENCY_CONTACT: { description: 'Emergency contact for the student' },
  },
})

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
