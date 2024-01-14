import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionAreaBase } from './area.model'
import { SignatureCollectionSignature } from './signature.model'
import { SignatureCollectionList } from './signatureList.model'
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
export class SignatureCollectionSignee extends SignatureCollectionSigneeBase {
  @Field({ nullable: true })
  canSign!: boolean

  @Field(() => SignatureCollectionAreaBase, { nullable: true })
  area?: SignatureCollectionAreaBase

  @Field(() => SignatureCollectionSignature, { nullable: true })
  signature?: SignatureCollectionSignature

  @Field(() => [SignatureCollectionList], { nullable: true })
  ownedLists?: SignatureCollectionList[]

  @Field({ nullable: true })
  isOwner!: boolean

  @Field({ nullable: true })
  candidate?: SignatureCollectionCandidate
}
