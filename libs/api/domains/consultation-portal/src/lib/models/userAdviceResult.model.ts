import { Field, ObjectType } from '@nestjs/graphql'
import { DocumentInfoResult } from './'

@ObjectType()
export class UserAdviceResult {
  @Field({ nullable: true })
  id?: string

  @Field({ nullable: true })
  caseId?: number

  @Field({ nullable: true })
  participantName?: string

  @Field({ nullable: true })
  participantEmail?: string

  @Field({ nullable: true })
  content?: string

  @Field(() => Date, { nullable: true })
  created?: Date

  @Field(() => [DocumentInfoResult], { nullable: true })
  adviceDocuments?: DocumentInfoResult[]
}
