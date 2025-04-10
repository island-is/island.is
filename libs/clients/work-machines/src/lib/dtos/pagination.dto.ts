import { PaginationDto as GeneratedPaginationDto } from '../..'

export interface PaginationDto {
  totalCount: number
  pageSize: number
  currentPage: number
  totalPages: number
}

export const mapPaginationDto = (
  data?: GeneratedPaginationDto,
): PaginationDto | null => {
  if (
    !data?.totalCount ||
    !data?.pageSize ||
    !data?.totalPages ||
    !data?.currentPage
  ) {
    return null
  }

  return {
    totalCount: data.totalCount,
    pageSize: data.pageSize,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
  }
}
