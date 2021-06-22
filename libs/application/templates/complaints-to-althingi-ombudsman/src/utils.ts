import { Answer } from '@island.is/application/core'
import { ComplaineeTypes } from './constants'

export const isGovernmentComplainee = (answers: Answer) => {
  return (
    (answers as { complaint: { complainee: { type: string } } }).complaint
      ?.complainee?.type === ComplaineeTypes.GOVERNMENT
  )
}
