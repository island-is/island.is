import { Field, ObjectType } from '@nestjs/graphql'

import { AdvertPaging } from './advert-paging.model'
import { Case } from './case.model'

@ObjectType('OfficialJournalOfIcelandCasesInProgressResponse')
export class CasesInProgressResponse {
  @Field(() => [Case])
  cases!: Case[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
