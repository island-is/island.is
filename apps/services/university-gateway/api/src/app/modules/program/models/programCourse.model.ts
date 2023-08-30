import { Field, ObjectType, ID, registerEnumType } from '@nestjs/graphql'
import { Requirement } from '@island.is/university-gateway-types'
import { Course } from '../../course/models/course.model'
import type { ProgramCourse as TProgramCourse } from '@island.is/university-gateway-types'

registerEnumType(Requirement, { name: 'Requirement' })

@ObjectType()
export class ProgramCourse implements TProgramCourse {
  @Field(() => ID)
  readonly id!: string

  @Field()
  programId!: string

  @Field()
  courseId!: string

  @Field(() => Course)
  details!: Course

  @Field(() => Requirement)
  requirement!: Requirement

  @Field()
  created!: Date

  @Field()
  modified!: Date
}
