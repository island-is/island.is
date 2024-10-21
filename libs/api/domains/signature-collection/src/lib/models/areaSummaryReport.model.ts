import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'

@ObjectType()
export class SignatureCollectionAreaSummaryReport extends SignatureCollectionArea {
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
  partyBallotLetter!: string

  @Field(() => Number)
  nrOfSignatures!: number

  @Field(() => Number)
  nrOfDigitalSignatures!: number

  @Field(() => Number)
  nrOfPaperSignatures!: number
}
