import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { YES } from './constants'

export const allowFakeCondition =
  (result = YES) =>
  (answers: FormValue) =>
    getValueViaPath(answers, 'fakeData.useFakeData') === result

export const getSpouseNationalId = (answers: FormValue): string =>
  getValueViaPath(answers, 'spouse.person.nationalId') as string

export const removeCountryCode = (phone: string) => {
  return phone.replace(/(^00354|^\+354|\D)/g, '')
}
