import { Field, ID, ObjectType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'
import { SignatureCollectionCandidate } from './candidate.model'

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
}
