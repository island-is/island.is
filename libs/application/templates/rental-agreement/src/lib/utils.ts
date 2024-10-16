import { Application } from '@island.is/application/types'
import { rentalHousingConditionInspector } from './constants'
import * as m from './messages'
import { getValueViaPath } from '@island.is/application/core'

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const getApplicationAnswers = (answers: Application['answers']) => {
  const inspectorOptions = getValueViaPath(
    answers,
    'rentalHousingConditionInspector',
  ) as rentalHousingConditionInspector

  return {
    inspectorOptions,
  }
}

export const getInspectorOptions = () => [
  {
    value: rentalHousingConditionInspector.CONTRACT_PARTIES,
    label: m.housingCondition.inspectorOptionContractParties,
  },
  {
    value: rentalHousingConditionInspector.INDEPENDENT_PARTY,
    label: m.housingCondition.inspectorOptionIndependentParty,
  },
]
