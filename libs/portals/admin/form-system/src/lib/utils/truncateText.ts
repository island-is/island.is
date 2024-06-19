import { ItemType } from './interfaces'

const truncateText = (text: string, maxLength: number) => {
  return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
}

export const truncateName = (name: string, active: boolean, type: ItemType) => {
  let maxLength

  if (active) {
    switch (type) {
      case 'Step':
        maxLength = 23
        break
      case 'Group':
        maxLength = 16
        break
      case 'Input':
        maxLength = 12
        break
      default:
        maxLength = 26
    }
  } else {
    switch (type) {
      case 'Step':
        maxLength = 26
        break
      case 'Group':
        maxLength = 19
        break
      case 'Input':
        maxLength = 16
        break
      default:
        maxLength = 26
    }
  }

  return truncateText(name, maxLength)
}
