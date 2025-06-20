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
    data?.totalCount == undefined ||
    data?.pageSize == undefined  ||
    data?.totalPages == undefined  ||
    data?.currentPage == undefined
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
