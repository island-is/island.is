import {
  AttachmentItem,
  ExternalData,
  FormValue,
  KeyValueItem,
  UserProfile,
} from '@island.is/application/types'
import { getValueViaPath, YesOrNoEnum } from '@island.is/application/core'
import {
  AddressProps,
  ApplicantsInfo,
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
  ApplicantsRole,
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
  items: Array<ApplicantsInfo>,
): Array<KeyValueItem> => {
  return (
    items
      ?.map((party) => {
        return [
          {
            width: 'full' as const,
            keyText: party.nationalIdWithName?.name ?? '',
            valueText: {
              ...m.overview.nationalIdPrefix,
              values: {
                nationalId: formatNationalId(
                  party.nationalIdWithName?.nationalId ?? '',
                ),
              },
            },
          },
          {
            width: 'half' as const,
            keyText: m.overview.emailLabel,
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

const getApplicantsItem = (
  answers: FormValue,
  externalData: ExternalData,
  role: ApplicantsRole,
) => {
  const applicantsRole = getValueViaPath<string>(
    answers,
    'assignApplicantParty.applicantsRole',
  )

  if (applicantsRole !== role) {
    return []
  }

  const fullName = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.fullName',
  )
  const nationalId = getValueViaPath<string>(
    externalData,
    'nationalRegistry.data.nationalId',
  )
  const userProfile = getValueViaPath<UserProfile>(
    externalData,
    'userProfile.data',
  )

  return [
    {
      width: 'full' as const,
      keyText: fullName ?? '',
      valueText: {
        ...m.overview.nationalIdPrefix,
        values: {
          nationalId: formatNationalId(nationalId ?? ''),
        },
      },
    },
    {
      width: 'half' as const,
      keyText: m.misc.email,
      valueText: userProfile?.email ?? '',
    },
    {
      width: 'half' as const,
      keyText: m.misc.phoneNumber,
      valueText: formatPhoneNumber(userProfile?.mobilePhoneNumber ?? ''),
    },
  ]
}

export const landlordOverview = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const landlords = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.landlordInfo.table',
  )

  const applicantLandlords = getApplicantsItem(
    answers,
    externalData,
    ApplicantsRole.LANDLORD,
  )

  if (!landlords && applicantLandlords.length === 0) {
    return []
  }

  const items: Array<KeyValueItem> = landlords
    ? formatPartyItems(landlords)
    : []

  return [...applicantLandlords, ...items]
}

export const landlordRepresentativeOverview = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const landlordsRepresentatives = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.landlordInfo.representativeTable',
  )

  const applicantRepresentative = getApplicantsItem(
    answers,
    externalData,
    ApplicantsRole.REPRESENTATIVE,
  )

  if (!landlordsRepresentatives && applicantRepresentative.length === 0) {
    return []
  }

  const items: Array<KeyValueItem> = landlordsRepresentatives
    ? formatPartyItems(landlordsRepresentatives)
    : []

  return [...applicantRepresentative, ...items]
}

export const tenantOverview = (
  answers: FormValue,
  externalData: ExternalData,
): Array<KeyValueItem> => {
  const tenants = getValueViaPath<Array<ApplicantsInfo>>(
    answers,
    'parties.tenantInfo.table',
  )

  const applicantTenant = getApplicantsItem(
    answers,
    externalData,
    ApplicantsRole.TENANT,
  )

  if (!tenants && applicantTenant.length === 0) {
    return []
  }

  const items: Array<KeyValueItem> = tenants ? formatPartyItems(tenants) : []

  return [...applicantTenant, ...items]
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
      keyText: m.overview.propertySizeLabel,
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
            keyText: m.overview.propertyClassGroupLabel,
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
      keyText: m.overview.propertyTypeLabel,
      valueText: getOptionLabel(
        propertyInfo?.categoryType || '',
        getPropertyTypeOptions,
        '',
      ),
    },
    {
      width: 'half',
      keyText: m.overview.propertyClassLabel,
      valueText:
        propertyInfo?.categoryClass ===
        RentalHousingCategoryClass.SPECIAL_GROUPS
          ? m.overview.propertyClassSpecialGroups
          : m.overview.propertyClassGeneralMarket,
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
      keyText: m.overview.propertyDescriptionLabel,
      valueText: description || '-',
    },
    {
      width: 'full',
      keyText: m.overview.PropertySpecialProvisionsLabel,
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
              ...m.overview.propertyConditionInspectorValueIndependentParty,
              values: { inspectorName },
            }
          : m.overview.propertyConditionInspectorValueSelfPerformed,
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
      keyText: m.overview.fireProtectionsSmokeDetectorsLabel,
      valueText: smokeDetectors || '-',
    },

    {
      width: 'half',
      keyText: m.overview.fireProtectionsFireExtinguisherLabel,
      valueText: fireExtinguisher || '-',
    },
    {
      width: 'half',
      keyText: m.overview.fireProtectionsFireBlanketLabel,
      valueText: getOptionLabel(fireBlanket || '', getYesNoOptions, '') || '-',
    },
    {
      width: 'half',
      keyText: m.overview.fireProtectionsEmergencyExitsLabel,
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
          keyText: m.overview.houseFundAmountLabel,
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
          keyText: m.overview.electricityMeterNumberLabel,
          valueText: otherFees.electricityCostMeterNumber || '-',
        },
        {
          width: 'half' as const,
          keyText: m.overview.meterStatusLabel,
          valueText: otherFees.electricityCostMeterStatus || '-',
        },
        {
          width: 'half' as const,
          keyText: m.overview.dateOfMeterReadingLabel,
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
          keyText: m.overview.heatingCostMeterNumberLabel,
          valueText: otherFees.heatingCostMeterNumber || '-',
        },
        {
          width: 'half' as const,
          keyText: m.overview.meterStatusLabel,
          valueText: otherFees.heatingCostMeterStatus || '-',
        },
        {
          width: 'half' as const,
          keyText: m.overview.dateOfMeterReadingLabel,
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
              keyText: m.overview.otherCostsLabel,
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
      keyText: m.overview.houseFundLabel,
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
      keyText: m.overview.electricityCostLabel,
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
      keyText: m.overview.heatingCostLabel,
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
          keyText: m.overview.indexRateLabel,
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
            keyText: m.overview.paymentMethodNationalIdLabel,
            valueText: formatNationalId(
              rentalAmount?.paymentMethodNationalId ?? '-',
            ),
          },
          {
            width: 'half' as const,
            keyText: m.overview.paymentMethodAccountLabel,
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
      keyText: m.overview.rentalAmountValue,
      valueText: formatCurrency(toISK(rentalAmount?.amount ?? '0')),
    },
    {
      width: 'half',
      keyText: m.overview.rentalAmountIndexedLabel,
      valueText: indexedRent ? m.misc.yes : m.misc.no,
    },
    ...index,
    {
      width: 'half',
      keyText: m.overview.paymentDateOptionsLabel,
      valueText: getOptionLabel(
        rentalAmount?.paymentDateOptions ?? '',
        getRentalAmountPaymentDateOptions,
        '',
      ),
    },
    {
      width: 'full',
      keyText: m.overview.paymentMethodTypeLabel,
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
      m.overview.securityTypeInstitutionLabel,
    [SecurityDepositTypeOptions.BANK_GUARANTEE]:
      m.overview.securityTypeInstitutionLabel,
    [SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE]:
      m.overview.securityTypeThirdPartyGuaranteeLabel,
    [SecurityDepositTypeOptions.INSURANCE_COMPANY]:
      m.overview.securityTypeInsuranceLabel,
    [SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND]:
      m.overview.securityTypeMutualFundLabel,
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
      deposit?.mutualFundInfo || '-',
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
      keyText: m.overview.securityTypeLabel,
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
      keyText: m.overview.rentalPeriodStartDateLabel,
      valueText: formatDate(rentalPeriod?.startDate ?? ''),
    },
    {
      width: 'snug',
      keyText: rentalPeriod?.isDefinite?.includes(YesOrNoEnum.YES)
        ? m.overview.rentalPeriodEndDateLabel
        : m.overview.rentalPeriodDefiniteLabel,
      valueText:
        rentalPeriod?.isDefinite?.includes(YesOrNoEnum.YES) &&
        rentalPeriod?.endDate
          ? formatDate(rentalPeriod?.endDate?.toString())
          : m.overview.rentalPeriodDefiniteValue,
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
          ...m.overview.rentalPropertyId,
          values: {
            propertyId: unitIdsAsString,
          },
        },
        ...usageUnits,
      ],
    },
  ]
}
