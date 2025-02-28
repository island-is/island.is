import { Field, ObjectType } from '@nestjs/graphql'
import { Teacher } from './teacher.model'
import { PrimarySchool } from './primarySchool.model'

@ObjectType('EducationV3PrimarySchoolCareer')
export class PrimarySchoolCareer {
  @Field(() => PrimarySchool)
  primarySchool!: PrimarySchool

  @Field(() => Teacher)
  teacher!: Teacher
}
