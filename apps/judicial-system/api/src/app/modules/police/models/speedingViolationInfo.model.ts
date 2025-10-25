import { Field, Int, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SpeedingViolationInfo {
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => Int, { nullable: true })
  readonly recordedSpeed?: number

  @Field(() => Int, { nullable: true })
  readonly speedLimit?: number

  @Field(() => String, { nullable: true })
  readonly licencePlate?: string

  @Field(() => String, { nullable: true })
  readonly date?: string
}
