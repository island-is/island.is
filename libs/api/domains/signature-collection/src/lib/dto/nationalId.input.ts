import { CollectionType } from '@island.is/clients/signature-collection'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'
import { IsString } from 'class-validator'

registerEnumType(CollectionType, {
  name: 'SignatureCollectionNationalIdInputCollectionType',
})

@InputType()
export class SignatureCollectionNationalIdInput {
  @Field()
  @IsString()
  nationalId!: string

  @Field(() => CollectionType)
  collectionType!: CollectionType
}
