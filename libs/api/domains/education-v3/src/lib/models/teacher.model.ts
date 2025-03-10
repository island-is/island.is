import { Field, ObjectType } from '@nestjs/graphql'
import { Entity } from './interfaces/entity.model'

@ObjectType('EducationV3Teacher', {
  implements: () => Entity,
})
export class Teacher extends Entity {
  @Field({ nullable: true })
  gradeLevel?: string
}
