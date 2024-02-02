import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionAreaBase } from './area.model'
import { SignatureCollectionSignature } from './signature.model'
import { SignatureCollectionOwnedList } from './signatureList.model'
import { SignatureCollectionCandidate } from './candidate.model'

@ObjectType()
export class SignatureCollectionSigneeBase {
  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  address?: string
}

@ObjectType()
export class SignatureCollectionCandidateLookUp extends SignatureCollectionSigneeBase {
  @Field()
  canCreate!: boolean

  @Field(() => [String], { nullable: true })
  canCreateInfo?: string[]
}

@ObjectType()
export class SignatureCollectionSignee extends SignatureCollectionCandidateLookUp {
  @Field({ nullable: true })
  canSign!: boolean

  @Field(() => [String], { nullable: true })
  canSignInfo?: string[]

  @Field(() => SignatureCollectionAreaBase, { nullable: true })
  area?: SignatureCollectionAreaBase

  @Field(() => SignatureCollectionSignature, { nullable: true })
  signature?: SignatureCollectionSignature

  @Field(() => [SignatureCollectionOwnedList], { nullable: true })
  ownedLists?: SignatureCollectionOwnedList[]

  @Field(() => SignatureCollectionCandidate, { nullable: true })
  candidate?: SignatureCollectionCandidate

  @Field()
  isOwner!: boolean
}
