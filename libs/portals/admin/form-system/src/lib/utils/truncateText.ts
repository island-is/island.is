import { ItemType } from './interfaces'

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

export const truncateName = (name: string, active: boolean, type: ItemType) => {
  let maxLength

  if (active) {
    switch (type) {
      case 'Section':
        maxLength = 23
        break
      case 'Screen':
        maxLength = 16
        break
      case 'Field':
        maxLength = 12
        break
      default:
        maxLength = 26
    }
  } else {
    switch (type) {
      case 'Section':
        maxLength = 26
        break
      case 'Screen':
        maxLength = 19
        break
      case 'Field':
        maxLength = 16
        break
      default:
        maxLength = 26
    }
  }

  return truncateText(name, maxLength)
}
