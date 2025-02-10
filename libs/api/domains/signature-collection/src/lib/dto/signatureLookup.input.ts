import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class SignatureCollectionSignatureLookupInput {
  @Field()
  @IsString()
  collectionId!: string
  @Field()
  @IsString()
  nationalId!: string
}
