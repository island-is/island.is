import { Field, ObjectType } from '@nestjs/graphql'

@ObjectType()
export class SignatureCollectionSlug {
  @Field()
  slug!: string
}
