import { v4 as uuid } from 'uuid'

export const getRandomId = (): string => {
  return uuid()
}
