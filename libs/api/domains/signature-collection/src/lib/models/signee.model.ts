import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionAreaBase } from './area.model'
import { SignatureCollectionSignature } from './signature.model'
import { SignatureCollectionList } from './signatureList.model'

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
  @Field()
  canSign!: boolean

  @Field(() => SignatureCollectionAreaBase, { nullable: true })
  area?: SignatureCollectionAreaBase

  @Field(() => SignatureCollectionSignature, { nullable: true })
  singature?: SignatureCollectionSignature

  @Field(() => [SignatureCollectionList], { nullable: true })
  ownedLists?: SignatureCollectionList[]
}
