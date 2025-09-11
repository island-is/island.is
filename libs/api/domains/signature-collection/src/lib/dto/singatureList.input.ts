import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { SignatureCollectionOwnerInput } from './owner.input'
import { SignatureCollectionAreaInput } from './area.input'
import { CollectionType } from '@island.is/clients/signature-collection'
import { SignatureCollectionBaseInput } from './signatureCollectionBase.input'

registerEnumType(CollectionType, { name: 'SignatureCollectionCollectionType' })

@InputType()
export class SignatureCollectionListInput extends SignatureCollectionBaseInput {
  @Field()
  collectionId!: string

  @Field(() => SignatureCollectionOwnerInput)
  owner!: SignatureCollectionOwnerInput

  @Field(() => [SignatureCollectionAreaInput], {
    nullable: true,
    description: 'If not provided, the list will be available in all areas',
  })
  areas?: SignatureCollectionAreaInput[]

  @Field(() => String, {
    nullable: true,
    description: 'The name of the list',
  })
  collectionName?: string
}
