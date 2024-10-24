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
  const absenceDueToAccident = getValueViaPath(
    externalData,
    'aoshData.data.absenceDueToAccident',
    [],
  ) as AbsenceDueToAccidentDto[]
  const absence = getValueViaPath(answers, `absence[${index}]`) as string
  const chosenAbsenceDueToAccident = absenceDueToAccident.find(
    ({ code }) => absence === code,
  )

  // Circumstances
  const circumstances = getValueViaPath(
    answers,
    `circumstances[${index}].physicalActivities`,
    {},
  ) as object
  const chosenCircumstances = Object.values(circumstances)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Deviations
  const deviations = getValueViaPath(
    answers,
    `deviations[${index}].workDeviations`,
    {},
  ) as object
  const chosenDeviations = Object.values(deviations)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Cause Of Injury
  const causeOfInjury = getValueViaPath(
    answers,
    `causeOfInjury[${index}].contactModeOfInjury`,
    {},
  ) as object
  const chosenCauseOfInjury = Object.values(causeOfInjury)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Type Of Injury
  const typeOfInjury = getValueViaPath(
    answers,
    `typeOfInjury[${index}].typeOfInjury`,
    {},
  ) as object
  const chosenTypeOfInjury = Object.values(typeOfInjury)
    .map((value: { label: string; value: string }[]) => {
      return value.map(({ label }) => {
        return label
      })
    })
    .flat()

  // Injured Body Parts
  const injuredBodyParts = getValueViaPath(
    answers,
    `injuredBodyParts[${index}].partOfBodyInjured`,
    {},
  ) as object
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
