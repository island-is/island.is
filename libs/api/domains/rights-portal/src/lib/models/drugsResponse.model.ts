import { Field, ObjectType } from '@nestjs/graphql'
import { Drug } from './drugs.model'
import { PageInfo } from './pageInfo.model'

@ObjectType('RightsPortalDrugsResponse')
export class DrugsResponse {
  @Field(() => [Drug], { nullable: true })
  drugs?: Drug[] | null

  @Field(() => PageInfo, { nullable: true })
  pageInfo?: PageInfo | null

  @Field(() => Number, { nullable: true })
  totalCount?: number | null
}
