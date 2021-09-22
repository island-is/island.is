import { Field, ObjectType } from '@nestjs/graphql'
import { IPaginationInfo } from '../client/models/paginationInfo'

@ObjectType()
export class PaginationInfo {
  @Field({ nullable: true })
  pageSize?: number

  @Field({ nullable: true })
  pageNumber?: number

  @Field({ nullable: true })
  totalCount?: number

  @Field({ nullable: true })
  totalPages?: number

  @Field({ nullable: true })
  currentPage?: number

  @Field({ nullable: true })
  hasNext?: boolean

  @Field({ nullable: true })
  hasPrevious?: boolean
}

export const mapPaginationInfo = (
  paginationInfo: IPaginationInfo,
): PaginationInfo => ({
  pageSize: paginationInfo.PageSize,
  pageNumber: paginationInfo.PageNumber,
  totalCount: paginationInfo.TotalCount,
  totalPages: paginationInfo.TotalPages,
  currentPage: paginationInfo.CurrentPage,
  hasNext: paginationInfo.HasNext,
  hasPrevious: paginationInfo.HasPrevious,
})
