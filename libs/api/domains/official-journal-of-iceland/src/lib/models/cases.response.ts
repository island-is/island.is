import { Field, ObjectType } from '@nestjs/graphql'

import { AdvertPaging } from './advert-paging.model'
import { CaseInProgress } from './case.model'

@ObjectType('OfficialJournalOfIcelandCasesInProgressResponse')
export class CasesInProgressResponse {
  @Field(() => [CaseInProgress])
  cases!: CaseInProgress[]

  @Field(() => AdvertPaging)
  paging!: AdvertPaging
}
