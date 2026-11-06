import { Field, Int, ObjectType } from '@nestjs/graphql'

import {
  DraftEmployeeModel,
  DraftEmployeeWithStepsModel,
} from './draftEmployee.model'

@ObjectType('DirectorateOfEqualityPaging')
export class PagingModel {
  @Field(() => Int)
  page!: number

  @Field(() => Int)
  totalPages!: number

  @Field(() => Int)
  totalItems!: number

  @Field(() => Int, { nullable: true })
  nextPage?: number | null

  @Field(() => Int, { nullable: true })
  previousPage?: number | null

  @Field(() => Int)
  pageSize!: number

  @Field(() => Boolean)
  hasNextPage!: boolean

  @Field(() => Boolean)
  hasPreviousPage!: boolean
}

@ObjectType('DirectorateOfEqualityDraftEmployeesResponse')
export class DraftEmployeesResponseModel {
  @Field(() => [DraftEmployeeModel])
  employees!: DraftEmployeeModel[]

  @Field(() => PagingModel)
  paging!: PagingModel
}

@ObjectType('DirectorateOfEqualityDraftEmployeesWithStepsResponse')
export class DraftEmployeesWithStepsResponseModel {
  @Field(() => [DraftEmployeeWithStepsModel])
  employees!: DraftEmployeeWithStepsModel[]

  @Field(() => PagingModel)
  paging!: PagingModel
}
