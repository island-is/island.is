import { CollectionType } from '@island.is/clients/signature-collection'
import { Field, InputType, registerEnumType } from '@nestjs/graphql'

registerEnumType(CollectionType, { name: 'SignatureCollectionCollectionType' })

@InputType()
export class SignatureCollectionCollectionTypeFilterInput {
  @Field(() => CollectionType, { nullable: true })
  collectionTypeFilter?: CollectionType
}
