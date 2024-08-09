import { Locale } from '@island.is/shared/types'
import { DefenseChoiceEnum } from '../../models/defenseChoiceEnum.model'
import {
  CaseControllerGetAllCasesLocaleEnum,
  CaseControllerGetCaseLocaleEnum,
  CaseControllerGetSubpoenaLocaleEnum,
  CaseControllerUpdateSubpoenaLocaleEnum,
  UpdateSubpoenaDtoDefenderChoiceEnum,
} from '@island.is/clients/judicial-system-sp'

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoice = (
  choice: DefenseChoiceEnum,
): UpdateSubpoenaDtoDefenderChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case DefenseChoiceEnum.CHOOSE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.CHOOSE
    case DefenseChoiceEnum.WAIVE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.WAIVE
    case DefenseChoiceEnum.DELAY:
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELAY
    case DefenseChoiceEnum.DELEGATE:
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return UpdateSubpoenaDtoDefenderChoiceEnum.DELAY
  }
}

// Maps the application's locale to the judicial system's representation for updating subpoenas.
export const mapUpdateSubpoenaLocale = (
  locale: Locale,
): CaseControllerUpdateSubpoenaLocaleEnum => {
  switch (locale) {
    // 'is' and 'en' are supported locales, mapping them to the judicial system's enum values.
    case 'is':
      return CaseControllerUpdateSubpoenaLocaleEnum.Is
    case 'en':
      return CaseControllerUpdateSubpoenaLocaleEnum.En
    default:
      // Default to Icelandic ('is') if the locale is not recognized.
      return CaseControllerUpdateSubpoenaLocaleEnum.Is
  }
}

// Similar mapping functions for different endpoints or actions within the judicial system client.
// These functions ensure that the application uses the correct locale values when interacting with the judicial system's API.
export const mapSubpoenaLocale = (
  locale: Locale,
): CaseControllerGetSubpoenaLocaleEnum => {
  switch (locale) {
    case 'is':
      return CaseControllerGetSubpoenaLocaleEnum.Is
    case 'en':
      return CaseControllerGetSubpoenaLocaleEnum.En
    default:
      return CaseControllerGetSubpoenaLocaleEnum.Is
  }
}

export const mapCasesLocale = (
  locale: Locale,
): CaseControllerGetAllCasesLocaleEnum => {
  switch (locale) {
    case 'is':
      return CaseControllerGetAllCasesLocaleEnum.Is
    case 'en':
      return CaseControllerGetAllCasesLocaleEnum.En
    default:
      return CaseControllerGetAllCasesLocaleEnum.Is
  }
}

export const mapCaseLocale = (
  locale: Locale,
): CaseControllerGetCaseLocaleEnum => {
  switch (locale) {
    case 'is':
      return CaseControllerGetCaseLocaleEnum.Is
    case 'en':
      return CaseControllerGetCaseLocaleEnum.En
    default:
      return CaseControllerGetCaseLocaleEnum.Is
  }
}
