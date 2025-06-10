import { MessageDescriptor } from 'react-intl'

export interface IndexableObject {
  [index: number]: Array<string>
}

export interface CSVError {
  items: Array<number>
  error: MessageDescriptor
}
