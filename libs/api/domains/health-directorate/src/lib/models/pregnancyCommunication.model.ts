import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { PregnancyCommunicationKindEnum } from './enums'

@ObjectType('HealthDirectoratePregnancyCommunication')
export class PregnancyCommunication {
  @Field(() => ID)
  id!: string

  @Field(() => PregnancyCommunicationKindEnum)
  kind!: PregnancyCommunicationKindEnum

  @Field(() => Int, { nullable: true })
  weeks?: number

  @Field(() => Int, { nullable: true })
  days?: number

  @Field(() => GraphQLISODateTime, { nullable: true })
  dateTime?: Date

  @Field({ nullable: true })
  text?: string

  @Field({ nullable: true })
  authorName?: string

  @Field({ nullable: true })
  subject?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}
