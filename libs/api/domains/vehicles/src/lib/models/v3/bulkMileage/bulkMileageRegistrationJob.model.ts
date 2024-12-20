import { Field, ObjectType, ID, GraphQLISODateTime } from '@nestjs/graphql'

@ObjectType()
export class VehiclesBulkMileageRegistrationJob {
  @Field(() => ID)
  guid!: string

  @Field({ nullable: true })
  reportingPersonNationalId?: string

  @Field({ nullable: true })
  reportingPersonName?: string

  @Field({ nullable: true })
  originCode?: string

  @Field({ nullable: true })
  originName?: string

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'When was the bulk request requested?',
  })
  dateRequested?: Date

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'When did the bulk request start executing?',
  })
  dateStarted?: Date

  @Field(() => GraphQLISODateTime, {
    nullable: true,
    description: 'When did the bulk request execution finish',
  })
  dateFinished?: Date
}
