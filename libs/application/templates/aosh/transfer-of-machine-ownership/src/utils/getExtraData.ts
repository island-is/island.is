import { Application, ExtraData } from '@island.is/application/types'
import { TransferOfMachineOwnershipAnswers } from '..'
export const getExtraData = (application: Application): ExtraData[] => {
  const answers = application.answers as TransferOfMachineOwnershipAnswers
  return [{ name: 'regNumber', value: answers?.machine?.regNumber ?? '' }]
}
