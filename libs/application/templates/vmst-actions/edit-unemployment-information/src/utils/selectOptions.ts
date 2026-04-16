import React from 'react'
import { getValueViaPath } from '@island.is/application/core'
import { ExternalData } from '@island.is/application/types'
import { Locale } from '@island.is/shared/types'
import {
  GaldurDomainModelsSettingsPostcodesPostcodeDTO,
  GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO,
  GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO,
  GaldurDomainModelsSelectItem,
} from '@island.is/clients/vmst-unemployment'
import {
  A,
  A1,
  A2,
  AM,
  B,
  BE,
  C,
  C1,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
} from '../assets/drivingLicenses'

const SUPPORT_PATH = 'currentApplicationInformation.data.supportData'

const licenseComponents: Record<string, React.ComponentType> = {
  A,
  A1,
  A2,
  AM,
  B,
  BE,
  C,
  C1,
  C1E,
  CE,
  D,
  D1,
  D1E,
  DE,
}

export const getPostcodeOptions = (externalData: ExternalData) => {
  const nameAndPostcode =
    getValueViaPath<GaldurDomainModelsSettingsPostcodesPostcodeDTO[]>(
      externalData,
      `${SUPPORT_PATH}.postCodes`,
    ) || []
  return nameAndPostcode
    .filter(({ nameAndCode }) => nameAndCode && nameAndCode.length > 0)
    .map(({ nameAndCode, id }) => ({
      label: nameAndCode ?? '',
      value: id || '',
    }))
}

export const getDrivingLicenseOptions = (externalData: ExternalData) => {
  const types =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsDrivingLicensesDrivingLicensesDTO>
    >(externalData, `${SUPPORT_PATH}.drivingLicenses`) || []
  return types.map((type) => {
    const LicenseIconComponent = type.name
      ? licenseComponents[type.name]
      : undefined
    return {
      value: type.id?.toLowerCase() || '',
      label: type.name || '',
      rightContent: LicenseIconComponent
        ? React.createElement(LicenseIconComponent)
        : null,
    }
  })
}

export const getHeavyMachineryOptions = (
  externalData: ExternalData,
  locale: Locale,
) => {
  const rights =
    getValueViaPath<
      Array<GaldurDomainModelsSettingsHeavyMachineryLicensesHeavyMachineryLicensesDTO>
    >(externalData, `${SUPPORT_PATH}.workMachineRights`) || []
  return rights.map((right) => ({
    value: right.id?.toLowerCase() || '',
    label: locale === 'is' && right.name ? right.name : right.english ?? '',
  }))
}

export const getLanguageOptions = (
  externalData: ExternalData,
  locale: Locale,
) => {
  const languages =
    getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
      externalData,
      `${SUPPORT_PATH}.languages`,
    ) || []
  return languages.map((language) => ({
    value: language.id || '',
    label: (locale === 'is' ? language.name : language.english) || '',
  }))
}

export const getLanguageAbilityOptions = (
  externalData: ExternalData,
  locale: Locale,
) => {
  const skills =
    getValueViaPath<Array<GaldurDomainModelsSelectItem>>(
      externalData,
      `${SUPPORT_PATH}.languageAbilities`,
    ) || []
  return skills.map((skill) => ({
    value: skill.id || '',
    label: (locale === 'is' ? skill.name : skill.english ?? skill.name) || '',
  }))
}
