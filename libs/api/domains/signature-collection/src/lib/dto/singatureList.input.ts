import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionOwnerInput } from './owner.input'
import { SignatureCollectionAreaInput } from './area.input'
import { CollectionType } from '../models/collection.model'
import { IsEnum } from 'class-validator'

@InputType()
export class SignatureCollectionListInput {
  @Field()
  collectionId!: string

  @Field(() => SignatureCollectionOwnerInput)
  owner!: SignatureCollectionOwnerInput

  @Field(() => [SignatureCollectionAreaInput], {
    nullable: true,
    description: 'If not provided, the list will be available in all areas',
  })
  areas?: SignatureCollectionAreaInput[]

  @Field(() => CollectionType)
  @IsEnum(CollectionType)
  collectionType!: CollectionType
}
