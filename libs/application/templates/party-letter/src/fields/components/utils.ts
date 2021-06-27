import { Endorsement } from '../../types/schema'

export const PAGE_SIZE = 10

export function paginate(
  endorsements: Endorsement[] | undefined,
  page_size: number,
  page_number: number,
) {
  if (endorsements === undefined) return
  else {
    return endorsements.slice(
      (page_number - 1) * page_size,
      page_number * page_size,
    )
  }
}

export function totalPages(endorsementsLength: number | undefined) {
  if (endorsementsLength === undefined) return 0
  else {
    return Math.ceil(endorsementsLength / PAGE_SIZE)
  }
}
