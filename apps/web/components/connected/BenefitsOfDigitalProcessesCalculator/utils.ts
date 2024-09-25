import type { ConnectedComponent } from '@island.is/web/graphql/schema'

export interface UserInput {
  nameOfProcess: string
  amountPerYear: number
  processDurationInMinutes: number
  visitCountToCompleteProcess: number
  averageDistanceToProcessInKilometers: number
}

export interface Results {
  /* Ávinningur stofnunar */
  institutionGain: number

  /* Ávinningur borgara */
  citizenGain: number

  /* Ígildi stöðugildis */
  staffFreeToDoOtherThings: number

  /* Eknir kílómetrar */
  drivenKilometersSaved: number

  /* Sparaðir dagar hjá fólki við að sækja sér þjónustu */
  citizenTimeSaved: number
}

const avinningurR = (
  laun: number,
  f2f: number,
  lengd: number,
  magn: number,
) => {
  return (laun / 60) * f2f * lengd * magn
}

const avinningurB = (
  fornarkostnadur: number,
  lengd: number,
  f2f: number,
  km: number,
  kmgjald: number,
  okuhradi: number,
  magn: number,
) => {
  return (
    (f2f * 2 * km * kmgjald +
      (60 / okuhradi) * km * 2 * f2f * (fornarkostnadur / 60) +
      ((f2f * lengd) / 60) * fornarkostnadur) *
    magn
  )
}

export const calculateResults = (
  slice: ConnectedComponent,
  userInput: UserInput,
) => {
  const preConditions = {
    staffIncomePerHour:
      slice.configJson?.['Laun starfsmanna í framþjónustu krónur á klst'] ??
      6010,
    citizenIncomeLossPerHour:
      slice.configJson?.[
        'Fórnarkostnaður borgarar (meðallaun í landi á klst)'
      ] ?? 5122,
    kilometerFeePerKilometer: slice.configJson?.['Km gjald pr km'] ?? 141,
    averageDrivingSpeedInKilometersPerHour:
      slice.configJson?.['Meðalökuhraði km/klst'] ?? 40,
    staffHourAverageInYear:
      slice.configJson?.['Klukkustundir í stöðugildi á ári'] ?? 1606,
    ringRoadDistanceInKilometers:
      slice.configJson?.['Hringvegurinn í km'] ?? 1321,
    kgCo2PerDrivenKilometer: slice.configJson?.['Kg co2 á ekinn km'] ?? 0.1082,
  }

  const results: Results = {
    institutionGain: avinningurR(
      preConditions.staffIncomePerHour,
      userInput.visitCountToCompleteProcess,
      userInput.processDurationInMinutes,
      userInput.amountPerYear,
    ),
    citizenGain: avinningurB(
      preConditions.citizenIncomeLossPerHour,
      userInput.processDurationInMinutes,
      userInput.visitCountToCompleteProcess,
      userInput.averageDistanceToProcessInKilometers,
      preConditions.kilometerFeePerKilometer,
      preConditions.averageDrivingSpeedInKilometersPerHour,
      userInput.amountPerYear,
    ),
    staffFreeToDoOtherThings:
      (userInput.amountPerYear *
        userInput.processDurationInMinutes *
        userInput.visitCountToCompleteProcess) /
      60 /
      preConditions.staffHourAverageInYear,
    drivenKilometersSaved:
      userInput.amountPerYear *
      userInput.visitCountToCompleteProcess *
      2 *
      userInput.averageDistanceToProcessInKilometers,
    citizenTimeSaved:
      (((userInput.visitCountToCompleteProcess *
        2 *
        userInput.averageDistanceToProcessInKilometers *
        60) /
        preConditions.averageDrivingSpeedInKilometersPerHour +
        userInput.visitCountToCompleteProcess *
          userInput.processDurationInMinutes) *
        userInput.amountPerYear) /
      60 /
      24,
  }

  const gainPerCitizen = results.citizenGain + results.institutionGain
  const ringRoadTripsSaved =
    results.drivenKilometersSaved / preConditions.ringRoadDistanceInKilometers

  const co2 =
    preConditions.kgCo2PerDrivenKilometer * results.drivenKilometersSaved

  return { results, gainPerCitizen, ringRoadTripsSaved, co2 }
}
