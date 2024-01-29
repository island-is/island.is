import { Field, ID, ObjectType, OmitType } from '@nestjs/graphql'
import { SignatureCollectionArea } from './area.model'
import { SignatureCollectionCandidate } from './candidate.model'

@ObjectType()
export class SignatureCollectionInfo {
  @Field()
  id!: number

  @Field(() => Date)
  endTime!: Date

  @Field(() => Date)
  startTime!: Date

  @Field()
  isActive!: boolean

  @Field()
  isPresidential!: boolean
}

@ObjectType()
export class SignatureCollection extends OmitType(SignatureCollectionInfo, [
  'id',
]) {
  @Field(() => ID)
  id!: string

  @Field()
  name!: string

  @Field(() => [SignatureCollectionArea])
  areas!: SignatureCollectionArea[]

  @Field(() => [SignatureCollectionCandidate])
  candidates!: SignatureCollectionCandidate[]
}
