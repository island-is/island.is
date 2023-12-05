import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionSignature } from './signature.model'

@ObjectType()
export class SignatureCollectionFailedNationalIds {
  @Field()
  nationalId!: string

  @Field({ nullable: true })
  reason?: string
}

@ObjectType()
export class SignatureCollectionBulk {
  @Field(() => [SignatureCollectionSignature])
  success!: SignatureCollectionSignature[]

  @Field(() => [SignatureCollectionFailedNationalIds])
  failed!: SignatureCollectionFailedNationalIds[]
}
