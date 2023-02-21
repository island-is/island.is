import { ObjectType, Field } from '@nestjs/graphql'
import { DocumentInfoResult } from './documentInfoResult.model'

@ObjectType()
export class AdviceResult {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  number?: number

  @Field(() => String, { nullable: true })
  participantName?: string | null

  @Field(() => String, { nullable: true })
  participantEmail?: string | null

  @Field(() => String, { nullable: true })
  content?: string | null

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => [DocumentInfoResult], { nullable: true })
  adviceDocuments?: DocumentInfoResult[] | null
}
