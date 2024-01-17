import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionNationalIds {
  @Field()
  nationalId!: string

  @Field({ nullable: true })
  reason?: string
}

@ObjectType()
export class SignatureCollectionBulk {
  @Field(() => [SignatureCollectionNationalIds])
  success!: SignatureCollectionNationalIds[]

  @Field(() => [SignatureCollectionNationalIds])
  failed!: SignatureCollectionNationalIds[]
}
