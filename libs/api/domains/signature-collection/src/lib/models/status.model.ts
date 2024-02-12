import { Field, ObjectType, registerEnumType } from '@nestjs/graphql'

export enum CollectionStatus {
  Active = 'active',
  InReview = 'inReview',
  Processing = 'processing',
  Processed = 'processed',
  InActive = 'inActive',
}

registerEnumType(CollectionStatus, {
  name: 'CollectionStatus',
  description:
    'Collection has different statuses to represent the state of collection',
  valuesMap: {
    Active: {
      description:
        'Collection contains active list. In intial open time or an extended list.',
    },
    InReview: {
      description:
        'Collection has no open lists. Lists are being reviewed by processing admin.',
    },
    Processing: {
      description:
        'All lists for collection have been reviewed, the collection has not been marked as processed.',
    },
    Processed: {
      description: 'Collection has been marked as processed.',
    },
    InActive: {
      description:
        'Collection is not active, has been closed or has not yet started.',
    },
  },
})

@ObjectType()
export class SignatureCollectionStatus {
  @Field(() => CollectionStatus)
  status!: CollectionStatus
}

export enum ListStatus {
  Active = 'active',
  InReview = 'inReview',
  Reviewed = 'reviewed',
  Extendable = 'extendable',
  InActive = 'inActive',
}

registerEnumType(ListStatus, {
  name: 'ListStatus',
  description:
    'Lists have different statuses to indicate actions that can be preformed on them.',
  valuesMap: {
    Active: {
      description: 'List is active and open for digital signatures',
    },
    InReview: {
      description:
        'List is being reviewed by processing admin. Signatures can be uploaded on list. Comparison between lists and removal of signatures possible.',
    },
    Reviewed: {
      description:
        'List has been reviewed by admin. This is a state that can be toggled to InReview. Comparison between lists and removal of signatures possible.',
    },
    Extendable: {
      description:
        'Collection has been marked as processed and endtime on lists can be extended.',
    },
    InActive: {
      description: 'List is not active.',
    },
  },
})

@ObjectType()
export class SignatureCollectionListStatus {
  @Field(() => ListStatus)
  status!: ListStatus
}
