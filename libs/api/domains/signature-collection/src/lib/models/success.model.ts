import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionSuccess {
  @Field()
  success!: boolean

  @Field(() => [String], { nullable: true })
  reasons?: string[]
}
