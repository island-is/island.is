import { CollectionType } from '@island.is/clients/signature-collection'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

registerEnumType(CollectionType, { name: 'SignatureCollectionCollectionType' })

@InputType()
export class SignatureCollectionCollectionTypeInput {
  @Field(() => CollectionType)
  collectionType!: CollectionType
}
