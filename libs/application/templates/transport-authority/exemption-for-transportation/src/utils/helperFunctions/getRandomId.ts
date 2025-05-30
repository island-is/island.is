import { uuid } from 'uuidv4'

export const getRandomId = (): string => {
  return uuid()
}
