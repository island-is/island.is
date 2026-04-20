import { UseAdvertsVariables } from '../hooks'

export const getAdvertParams = (params?: UseAdvertsVariables) => {
  const variables: UseAdvertsVariables = {}

  if (params?.category) {
    variables.category = params.category
  }

  if (params?.dateFrom) {
    variables.dateFrom = params.dateFrom
  }

  if (params?.dateTo) {
    variables.dateTo = params.dateTo
  }

  if (params?.department) {
    variables.department = params.department
  }

  if (params?.involvedParty) {
    variables.involvedParty = params.involvedParty
  }

  if (params?.page) {
    variables.page = params.page
  }

  if (params?.pageSize) {
    variables.pageSize = params.pageSize
  }

  if (params?.search) {
    variables.search = params.search
  }

  if (params?.type) {
    variables.type = params.type
  }

  if (params?.mainType) {
    variables.mainType = params.mainType
  }

  if (params?.year) {
    variables.year = params.year
  }

  if (params?.sortBy) {
    variables.sortBy = params.sortBy
  }

  if (params?.direction) {
    variables.direction = params.direction
  }

  return variables
}
