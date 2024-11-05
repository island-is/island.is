import {
  ExternalData,
  FormatMessage,
  FormValue,
} from '@island.is/application/types'
import { AbsenceDueToAccidentDto } from '@island.is/clients/work-accident-ver'
import { getValueViaPath } from '@island.is/application/core'
import { overview } from '../lib/messages'

export const getCauseAndConsequencesForOverview = (
  externalData: ExternalData,
  answers: FormValue,
  index: number,
  formatMessage: FormatMessage,
) => {
  // Absence
  const absenceDueToAccident =
    getValueViaPath<AbsenceDueToAccidentDto[]>(
      externalData,
      'aoshData.data.absenceDueToAccident',
    ) ?? []
  const absence = getValueViaPath<string>(answers, `absence[${index}]`)
  const chosenAbsenceDueToAccident = absenceDueToAccident.find(
    ({ code }) => absence === code,
  )

  // Circumstances
  const circumstances =
    getValueViaPath<object>(
      answers,
      `circumstances[${index}].physicalActivities`,
    ) ?? {}
  const chosenCircumstances = Object.values(circumstances)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Deviations
  const deviations =
    getValueViaPath<object>(answers, `deviations[${index}].workDeviations`) ??
    {}
  const chosenDeviations = Object.values(deviations)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Cause Of Injury
  const causeOfInjury =
    getValueViaPath<object>(
      answers,
      `causeOfInjury[${index}].contactModeOfInjury`,
    ) ?? {}
  const chosenCauseOfInjury = Object.values(causeOfInjury)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Type Of Injury
  const typeOfInjury =
    getValueViaPath<object>(answers, `typeOfInjury[${index}].typeOfInjury`) ??
    {}
  const chosenTypeOfInjury = Object.values(typeOfInjury)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Injured Body Parts
  const injuredBodyParts =
    getValueViaPath<object>(
      answers,
      `injuredBodyParts[${index}].partOfBodyInjured`,
    ) ?? {}
  const chosenInjuredBodyParts = Object.values(injuredBodyParts)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  return [
    `${formatMessage(overview.causeAndConsequences.absence)}: ${
      chosenAbsenceDueToAccident?.name
    }`,
    `${formatMessage(
      overview.causeAndConsequences.circumstances,
    )}: ${chosenCircumstances.join('. ')}`,
    `${formatMessage(
      overview.causeAndConsequences.deviations,
    )}: ${chosenDeviations.join('. ')}`,
    `${formatMessage(
      overview.causeAndConsequences.causeOfInjury,
    )}: ${chosenCauseOfInjury.join('. ')}`,
    `${formatMessage(
      overview.causeAndConsequences.typeOfInjury,
    )}: ${chosenTypeOfInjury.join('. ')}`,
    `${formatMessage(
      overview.causeAndConsequences.injuredBodyParts,
    )}: ${chosenInjuredBodyParts.join('. ')}`,
  ].filter((n) => n)
}
