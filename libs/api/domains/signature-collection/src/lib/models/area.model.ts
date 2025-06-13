import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionAreaBase {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string
}

@ObjectType()
export class SignatureCollectionArea {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field()
  min!: number

  @Field({ nullable: true })
  max!: number

  @Field({ nullable: true })
  collectionId?: string
}
