import { Field, ID, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionSignee {
  @Field(() => ID)
  id!: string

  @Field()
  nationalId!: string

  @Field()
  name!: string

  @Field({ nullable: true })
  areaId?: string

  @Field({ nullable: true })
  address?: string
}
