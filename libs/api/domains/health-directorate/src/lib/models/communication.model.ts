import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { CommunicationKindEnum } from './enums'

@ObjectType('HealthDirectorateCommunication')
export class Communication {
  @Field(() => ID)
  id!: string

  @Field(() => CommunicationKindEnum)
  kind!: CommunicationKindEnum

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

  @Field({
    nullable: true,
    description: 'Short subject/reason term for the entry (subject.term upstream).',
  })
  subjectTerm?: string

  @Field(() => GraphQLISODateTime, { nullable: true })
  lastUpdated?: Date
}
