import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'
import { SignatureCollectionCandidate } from './candidate.model'
import { CollectionStatus } from './status.model'
import { CollectionType } from '@island.is/clients/signature-collection'

registerEnumType(CollectionType, { name: 'SignatureCollectionCollectionType' })

@ObjectType()
export class SignatureCollection {
  @Field(() => ID)
  id!: string

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date

  @Field()
  isActive!: boolean

  @Field(() => CollectionType)
  collectionType!: CollectionType

  @Field()
  name!: string

  @Field(() => [SignatureCollectionArea])
  areas!: SignatureCollectionArea[]

  @Field(() => [SignatureCollectionCandidate])
  candidates!: SignatureCollectionCandidate[]

  @Field(() => CollectionStatus)
  status!: CollectionStatus
}
