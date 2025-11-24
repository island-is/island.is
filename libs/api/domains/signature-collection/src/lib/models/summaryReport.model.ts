import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'

@ObjectType()
export class SignatureCollectionSummaryReport extends SignatureCollectionArea {
  @Field(() => [SignatureCollectionListSummary])
  lists!: SignatureCollectionListSummary[]
}

@ObjectType()
export class SignatureCollectionListSummary {
  @Field(() => String)
  candidateName!: string

  @Field(() => String)
  listName!: string

  @Field(() => String)
  areaName!: string

  @Field(() => String, { nullable: true })
  partyBallotLetter?: string

  @Field(() => Number)
  nrOfSignatures!: number

  @Field(() => Number)
  nrOfDigitalSignatures!: number

  @Field(() => Number)
  nrOfPaperSignatures!: number
}
