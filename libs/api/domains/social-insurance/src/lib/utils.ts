import {
  ApiProtectedV1PensionCalculatorPostRequest,
  TrWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorOutput,
} from '@island.is/clients/social-insurance-administration'
import {
  BasePensionType,
  LivingCondition,
  PensionCalculationInput,
  PeriodIncomeType,
} from './dtos/pensionCalculation.input'

import addYears from 'date-fns/addYears'
import differenceInMonths from 'date-fns/differenceInMonths'
import differenceInYears from 'date-fns/differenceInYears'
import { CustomPage } from '@island.is/cms'
import { PensionCalculationResponse } from './models/pension/pensionCalculation.model'

const basePensionTypeMapping: Record<BasePensionType, number> = {
  [BasePensionType.Retirement]: 1, // Ellilífeyrir
  [BasePensionType.FishermanRetirement]: 2, // Ellilífeyrir sjómanna
  [BasePensionType.Disability]: 3, // Örorkulífeyrir
  [BasePensionType.Rehabilitation]: 4, // Endurhæfingarlífeyrir
  [BasePensionType.HalfRetirement]: 5, // Hálfur Ellilífeyrir
}

const livingConditionMapping: Record<LivingCondition, number> = {
  [LivingCondition.LivesAlone]: 1,
  [LivingCondition.DoesNotLiveAlone]: 2,
}

const periodIncomeTypeMapping: Record<PeriodIncomeType, number> = {
  [PeriodIncomeType.Year]: 1,
  [PeriodIncomeType.Month]: 2,
}

export const mapPensionCalculationInput = (
  input: PensionCalculationInput,
  pageData?: CustomPage | null,
): ApiProtectedV1PensionCalculatorPostRequest['trWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorInput'] => {
  // Make sure all null values undefined since TR backend can't parse values if they are null
  for (const key in input) {
    if (input[key as keyof typeof input] === null) {
      input[key as keyof typeof input] = undefined as never
    }
  }

  let hurryPension = 0
  let delayPension = 0
  let startPension: 1 | 2 = 2

  if (
    typeof input.birthMonth === 'number' &&
    typeof input.birthYear === 'number'
  ) {
    const defaultPensionAge =
      (pageData?.configJson?.['defaultPensionAge'] as number) ?? 67
    const defaultPensionDate = addYears(
      new Date(input.birthYear, input.birthMonth + 1),
      defaultPensionAge,
    )

    const startDate =
      typeof input.startMonth === 'number' &&
      typeof input.startYear === 'number'
        ? new Date(input.startYear, input.startMonth)
        : defaultPensionDate

    // How many months is the user delaying or hurrying the pension payments
    const offset = differenceInMonths(startDate, defaultPensionDate)

    // Negative value indicates hurrying
    if (offset < 0) {
      hurryPension = Math.abs(offset)
    } else {
      delayPension = offset
    }

    startPension = startDate.getFullYear() >= 2018 ? 2 : 1
  }

  return {
    // Fields directly sent
    benefitsFromMunicipality: input.benefitsFromMunicipality,
    capitalIncome: input.capitalIncome,
    childCount: input.childCount,
    childSupportCount: input.childSupportCount,
    dateOfCalculations: input.dateOfCalculations
      ? new Date(input.dateOfCalculations)
      : undefined,
    hasSpouse: input.hasSpouse,
    foreignBasicPension: input.foreignBasicPension,
    income: input.income,
    otherIncome: input.otherIncome,
    livingConditionAbroadInYears: input.livingConditionAbroadInYears,
    pensionPayments: input.pensionPayments,
    premium: input.premium,
    privatePensionPayments: input.privatePensionPayments,
    taxCard: input.taxCard,
    ageOfFirst75DisabilityAssessment: input.ageOfFirst75DisabilityAssessment,
    installmentClaims: input.installmentClaims,
    livingConditionRatio: input.livingConditionRatio,
    mobilityImpairment: false,
    start: 1,

    // Fields that are calculated or mapped
    hurryPension,
    delayPension,
    startPension,
    typeOfBasePension: input.typeOfBasePension
      ? basePensionTypeMapping[input.typeOfBasePension]
      : input.typeOfBasePension,
    livingCondition: input.livingCondition
      ? livingConditionMapping[input.livingCondition]
      : input.livingCondition,
    yearOfBirth:
      typeof input.birthYear === 'number'
        ? input.birthYear >= 1952
          ? 2
          : 1
        : 2,
    typeOfPeriodIncome: input.typeOfPeriodIncome
      ? periodIncomeTypeMapping[input.typeOfPeriodIncome]
      : input.typeOfPeriodIncome,
    ageNow:
      typeof input.birthMonth === 'number' &&
      typeof input.birthYear === 'number'
        ? Math.abs(
            differenceInYears(
              new Date(input.birthYear, input.birthMonth),
              new Date(),
            ),
          )
        : undefined,
  }
}

export const groupPensionCalculationItems = (
  calculation: TrWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorOutput[],
  pageData: CustomPage | null,
) => {
  // A list containing the value for the last name in a group
  const groupCutoffValues = (pageData?.configJson?.[
    'groupCutOffValues'
  ] as string[]) ?? [
    'REIKNH.SAMTALSTRFYRIRSK',
    'REIKNH.SAMTALSTREFTIRSK',
    'REIKNH.SAMTALSEFTIRSK',
    'REIKNH.SAMTFJARMTEKESK',
    'REIKNH.TEKJURSAMTALS',
    'REIKNH.SAMTRADSTTEKESK',
  ]

  // These values are used as keys in the frontend to display translations
  const groupNames = [
    'TR_PAYMENTS',
    '',
    'INCOME_FROM_OTHERS',
    'CAPITAL_INCOME',
    'TOTAL_INCOME',
    '',
  ]

  const groups: PensionCalculationResponse['groups'] = []

  if (calculation?.length > 0) {
    let calculationIndex = 0
    // Group together items until we reach a cutoff value, then start forming the next group
    for (let i = 0; i < groupCutoffValues.length; i += 1) {
      const cutoffValue = groupCutoffValues[i]
      const items = []
      while (calculationIndex < calculation.length) {
        const item = calculation[calculationIndex]
        items.push(item)
        calculationIndex += 1
        if (item?.name === cutoffValue) {
          break
        }
      }
      groups.push({
        name: groupNames[i],
        items,
      })
    }
  }

  return groups
}

export const getPensionCalculationHighlightedItems = (
  calculation: TrWebCommonsExternalPortalsApiModelsPensionCalculatorPensionCalculatorOutput[],
  pageData: CustomPage | null,
): PensionCalculationResponse['highlightedItems'] => {
  const higlightedItemNames = (pageData?.configJson?.[
    'higlightedItemNames'
  ] as string[]) ?? ['REIKNH.SAMTRADSTTEKESK', 'REIKNH.SAMTALSTREFTIRSK']

  const highlightedItems = []

  for (const itemName of higlightedItemNames) {
    const item = calculation.find((item) => item?.name === itemName)
    if (item) {
      highlightedItems.push(item)
    }
  }

  return highlightedItems
}
