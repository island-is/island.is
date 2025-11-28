import { PageInfoDto } from '@island.is/nest/pagination'
import { PageInfo } from '../../../gen/fetch'

export const mapPageInfo = (pageInfo: PageInfo): PageInfoDto => {
  return {
    hasPreviousPage: pageInfo.hasPreviousPage ?? undefined,
    hasNextPage: pageInfo.hasNextPage ?? false,
    startCursor: pageInfo.startCursor ?? undefined,
    endCursor: pageInfo.endCursor ?? undefined,
  }
}
