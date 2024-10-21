import { Field, ID, ObjectType } from '@nestjs/graphql'
import { AdvertEntity } from './advert.model'

@ObjectType('OfficialJournalOfIcelandCase')
export class Case {
  @Field(() => ID)
  id!: string

  @Field(() => AdvertEntity)
  advertType!: AdvertEntity | null

  @Field(() => String)
  advertTitle!: string | null

  @Field(() => AdvertEntity)
  involvedParty!: AdvertEntity | null

  @Field(() => String)
  createdAt!: string | null

  @Field(() => String)
  requestedPublicationDate!: string | null
}
