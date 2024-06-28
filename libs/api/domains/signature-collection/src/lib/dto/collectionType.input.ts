import { Field, InputType } from '@nestjs/graphql'
import { CollectionType } from '../models/collection.model'
import { IsEnum } from 'class-validator'

@InputType()
export class SignatureCollectionTypeInput {
  @Field(() => CollectionType, {
    nullable: false,
  })
  @IsEnum(CollectionType)
  type!: CollectionType
}
