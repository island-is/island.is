// We don't know how many locales wwe will have in the future so we extends an object
export interface DictArray extends Record<string, any> {
  id: string
  defaultMessage: string
  description: string
  deprecated: boolean
}

export interface Message {
  defaultMessage: string
  description: string
}

export type MessageDict = Record<string, Message>
