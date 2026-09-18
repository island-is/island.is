import { Field, GraphQLISODateTime, ID, Int, ObjectType } from '@nestjs/graphql'
import { GraphQLJSONObject } from 'graphql-type-json'
import { CommunicationKindEnum } from './enums'
import { CommunicationStaffRef } from './communicationStaffRef.model'

@ObjectType('HealthDirectoratePhoneCallCommunicationDetail')
export class PhoneCallCommunicationDetail {
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

  @Field(() => CommunicationStaffRef, { nullable: true })
  registeredBy?: CommunicationStaffRef

  @Field(() => Int, {
    nullable: true,
    description:
      'Numeric phone-call-reason code. No label catalogue exists yet — render raw.',
  })
  phoneCallReason?: number

  @Field(() => Int, {
    nullable: true,
    description:
      'Numeric phone-call-result code. No label catalogue exists yet — render raw.',
  })
  phoneCallResult?: number

  @Field(() => GraphQLJSONObject, {
    nullable: true,
    description:
      'Populated keys from the source phone-call checklist. Key set is not documented anywhere yet — exposed as a raw object until the real keys are confirmed.',
  })
  checklist?: Record<string, unknown>
}
