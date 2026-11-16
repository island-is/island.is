import { ExternalData, FormValue } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import { getLanguageByCode } from '@island.is/shared/utils'
import { getApplicationAnswers } from './getApplicationAnswers'
import { getApplicationExternalData } from './getApplicationExternalData'

export const getSelectedChild = (
  answers: FormValue,
  externalData: ExternalData,
) => {
  const { selectedChildNationalId } = getApplicationAnswers(answers)
  const { children } = getApplicationExternalData(externalData)

  return children.find((child) => child.nationalId === selectedChildNationalId)
}

export const getSelectedChildOtherParent = (
  answers: FormValue,
  externalData: ExternalData,
) => getSelectedChild(answers, externalData)?.otherParent

export const getLanguageOptions = (externalData: ExternalData) => {
  const { languages } = getApplicationExternalData(externalData)

  return languages.map(({ id }) => ({
    value: id,
    label: getLanguageByCode(id)?.name ?? id,
  }))
}

export const getLocationOptions = (externalData: ExternalData) => {
  const { availableLocations } = getApplicationExternalData(externalData)

  return availableLocations.map(({ id, municipality }) => ({
    value: String(id),
    label: municipality,
  }))
}

export const getSpeechPathologistOptions = (externalData: ExternalData) => {
  const { speechPathologists } = getApplicationExternalData(externalData)

  return speechPathologists.map(({ kennitala, name }) => ({
    value: kennitala,
    label: name,
  }))
}

export const getRejectionReasonOptions = (
  externalData: ExternalData,
  locale?: Locale,
) => {
  const { rejectionReasons } = getApplicationExternalData(externalData)

  return rejectionReasons.map(({ id, isName, enName }) => ({
    value: String(id),
    label: locale === 'en' ? enName : isName,
  }))
}

export const getOptionLabel = (
  options: Array<{ value: string; label: string }>,
  value?: string,
) => options.find((option) => option.value === value)?.label ?? value
