import { getValueViaPath, NO, YES, YesOrNo } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const doOwnerAndOperatorHaveSameNationalId = (answers: FormValue) => {
  const isOwnerOtherThanImporter = getValueViaPath(
    answers,
    'ownerInformation.isOwnerOtherThanImporter',
    NO,
  ) as YesOrNo
  const ownerNationalId = getValueViaPath(
    answers,
    'ownerInformation.owner.nationalId',
    '',
  ) as string
  const importerNationalId = getValueViaPath(
    answers,
    'importerInformation.importer.nationalId',
    '',
  ) as string
  const hasOperator = getValueViaPath(
    answers,
    'operatorInformation.hasOperator',
    NO,
  ) as YesOrNo
  const operatorNationalId = getValueViaPath(
    answers,
    'operatorInformation.operator.nationalId',
    '',
  ) as string

  return isOwnerOtherThanImporter === YES
    ? hasOperator === YES && ownerNationalId === operatorNationalId
    : hasOperator === YES && importerNationalId === operatorNationalId
}
