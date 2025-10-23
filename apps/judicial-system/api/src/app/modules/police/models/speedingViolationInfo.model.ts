import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SpeedingViolationInfo {
  @Field(() => String, { nullable: true })
  readonly nationalId?: string

  @Field(() => String, { nullable: true })
  readonly recordedSpeed?: string

  @Field(() => String, { nullable: true })
  readonly speedLimit?: string

  @Field(() => String, { nullable: true })
  readonly licencePlate?: string

  @Field(() => String, { nullable: true })
  readonly date?: string
}
