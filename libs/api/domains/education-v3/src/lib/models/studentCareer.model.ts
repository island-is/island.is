import { Field, ObjectType } from '@nestjs/graphql'
import { PrimarySchoolCareer } from './primarySchoolCareer.model'
import { Entity } from './interfaces/entity.model'

@ObjectType('EducationV3StudentCareer', {
  implements: () => Entity,
})
export class StudentCareer extends Entity {
  @Field(() => PrimarySchoolCareer, { nullable: true })
  primarySchoolCareer?: PrimarySchoolCareer
}
