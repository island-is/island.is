import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType, ID } from '@nestjs/graphql'

@ObjectType()
export class CourseInstanceAvailability {
  @Field(() => ID)
  id!: string

  @Field(() => Boolean, { nullable: true })
  isFullyBooked?: boolean | null
}

@ObjectType()
export class CourseAvailabilityResponse {
  @CacheField(() => [CourseInstanceAvailability])
  instances!: CourseInstanceAvailability[]
}
