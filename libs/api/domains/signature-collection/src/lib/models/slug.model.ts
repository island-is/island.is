import { Field, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionSuccess } from './success.model'

@ObjectType()
export class SignatureCollectionSlug extends SignatureCollectionSuccess {
  @Field()
  slug!: string
}
