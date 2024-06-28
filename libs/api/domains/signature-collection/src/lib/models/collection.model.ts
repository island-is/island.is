import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'
import { SignatureCollectionCandidate } from './candidate.model'
import { CollectionStatus } from './status.model'
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

  @Field()
  isPresidential!: boolean

  @Field()
  name!: string

  @Field(() => [SignatureCollectionArea])
  areas!: SignatureCollectionArea[]

  @Field(() => [SignatureCollectionCandidate])
  candidates!: SignatureCollectionCandidate[]

  @Field(() => CollectionStatus)
  status!: CollectionStatus

  @Field(() => CollectionType)
  type!: CollectionType
}

export enum CollectionType {
  Presidential = 'presidential',
  General = 'general',
  Local = 'local',
}

registerEnumType(CollectionType, {
  name: 'CollectionType',
  description: 'Election is of one of three types',
  valuesMap: {
    Presidential: {
      description: 'Election is presidential',
    },
    General: {
      description: 'Election is ',
    },
    Local: {
      description:
        'Collection has no open lists. Lists are being reviewed by processing admin.',
    },
  },
})

@ObjectType()
export class SignatureCollectionType {
  @Field(() => CollectionType)
  type!: CollectionType
}
