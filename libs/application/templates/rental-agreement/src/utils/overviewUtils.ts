import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import { ApplicantsInfo, Files, PropertyUnit } from '../shared/types'
import {
  formatPhoneNumber,
  getOtherFeesPayeeOptions,
  getPropertyClassGroupOptions,
  getPropertyTypeOptions,
  getRentalPropertySize,
  getYesNoOptions,
} from './utils'
import * as m from '../lib/messages'
import { OtherFees, PropertyInfo } from './types'
import { width } from 'pdfkit/js/page'
import { RentalHousingCategoryClass } from '../shared/enums'
import { getOptionLabel } from './summaryUtils'
import { OtherFeesPayeeOptions, RentalHousingConditionInspector } from './enums'
import { formatCurrency } from '@island.is/shared/utils'

const formatPatyItems = (items: Array<ApplicantsInfo>): Array<KeyValueItem> => {
  return (
    items
      ?.map((party, i) => {
        return [
          {
            width: 'full' as const,
            keyText: party.nationalIdWithName?.name ?? '',
            valueText: `Kennitala: ${
              party.nationalIdWithName?.nationalId ?? ''
            }`,
            // lineAboveKeyText: i > 0,
          },
          {
            width: 'half' as const,
            keyText: 'Netfang',
            valueText: party.email ?? '',
          },
          {
            width: 'half' as const,
            keyText: 'Símanúmer',
            valueText: formatPhoneNumber(party.phone ?? ''),
          },
        ]
      })
      .flat() ?? []
  )
}

export const landlordOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  console.log(answers)

  const landlords = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.landlordInfo.table',
  )

  if (!landlords) {
    return []
  }

  const items: Array<KeyValueItem> = formatPatyItems(landlords)

  return items
}

export const landlordRepresentativeOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const landlordsRepresentatives = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.landlordInfo.representativeTable',
  )

  if (!landlordsRepresentatives) {
    return []
  }

  const items: Array<KeyValueItem> = formatPatyItems(landlordsRepresentatives)

  return items
}

export const tenantOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const tenants = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.tenantInfo.table',
  )

  if (!tenants) {
    return []
  }

  const items: Array<KeyValueItem> = formatPatyItems(tenants)

  return items
}

export const rentalInfoOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const units =
    getValueViaPath<PropertyUnit[]>(
      answers,
      'registerProperty.searchresults.units',
    ) ?? []

  const numOfRooms = units
    ?.reduce((total, unit) => total + (unit.numOfRooms || 0), 0)
    .toString()

  const propertySize = getRentalPropertySize(units).toString()

  return [
    {
      width: 'half',
      keyText: m.summary.PropertyNumOfRoomsLabel,
      valueText: numOfRooms,
    },
    {
      width: 'half',
      keyText: m.summary.propertySizeLabel,
      valueText: propertySize,
    },
  ]
}

export const propertyRegistrationOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const propertyInfo = getValueViaPath<PropertyInfo>(answers, 'propertyInfo')

  const group =
    propertyInfo?.categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
      ? [
          {
            width: 'half' as const,
            keyText: m.summary.propertyClassGroupLabel,
            valueText: getOptionLabel(
              propertyInfo.categoryClassGroup || '',
              getPropertyClassGroupOptions,
              '',
            ),
          },
        ]
      : []

  return [
    {
      width: 'half',
      keyText: m.summary.propertyTypeLabel,
      valueText: getOptionLabel(
        propertyInfo?.categoryType || '',
        getPropertyTypeOptions,
        '',
      ),
    },
    {
      width: 'half',
      keyText: m.summary.propertyClassLabel,
      valueText:
        propertyInfo?.categoryClass ===
        RentalHousingCategoryClass.SPECIAL_GROUPS
          ? m.summary.propertyClassSpecialGroups
          : m.summary.propertyClassGeneralMarket,
    },
    ...group,
  ]
}

export const specialProvisionsOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const description = getValueViaPath<string>(
    answers,
    'specialProvisions.descriptionInput',
  )
  const rules = getValueViaPath<string>(answers, 'specialProvisions.rulesInput')
  return [
    {
      width: 'full',
      keyText: m.summary.propertyDescriptionLabel,
      valueText: description || '-',
    },
    {
      width: 'full',
      keyText: m.summary.PropertySpecialProvisionsLabel,
      valueText: rules || '-',
    },
  ]
}

export const propertyConditionOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const inspector = getValueViaPath<string>(answers, 'condition.inspector')
  const inspectorName = getValueViaPath<string>(
    answers,
    'condition.inspectorName',
  )
  const conditionDescription = getValueViaPath<string>(
    answers,
    'condition.resultsDescription',
  )

  return [
    {
      width: 'full',
      keyText: m.housingCondition.inspectorTitle,
      valueText:
        inspector === RentalHousingConditionInspector.INDEPENDENT_PARTY &&
        inspectorName
          ? {
              ...m.summary.propertyConditionInspectorValueIndependentParty,
              values: { inspectorName },
            }
          : m.summary.propertyConditionInspectorValueSelfPerformed,
    },
    {
      width: 'full',
      keyText: m.housingCondition.inspectionResultsTitle,
      valueText: conditionDescription,
    },
  ]
}

