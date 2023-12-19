import { IsString } from 'class-validator'
import { Field, InputType } from '@nestjs/graphql'
import { SignatureCollectionOwnerInput } from './owner.input'
import { SignatureCollectionAreaInput } from './area.input'

@InputType()
export class SignatureCollectionListInput {
  @Field()
  @IsString()
  collectionId!: string

  @Field(() => SignatureCollectionOwnerInput)
  owner!: SignatureCollectionOwnerInput

  @Field(() => [SignatureCollectionAreaInput], {
    nullable: true,
    description: 'If not provided, the list will be available in all areas',
  })
  areas?: SignatureCollectionAreaInput[]
}
