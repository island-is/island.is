import { Address, Child } from '../types'
import { parse, format } from 'date-fns'

export const formatAddress = (address: Address) => {
  if (!address) {
    return null
  }
  return `${address.streetName}, ${address.postalCode} ${address.city}`
}

export const getSelectedChildrenFromExternalData = (
  children: Child[],
  selectedChildren: string[],
): Child[] => {
  return children.filter((child) => selectedChildren.includes(child.nationalId))
}

export const formatDate = (date: string) => {
  try {
    const parsedDate = parse(date, 'yyyy-MM-dd', new Date())
    return format(parsedDate, 'dd.MM.yyyy')
  } catch {
    return date
  }
}
