import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { YES } from './constants'

export const allowFakeCondition = (result = YES) => (answers: FormValue) =>
  getValueViaPath(answers, 'fakeData.useFakeData') === result


export const getSpuseNationalId = (answers: FormValue): string =>
  getValueViaPath(answers, 'spouse.person.nationalId') as string
