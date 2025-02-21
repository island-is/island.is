import { Field, ObjectType } from '@nestjs/graphql'
import { StudentCareer } from './studentCareer.model'

@ObjectType('EducationUserFamilyPrimarySchoolCareer')
export class FamilyPrimarySchoolCareer {
  @Field(() => StudentCareer, { nullable: true })
  userCareer?: StudentCareer

  @Field(() => [StudentCareer], { nullable: true })
  familyMemberCareers?: Array<StudentCareer>
}
