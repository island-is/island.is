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
} from '@island.is/application/templates/rental-agreement'

export const mapRentalApplicationData = (
  applicationId: string,
  applicantNationalId: string,
  answers: RentalAgreementAnswers,
) => {
  const {
    landlords,
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
    rentalAmount,
    isIndexConnected,
    indexRate,
    paymentMethod,
    paymentMethodOther,
    paymentDay,
    paymentDayOther,
    bankAccountNumber,
    nationalIdOfAccountOwner,
    securityDepositType,
    securityDepositAmount,
    securityDepositAmountOther,
    otherInfo,
    bankGuaranteeInfo,
    thirdPartyGuaranteeInfo,
    insuranceCompanyInfo,
    landlordsMutualFundInfo,
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

  const landlordsArray = landlords?.map(mapPersonToArray)
  const tenantsArray = tenants?.map(mapPersonToArray)

  const propertyId = getPropertyId(units)
  const appraisalUnits = mapAppraisalUnits(units)

  return {
    applicationId,
    initiatorNationalId: applicantNationalId,
    landlords: landlordsArray ?? [],
    tenants: tenantsArray ?? [],
    property: {
      address: searchResults?.address ?? null,
      municipality: searchResults?.municipalityName ?? null,
      zip: searchResults?.postalCode?.toString() ?? null,
      propertyId: propertyId?.toString() ?? null,
      appraisalUnits: appraisalUnits ?? null,
      part: PropertyPart.Whole, // Whole | Part
      type: categoryType as PropertyType,
      specialGroup:
        categoryClass === RentalHousingCategoryClass.SPECIAL_GROUPS
          ? (categoryClassGroup as SpecialGroup)
          : SpecialGroup.No,
    },
    lease: {
      description,
      rules,
      condition: conditionDescription || 'See files for info',
      inspectorType: inspector as InspectorType,
      hasInspectionFiles: files && files.length > 0,
      indipendantInspector: inspectorName,
      fireProtections: {
        fireBlanket: parseToNumber(fireBlanket || '0'),
        emergencyExits: parseToNumber(emergencyExits || '0'),
        smokeDetectors: parseToNumber(smokeDetectors || '0'),
        fireExtinguisher: parseToNumber(fireExtinguisher || '0'),
      },
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : null,
      isFixedTerm: Boolean(endDate),
      rent: {
        amount: parseToNumber(rentalAmount || '0'),
        index: isIndexConnected?.includes(YesOrNoEnum.YES)
          ? RentIndex.ConsumerPriceIndex
          : RentIndex.None,
        indexRate:
          isIndexConnected?.includes(YesOrNoEnum.YES) && indexRate
            ? Number(indexRate.replace(',', '.'))
            : null,
      },
      payment: {
        method: paymentMethod as PaymentMethod,
        otherMethod:
          paymentMethod === PaymentMethod.Other ? paymentMethodOther : null,
        paymentDay: paymentDay as PaymentDay,
        otherPaymentDay:
          paymentDay === PaymentDay.Other ? paymentDayOther : null,
        bankAccountNumber:
          paymentMethod === PaymentMethod.BankTransfer
            ? bankAccountNumber
            : null,
        nationalIdOfAccountOwner:
          paymentMethod === PaymentMethod.BankTransfer
            ? nationalIdOfAccountOwner
            : null,
      },
      securityDeposit: {
        type: securityDepositType
          ? (securityDepositType as SecurityDepositType)
          : undefined,
        otherType:
          securityDepositType === SecurityDepositType.Other ? otherInfo : null,
        description: securityDepositType
          ? getSecurityDepositTypeDescription(
              securityDepositType,
              bankGuaranteeInfo,
              thirdPartyGuaranteeInfo,
              insuranceCompanyInfo,
              landlordsMutualFundInfo,
            )
          : null,
        amount: securityDepositAmount as DepositAmount,
        otherAmount:
          securityDepositAmount === DepositAmount.Other
            ? parseToNumber(securityDepositAmountOther || '0')
            : 0,
      },
      otherFees: {
        housingFund: {
          payedBy:
            housingFundPayee === Payer.Tenant ? Payer.Tenant : Payer.Landlord,
          amount:
            housingFundAmount !== undefined && housingFundAmount !== null
              ? Number(housingFundAmount)
              : 0,
        },
        electricityCost: {
          payedBy:
            electricityCostPayee === Payer.Tenant
              ? Payer.Tenant
              : Payer.Landlord,
          meterNumber: electricityCostMeterNumber || null,
          meterStatus: electricityCostMeterStatus || null,
          meterStatusDate: electricityCostMeterStatusDate
            ? new Date(electricityCostMeterStatusDate)
            : null,
        },
        heatingCost: {
          payedBy:
            heatingCostPayee === Payer.Tenant ? Payer.Tenant : Payer.Landlord,
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
