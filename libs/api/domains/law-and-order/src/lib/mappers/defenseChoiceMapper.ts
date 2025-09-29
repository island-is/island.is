import {
  DefenderInfoDefenderChoiceEnum,
  SubpoenaDataDefaultDefenderChoiceEnum,
  UpdateSubpoenaDtoDefenderChoiceEnum,
} from '@island.is/clients/judicial-system-sp'
import { DefenseChoiceEnum } from '../models/law-and-order/defenseChoiceEnum.model'

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

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoiceForSummon = (
  choice?: DefenderInfoDefenderChoiceEnum,
): DefenseChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case DefenderInfoDefenderChoiceEnum.CHOOSE:
      return DefenseChoiceEnum.CHOOSE
    case DefenderInfoDefenderChoiceEnum.WAIVE:
      return DefenseChoiceEnum.WAIVE
    case DefenderInfoDefenderChoiceEnum.DELAY:
      return DefenseChoiceEnum.DELAY
    case DefenderInfoDefenderChoiceEnum.DELEGATE:
      return DefenseChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return DefenseChoiceEnum.DELAY
  }
}

// Maps the application's internal representation of defense choices to the judicial system's representation.
export const mapDefenseChoiceForSummonDefaultChoice = (
  choice?: SubpoenaDataDefaultDefenderChoiceEnum,
): DefenseChoiceEnum => {
  switch (choice) {
    // Each case maps a local enum value to the corresponding value in the judicial system's enum.
    case SubpoenaDataDefaultDefenderChoiceEnum.CHOOSE:
      return DefenseChoiceEnum.CHOOSE
    case SubpoenaDataDefaultDefenderChoiceEnum.WAIVE:
      return DefenseChoiceEnum.WAIVE
    case SubpoenaDataDefaultDefenderChoiceEnum.DELAY:
      return DefenseChoiceEnum.DELAY
    case SubpoenaDataDefaultDefenderChoiceEnum.DELEGATE:
      return DefenseChoiceEnum.DELEGATE
    default:
      // Provides a default mapping if the input doesn't match any known value.
      return DefenseChoiceEnum.DELAY
  }
}
