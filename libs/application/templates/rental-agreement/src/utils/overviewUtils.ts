import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
} from '@island.is/application/types'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import {
  AddressProps,
  ApplicantsInfo,
  LandlordInfo,
  Files,
  PropertyUnit,
  RentalAmountSection,
  RentalPeriodSection,
  SecurityDepositSection,
} from '../shared/types'
import {
  formatBankInfo,
  formatDate,
  formatNationalId,
  formatPhoneNumber,
  getRentalPropertySize,
  toISK,
} from './utils'
import * as m from '../lib/messages'
import { OtherFees, PropertyInfo } from './types'
import { RentalHousingCategoryClass } from '../shared/enums'
import { getOptionLabel } from './summaryUtils'
import {
  OtherFeesPayeeOptions,
  RentalHousingConditionInspector,
  RentalPaymentMethodOptions,
  SecurityDepositTypeOptions,
} from './enums'
import { formatCurrency } from '@island.is/shared/utils'
import {
  getOtherFeesPayeeOptions,
  getPaymentMethodOptions,
  getPropertyClassGroupOptions,
  getPropertyTypeOptions,
  getRentalAmountPaymentDateOptions,
  getSecurityDepositTypeOptions,
  getYesNoOptions,
} from './options'

const formatPartyItems = (
  items: Array<ApplicantsInfo | LandlordInfo>,
): Array<KeyValueItem> => {
  return (
    items
      ?.map((party) => {
        return [
          {
            width: 'full' as const,
            keyText: party.nationalIdWithName?.name ?? '',
            valueText: {
              ...m.summary.nationalIdPrefix,
              values: {
                nationalId: party.nationalIdWithName?.nationalId ?? '',
              },
            },
          },
          {
            width: 'half' as const,
            keyText: m.summary.emailLabel,
            valueText: party.email ?? '',
          },
          {
            width: 'half' as const,
            keyText: m.misc.phoneNumber,
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
  const landlords = getValueViaPath<Array<LandlordInfo>>(
    answers,
    'parties.landlordInfo.table',
  )?.filter((landlord) => !landlord.isRepresentative.includes('✔️'))

  if (!landlords) {
    return []
  }

  const items: Array<KeyValueItem> = formatPartyItems(landlords)

  return items
}

export const landlordRepresentativeOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const landlordsRepresentatives = getValueViaPath<Array<LandlordInfo>>(
    answers,
    'parties.landlordInfo.table',
  )?.filter((landlord) => landlord.isRepresentative.includes('✔️'))

  if (!landlordsRepresentatives) {
    return []
  }

  const items: Array<KeyValueItem> = formatPartyItems(landlordsRepresentatives)

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

  const items: Array<KeyValueItem> = formatPartyItems(tenants)

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
      keyText: m.misc.rooms,
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
          valueText: formatCurrency(toISK(otherFees.housingFundAmount ?? '0')),
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
    ? otherFees.otherCostItems
        ?.map((item) => {
          return [
            {
              width: 'half' as const,
              keyText: m.summary.otherCostsLabel,
              valueText: item.description || '-',
            },
            {
              width: 'half' as const,
              keyText: m.misc.amount,
              valueText: formatCurrency(item.amount ?? 0),
            },
          ]
        })
        .flat()
    : []

  const otherCostItemsSpacer =
    otherCostsItems && otherCostsItems?.length > 0 ? spacer : []

  return [
    {
      width: houseFundAmount.length > 0 ? 'half' : 'full',
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
      width: electricityCostMeterNumber.length > 0 ? 'half' : 'full',
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
      width: heatingCostMeterNumber.length > 0 ? 'half' : 'full',
      keyText: m.summary.heatingCostLabel,
      valueText: getOptionLabel(
        otherFees.heatingCost || '',
        getOtherFeesPayeeOptions,
        '',
      ),
    },
    ...heatingCostMeterNumber,
    ...otherCostItemsSpacer,
    ...(otherCostsItems ?? []),
  ]
}

export const priceOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const rentalAmount = getValueViaPath<RentalAmountSection>(
    answers,
    'rentalAmount',
  )
  const indexedRent = rentalAmount?.isIndexConnected?.includes(YesOrNoEnum.YES)

  const index = indexedRent
    ? [
        {
          width: 'half' as const,
          keyText: m.summary.indexRateLabel,
          valueText: rentalAmount?.indexRate ?? '-',
        },
      ]
    : []

  const paymentBankInfo =
    rentalAmount?.paymentMethodOptions ===
    RentalPaymentMethodOptions.BANK_TRANSFER
      ? [
          {
            width: 'half' as const,
            keyText: m.summary.paymentMethodNationalIdLabel,
            valueText: formatNationalId(
              rentalAmount?.paymentMethodNationalId ?? '-',
            ),
          },
          {
            width: 'half' as const,
            keyText: m.summary.paymentMethodAccountLabel,
            valueText: formatBankInfo(
              rentalAmount?.paymentMethodBankAccountNumber ?? {
                bankNumber: '',
                ledger: '',
                accountNumber: '',
              },
            ),
          },
        ]
      : []

  return [
    {
      width: 'half',
      keyText: m.summary.rentalAmountValue,
      valueText: formatCurrency(toISK(rentalAmount?.amount ?? '0')),
    },
    {
      width: 'half',
      keyText: m.summary.rentalAmountIndexedLabel,
      valueText: indexedRent ? m.misc.yes : m.misc.no,
    },
    ...index,
    {
      width: 'half',
      keyText: m.summary.paymentDateOptionsLabel,
      valueText: getOptionLabel(
        rentalAmount?.paymentDateOptions ?? '',
        getRentalAmountPaymentDateOptions,
        '',
      ),
    },
    {
      width: 'full',
      keyText: m.summary.paymentMethodTypeLabel,
      valueText:
        rentalAmount?.paymentMethodOptions === RentalPaymentMethodOptions.OTHER
          ? rentalAmount?.paymentMethodOther || '-'
          : getOptionLabel(
              rentalAmount?.paymentMethodOptions || '',
              getPaymentMethodOptions,
              '',
            ),
    },
    ...paymentBankInfo,
  ]
}

export const depositOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const deposit = getValueViaPath<SecurityDepositSection>(
    answers,
    'securityDeposit',
  )

  const securityAmount = deposit?.securityAmountOther
    ? deposit?.securityAmountOther
    : deposit?.securityAmountCalculated

  const securityType = deposit?.securityType as
    | SecurityDepositTypeOptions
    | undefined

  const securityNameKeyTexts = {
    [SecurityDepositTypeOptions.CAPITAL]:
      m.summary.securityTypeInstitutionLabel,
    [SecurityDepositTypeOptions.BANK_GUARANTEE]:
      m.summary.securityTypeInstitutionLabel,
    [SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE]:
      m.summary.securityTypeThirdPartyGuaranteeLabel,
    [SecurityDepositTypeOptions.INSURANCE_COMPANY]:
      m.summary.securityTypeInsuranceLabel,
    [SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND]:
      m.summary.securityTypeMutualFundLabel,
  }

  const securityNameValueTexts = {
    [SecurityDepositTypeOptions.CAPITAL]: deposit?.bankGuaranteeInfo || '-',
    [SecurityDepositTypeOptions.BANK_GUARANTEE]:
      deposit?.bankGuaranteeInfo || '-',
    [SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE]:
      deposit?.thirdPartyGuaranteeInfo || '-',
    [SecurityDepositTypeOptions.INSURANCE_COMPANY]:
      deposit?.insuranceCompanyInfo || '-',
    [SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND]:
      deposit?.landlordsMutualFundInfo || '-',
  }

  const securityName =
    securityType && securityType !== SecurityDepositTypeOptions.CAPITAL
      ? [
          {
            width: 'half' as const,
            keyText:
              securityNameKeyTexts[
                securityType as keyof typeof securityNameKeyTexts
              ] ?? '-',
            valueText:
              securityNameValueTexts[
                securityType as keyof typeof securityNameValueTexts
              ] ?? '-',
          },
        ]
      : []

  return [
    {
      width: 'full',
      keyText: m.misc.securityDeposit,
      valueText: formatCurrency(toISK(securityAmount ?? '0')),
    },
    {
      width: 'half',
      keyText: m.summary.securityTypeLabel,
      valueText: getOptionLabel(
        deposit?.securityType ?? '',
        getSecurityDepositTypeOptions,
        '',
      ),
    },
    ...securityName,
  ]
}

export const rentalPeriodOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const rentalPeriod = getValueViaPath<RentalPeriodSection>(
    answers,
    'rentalPeriod',
  )

  return [
    {
      width: 'snug',
      keyText: m.summary.rentalPeriodStartDateLabel,
      valueText: formatDate(rentalPeriod?.startDate ?? ''),
    },
    {
      width: 'snug',
      keyText: rentalPeriod?.isDefinite?.includes(YesOrNoEnum.YES)
        ? m.summary.rentalPeriodEndDateLabel
        : m.summary.rentalPeriodDefiniteLabel,
      valueText:
        rentalPeriod?.isDefinite?.includes(YesOrNoEnum.YES) &&
        rentalPeriod?.endDate
          ? formatDate(rentalPeriod?.endDate?.toString())
          : m.summary.rentalPeriodDefiniteValue,
    },
  ]
}

export const rentalPropertyOverview = (
  answers: FormValue,
  _externalData: ExternalData,
): Array<KeyValueItem> => {
  const searchResults = getValueViaPath<AddressProps>(
    answers,
    'registerProperty.searchresults',
  )
  const units =
    getValueViaPath<PropertyUnit[]>(
      answers,
      'registerProperty.searchresults.units',
    ) ?? []

  const uniqueUnitIds = new Set(units.map((unit) => unit.propertyCode))
  const unitIdsAsString = [...uniqueUnitIds].join(', ')
  const usageUnits = units.map(
    (unit) => `${unit.propertyUsageDescription} - ${unit.unitCode}`,
  )
  return [
    {
      width: 'full',
      keyText: searchResults?.label,
      valueText: [
        {
          ...m.summary.rentalPropertyId,
          values: {
            propertyId: unitIdsAsString,
          },
        },
        ...usageUnits,
      ],
    },
  ]
}
