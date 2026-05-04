import {
  DepositAmount,
  InspectorType,
  Payer,
  PaymentDay,
  PaymentMethod,
  PropertyPart,
  PropertyType,
  RentIndex,
  SecurityDepositType,
  SpecialGroup,
} from '@island.is/clients/hms-rental-agreement'
import { YesOrNoEnum } from '@island.is/application/core'
import {
  getPropertyId,
  getSecurityDepositTypeDescription,
  mapAppraisalUnits,
  mapPersonToArray,
  parseToNumber,
} from './utils'
import {
  RentalAgreementAnswers,
  RentalHousingCategoryClass,
} from '@island.is/application/templates/hms/rental-agreement'

export const mapRentalApplicationData = (
  applicationId: string,
  applicantNationalId: string,
  answers: RentalAgreementAnswers,
) => {
  const {
    landlords,
    signingParties,
    landlordRepresentatives,
    tenants,
    searchResults,
    units,
    categoryType,
    categoryClass,
    categoryClassGroup,
    description,
    rules,
    conditionDescription,
    inspector,
    inspectorName,
    files,
    fireBlanket,
    smokeDetectors,
    fireExtinguisher,
    emergencyExits,
    startDate,
    endDate,
    amount,
    isIndexConnected,
    indexRate,
    paymentMethodOptions,
    paymentMethodOther,
    paymentDateOptions,
    paymentDayOther,
    paymentMethodBankAccountNumber: bankAccount,
    paymentMethodNationalId,
    securityType,
    securityDepositAmount,
    securityAmountOther,
    otherInfo,
    bankGuaranteeInfo,
    thirdPartyGuaranteeInfo,
    insuranceCompanyInfo,
    mutualFundInfo,
    housingFundPayee,
    housingFundAmount,
    electricityCostPayee,
    electricityCostMeterNumber,
    electricityCostMeterStatus,
    electricityCostMeterStatusDate,
    heatingCostPayee,
    heatingCostMeterNumber,
    heatingCostMeterStatus,
    heatingCostMeterStatusDate,
    otherCostItems,
  } = answers

  const landlordsArray = [
    ...(landlords?.map((person) => ({
      ...mapPersonToArray(person),
      isRepresentative: false,
    })) || []),
    ...(landlordRepresentatives?.map((person) => ({
      ...mapPersonToArray(person),
      isRepresentative: true,
    })) || []),
  ]
  const signingPartiesArray = [
    ...(signingParties?.map((person) => ({
      ...mapPersonToArray(person),
      isRepresentative: false,
    })) || []),
  ]
  const tenantsArray = [
    ...(tenants?.map((person) => ({
      ...mapPersonToArray(person),
      isRepresentative: false,
    })) || []),
  ]

  const propertyId = getPropertyId(units)
  const appraisalUnits = mapAppraisalUnits(units)

  return {
    applicationId,
    initiatorNationalId: applicantNationalId,
    landlords: landlordsArray ?? [],
    signingParties: signingPartiesArray ?? [],
    tenants: tenantsArray ?? [],
    property: {
      address: searchResults?.address ?? null,
      municipality: searchResults?.municipalityName ?? null,
      zip: searchResults?.postalCode?.toString() ?? null,
      propertyId: propertyId?.toString() ?? null,
      appraisalUnits: appraisalUnits ?? null,
      part: PropertyPart.WHOLE, // Whole | Part
      type: categoryType as PropertyType,
      specialGroup:
        categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
          ? (categoryClassGroup as SpecialGroup)
          : SpecialGroup.NO,
    },
    lease: {
      description,
      rules,
      condition: conditionDescription || 'See files for info',
      inspectorType: inspector as InspectorType,
      hasInspectionFiles: files && files.length > 0,
      indipendantInspector: inspectorName,
      fireProtections: {
        fireBlanket: fireBlanket === YesOrNoEnum.YES ? 1 : 0,
        emergencyExits: parseToNumber(emergencyExits || '0'),
        smokeDetectors: parseToNumber(smokeDetectors || '0'),
        fireExtinguisher: parseToNumber(fireExtinguisher || '0'),
      },
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      isFixedTerm: Boolean(endDate),
      rent: {
        amount: parseToNumber(amount || '0'),
        index: isIndexConnected?.includes(YesOrNoEnum.YES)
          ? RentIndex.CONSUMER_PRICE_INDEX
          : RentIndex.NONE,
        indexRate:
          isIndexConnected?.includes(YesOrNoEnum.YES) && indexRate
            ? Number(indexRate.replace(',', '.'))
            : null,
      },
      payment: {
        method: paymentMethodOptions as PaymentMethod,
        otherMethod:
          paymentMethodOptions === PaymentMethod.OTHER
            ? paymentMethodOther
            : null,
        paymentDay: paymentDateOptions as PaymentDay,
        otherPaymentDay:
          paymentDateOptions === PaymentDay.OTHER ? paymentDayOther : null,
        bankAccountNumber:
          paymentMethodOptions === PaymentMethod.BANK_TRANSFER
            ? `${bankAccount?.bankNumber}-${bankAccount?.ledger}-${bankAccount?.accountNumber}`
            : null,
        nationalIdOfAccountOwner:
          paymentMethodOptions === PaymentMethod.BANK_TRANSFER
            ? paymentMethodNationalId
            : null,
      },
      securityDeposit: {
        type: securityType ? (securityType as SecurityDepositType) : undefined,
        otherType:
          securityType === SecurityDepositType.OTHER ? otherInfo : null,
        description: securityType
          ? getSecurityDepositTypeDescription(
              securityType,
              bankGuaranteeInfo,
              thirdPartyGuaranteeInfo,
              insuranceCompanyInfo,
              mutualFundInfo,
            )
          : null,
        amount: securityDepositAmount as DepositAmount,
        otherAmount:
          securityDepositAmount === DepositAmount.OTHER
            ? parseToNumber(securityAmountOther || '0')
            : 0,
      },
      otherFees: {
        housingFund: {
          payedBy:
            housingFundPayee === Payer.TENANT ? Payer.TENANT : Payer.LANDLORD,
          amount:
            housingFundAmount !== undefined && housingFundAmount !== null
              ? Number(housingFundAmount)
              : 0,
        },
        electricityCost: {
          payedBy:
            electricityCostPayee === Payer.TENANT
              ? Payer.TENANT
              : Payer.LANDLORD,
          meterNumber: electricityCostMeterNumber || null,
          meterStatus: electricityCostMeterStatus || null,
          meterStatusDate: electricityCostMeterStatusDate
            ? new Date(electricityCostMeterStatusDate)
            : null,
        },
        heatingCost: {
          payedBy:
            heatingCostPayee === Payer.TENANT ? Payer.TENANT : Payer.LANDLORD,
          meterNumber: heatingCostMeterNumber || null,
          meterStatus: heatingCostMeterStatus || null,
          meterStatusDate: heatingCostMeterStatusDate
            ? new Date(heatingCostMeterStatusDate)
            : null,
        },
        miscellaneousFees: otherCostItems
          ? Object.values(otherCostItems)
              .filter(
                (item) => item.description && item.description.trim() !== '',
              )
              .map((item) => ({
                name: item.description,
                amount: Number(item.amount) || 0,
              }))
          : [],
      },
    },
  }
}
