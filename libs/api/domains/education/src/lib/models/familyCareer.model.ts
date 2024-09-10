import { Field, ObjectType } from '@nestjs/graphql'
import { StudentCareer } from './studentCareer.model'

@ObjectType('EducationUserFamilyCompulsorySchoolCareer')
export class FamilyCompulsorySchoolCareer {
  @Field(() => StudentCareer, { nullable: true })
  userCareer?: StudentCareer

  @Field(() => [StudentCareer], { nullable: true })
  familyMemberCareers?: Array<StudentCareer>
}
