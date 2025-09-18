import { RentalHousingCategoryClass } from '../shared'
import {
  RentalHousingCategoryClassGroup,
  RentalHousingCategoryTypes,
  RentalHousingConditionInspector,
  RentalAmountPaymentDateOptions,
  OtherFeesPayeeOptions,
  SecurityDepositTypeOptions,
  SecurityDepositAmountOptions,
  RentalPaymentMethodOptions,
  NextStepInReviewOptions,
  EmergencyExitOptions,
} from './enums'
import * as m from '../lib/messages'

export const getPropertyTypeOptions = () => [
  {
    value: RentalHousingCategoryTypes.ENTIRE_HOME,
    label: m.registerProperty.category.typeSelectLabelEntireHome,
  },
  {
    value: RentalHousingCategoryTypes.ROOM,
    label: m.misc.rooms,
  },
  {
    value: RentalHousingCategoryTypes.COMMERCIAL,
    label: m.registerProperty.category.typeSelectLabelCommercial,
  },
]

export const getPropertyClassOptions = () => [
  {
    value: RentalHousingCategoryClass.SPECIAL_GROUPS,
    label: m.registerProperty.category.classSelectLabelIsSpecialGroups,
  },
  {
    value: RentalHousingCategoryClass.GENERAL_MARKET,
    label: m.registerProperty.category.classSelectLabelNotSpecialGroups,
  },
]

export const getPropertyClassGroupOptions = () => [
  {
    value: RentalHousingCategoryClassGroup.STUDENT_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelStudentHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.SENIOR_CITIZEN_HOUSING,
    label:
      m.registerProperty.category.classGroupSelectLabelSeniorCitizenHousing,
  },
  {
    value: RentalHousingCategoryClassGroup.COMMUNE,
    label: m.registerProperty.category.classGroupSelectLabelCommune,
  },
  {
    value: RentalHousingCategoryClassGroup.HALFWAY_HOUSE,
    label: m.registerProperty.category.classGroupSelectLabelHalfwayHouse,
  },
  {
    value: RentalHousingCategoryClassGroup.INCOME_BASED_HOUSING,
    label: m.registerProperty.category.classGroupSelectLabelIncomeBasedHousing,
  },
]

export const getInspectorOptions = () => [
  {
    value: RentalHousingConditionInspector.CONTRACT_PARTIES,
    label: m.housingCondition.inspectorOptionContractParties,
  },
  {
    value: RentalHousingConditionInspector.INDEPENDENT_PARTY,
    label: m.housingCondition.inspectorOptionIndependentParty,
  },
]

export const getRentalAmountPaymentDateOptions = () => [
  {
    value: RentalAmountPaymentDateOptions.FIRST_DAY,
    label: m.rentalAmount.paymentDateOptionFirstDay,
  },
  {
    value: RentalAmountPaymentDateOptions.LAST_DAY,
    label: m.rentalAmount.paymentDateOptionLastDay,
  },
  {
    value: RentalAmountPaymentDateOptions.OTHER,
    label: m.rentalAmount.paymentDateOptionOther,
  },
]

export const getSecurityDepositTypeOptions = () => [
  {
    label: m.securityDeposit.typeSelectionBankGuaranteeTitle,
    value: SecurityDepositTypeOptions.BANK_GUARANTEE,
  },
  {
    label: m.securityDeposit.typeSelectionCapitalTitle,
    value: SecurityDepositTypeOptions.CAPITAL,
  },
  {
    label: m.securityDeposit.typeSelectionThirdPartyGuaranteeTitle,
    value: SecurityDepositTypeOptions.THIRD_PARTY_GUARANTEE,
  },
  {
    label: m.securityDeposit.typeSelectionInsuranceCompanyTitle,
    value: SecurityDepositTypeOptions.INSURANCE_COMPANY,
  },
  {
    label: m.securityDeposit.typeSelectionMutualFundTitle,
    value: SecurityDepositTypeOptions.LANDLORDS_MUTUAL_FUND,
  },
  {
    label: m.securityDeposit.typeSelectionOtherTitle,
    value: SecurityDepositTypeOptions.OTHER,
  },
]

export const getSecurityAmountOptions = () => [
  {
    label: m.securityDeposit.amountSelection1Month,
    value: SecurityDepositAmountOptions.ONE_MONTH,
  },
  {
    label: m.securityDeposit.amountSelection2Month,
    value: SecurityDepositAmountOptions.TWO_MONTHS,
  },
  {
    label: m.securityDeposit.amountSelection3Month,
    value: SecurityDepositAmountOptions.THREE_MONTHS,
  },
  {
    label: m.securityDeposit.amountSelectionOther,
    value: SecurityDepositAmountOptions.OTHER,
  },
]

export const getOtherFeesPayeeOptions = () => [
  {
    value: OtherFeesPayeeOptions.LANDLORD,
    label: m.otherFees.paidByLandlordLabel,
  },
  {
    value: OtherFeesPayeeOptions.TENANT,
    label: m.otherFees.paidByTenantLabel,
  },
]

export const getPaymentMethodOptions = () => [
  {
    value: RentalPaymentMethodOptions.BANK_TRANSFER,
    label: m.rentalAmount.paymentMethodBankTransferLabel,
  },
  {
    value: RentalPaymentMethodOptions.PAYMENT_SLIP,
    label: m.rentalAmount.paymentMethodPaymentSlipLabel,
  },
  {
    value: RentalPaymentMethodOptions.OTHER,
    label: m.rentalAmount.paymentMethodOtherLabel,
  },
]

export const getNextStepInReviewOptions = () => [
  {
    value: NextStepInReviewOptions.GO_TO_SIGNING,
    label: m.inReview.reviewInfo.nextStepToSigningButtonText,
  },
  {
    value: NextStepInReviewOptions.EDIT_APPLICATION,
    label: m.inReview.reviewInfo.nextStepToEditButtonText,
  },
]

export const getYesNoOptions = () => [
  {
    value: EmergencyExitOptions.YES,
    label: m.misc.yes,
  },
  {
    value: EmergencyExitOptions.NO,
    label: m.misc.no,
  },
]