export const propertyConditionFilesOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<AttachmentItem> => {
  const files = getValueViaPath<Array<Files>>(answers, 'condition.resultsFiles')

  if (!files) {
    return []
  }

  return files.map((file) => ({
    fileName: file.name,
  }))
}

export const fireProtectionsOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const smokeDetectors = getValueViaPath<string>(
    answers,
    'fireProtections.smokeDetectors',
  )
  const fireExtinguisher = getValueViaPath<string>(
    answers,
    'fireProtections.fireExtinguisher',
  )
  const fireBlanket = getValueViaPath<string>(
    answers,
    'fireProtections.fireBlanket',
  )
  const emergencyExits = getValueViaPath<string>(
    answers,
    'fireProtections.emergencyExits',
  )

  return [
    {
      width: 'half',
      keyText: m.summary.fireProtectionsSmokeDetectorsLabel,
      valueText: smokeDetectors || '-',
    },

    {
      width: 'half',
      keyText: m.summary.fireProtectionsFireExtinguisherLabel,
      valueText: fireExtinguisher || '-',
    },
    {
      width: 'half',
      keyText: m.summary.fireProtectionsFireBlanketLabel,
      valueText: getOptionLabel(fireBlanket || '', getYesNoOptions, '') || '-',
    },
    {
      width: 'half',
      keyText: m.summary.fireProtectionsEmergencyExitsLabel,
      valueText:
        getOptionLabel(emergencyExits || '', getYesNoOptions, '') || '-',
    },
  ]
}

export const otherCostsOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  console.log('answers: ', answers)

  const otherFees = getValueViaPath<OtherFees>(answers, 'otherFees')

  if (!otherFees) {
    return []
  }
  const spacer = [
    {
      width: 'half' as const,
      lineAboveKeyText: true,
    },
    {
      width: 'half' as const,
    },
  ]

  const tenantPaysHouseFund =
    otherFees.housingFund === OtherFeesPayeeOptions.TENANT

  const houseFundAmount = tenantPaysHouseFund
    ? [
        {
          width: 'half' as const,
          keyText: m.summary.houseFundAmountLabel,
          valueText: formatCurrency(
            parseInt(otherFees.housingFundAmount ?? '0'),
          ),
        },
      ]
    : []

  const tenantPaysElectricity =
    otherFees.electricityCost === OtherFeesPayeeOptions.TENANT

  const electricityCostMeterNumber = tenantPaysElectricity
    ? [
        {
          width: 'half' as const,
          keyText: m.summary.electricityMeterNumberLabel,
          valueText: otherFees.electricityCostMeterNumber || '-',
        },
        {
          width: 'half' as const,
          keyText: m.summary.meterStatusLabel,
          valueText: otherFees.electricityCostMeterStatus || '-',
        },
        {
          width: 'half' as const,
          keyText: m.summary.dateOfMeterReadingLabel,
          valueText: otherFees.electricityCostMeterStatusDate || '-',
        },
      ]
    : []

  const tenantPaysHeating =
    otherFees.heatingCost === OtherFeesPayeeOptions.TENANT

  const heatingCostMeterNumber = tenantPaysHeating
    ? [
        {
          width: 'half' as const,
          keyText: m.summary.heatingCostMeterNumberLabel,
          valueText: otherFees.heatingCostMeterNumber || '-',
        },
        {
          width: 'half' as const,
          keyText: m.summary.meterStatusLabel,
          valueText: otherFees.heatingCostMeterStatus || '-',
        },
        {
          width: 'half' as const,
          keyText: m.summary.dateOfMeterReadingLabel,
          valueText: otherFees.heatingCostMeterStatusDate || '-',
        },
      ]
    : []

  const hasOtherCosts = otherFees.otherCosts?.includes(YesOrNoEnum.YES)

  const otherCostsItems = hasOtherCosts
    ? otherFees.otherCostItems?.map((item) => {
        return {
          width: 'half' as const,
          keyText: m.summary.otherCostsLabel,
          valueText: item.description || '-',
        }
      })
    : []

  const otherCostItemsSpacer =
    otherCostsItems && otherCostsItems?.length > 0 ? spacer : []

  return [
    {
      width: 'half',
      keyText: m.summary.houseFundLabel,
      valueText: getOptionLabel(
        otherFees.housingFund || '',
        getOtherFeesPayeeOptions,
        '',
      ),
    },
    ...houseFundAmount,
    ...spacer,
    {
      width: 'half',
      keyText: m.summary.electricityCostLabel,
      valueText: getOptionLabel(
        otherFees.electricityCost || '',
        getOtherFeesPayeeOptions,
        '',
      ),
    },
    ...electricityCostMeterNumber,
    ...spacer,
    {
      width: 'half',
      keyText: m.summary.heatingCostLabel,
      valueText: getOptionLabel(
        otherFees.heatingCost || '',
        getOtherFeesPayeeOptions,
        '',
      ),
    },
    ...heatingCostMeterNumber,
    ...otherCostItemsSpacer,
    // ...otherCostsItems
  ]
}
