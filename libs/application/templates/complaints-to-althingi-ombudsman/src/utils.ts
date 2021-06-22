import { Answer } from '@island.is/application/core'
import { ComplaineeTypes } from './constants'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complainee: { type: string } }).complainee?.type ===
    ComplaineeTypes.GOVERNMENT
  )
}
