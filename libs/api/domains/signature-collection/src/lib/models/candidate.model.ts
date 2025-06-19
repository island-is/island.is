import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionCandidate {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  phone?: string

  @Field({ nullable: true })
  email?: string

  @Field({ nullable: true })
  collectionId?: string

  @Field({ nullable: true })
  partyBallotLetter?: string

  @Field({ nullable: true })
  areaId?: string
}
