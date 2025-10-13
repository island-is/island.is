import { CacheField } from '@island.is/nest/graphql'
import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
class DrivingInstructor {
  @Field(() => String)
  name!: string

  @Field(() => String)
  postalCode!: string

  @Field(() => String)
  municipality!: string
}

@ObjectType()
export class DrivingInstructorsResponse {
  @CacheField(() => [DrivingInstructor])
  list!: DrivingInstructor[]
}
