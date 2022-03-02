import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignedUrlModel {
  @Field()
  readonly url!: string
  @Field()
  readonly key!: string
}
