export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  INREVIEW = 'inReview',
  SUMMARY = 'summary',
  SIGNING = 'signing',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  ASSIGNEE = 'assignee',
  INSTITUTION = 'institution',
}

export enum Routes {
  PARTIESINFORMATION = 'partiesInfo',
  REGISTERPROPERTY = 'registerProperty',
  PROPERTYINFORMATION = 'propertyInfo',
  PROPERTYSEARCH = 'registerProperty.searchresults',
  SPECIALPROVISIONS = 'specialProvisions',
  CONDITION = 'condition',
  FIREPROTECTIONS = 'fireProtections',
  RENTALPERIOD = 'rentalPeriod',
  RENTALAMOUNT = 'rentalAmount',
  SECURITYDEPOSIT = 'securityDeposit',
  OTHERFEES = 'otherFees',
  SUMMARY = 'summary',
}

export enum NextStepInReviewOptions {
  GO_TO_SIGNING = 'goToSigning',
  EDIT_APPLICATION = 'editApplication',
}

export enum PropertyPart {
  WHOLE = 'Whole',
  PART = 'Part',
}

// If any of the below enums are changed, make sure to update any references
// in the rental-agreement template and the rental-agreement template-api-modules if needed
export enum RentalHousingCategoryTypes {
  ENTIRE_HOME = 'House_Apartment',
  ROOM = 'Room',
  COMMERCIAL = 'Commercial',
}

export enum RentalHousingCategoryClassGroup {
  STUDENT_HOUSING = 'Student',
  SENIOR_CITIZEN_HOUSING = 'Elderly',
  COMMUNE = 'Disabled',
  HALFWAY_HOUSE = 'HalfwayHouse',
  INCOME_BASED_HOUSING = 'IncomeRestricted',
}

export enum RentalHousingConditionInspector {
  CONTRACT_PARTIES = 'ContractParties',
  INDEPENDENT_PARTY = 'Indipendant',
}

export enum RentalAmountIndexTypes {
  CONSUMER_PRICE_INDEX = 'consumerPriceIndex',
}

export enum RentalAmountPaymentDateOptions {
  FIRST_DAY = 'First',
  LAST_DAY = 'Last',
  OTHER = 'Other',
}

export enum RentalPaymentMethodOptions {
  BANK_TRANSFER = 'BankTransfer',
  PAYMENT_SLIP = 'PaymentSlip',
  OTHER = 'Other',
}

export enum SecurityDepositTypeOptions {
  BANK_GUARANTEE = 'BankGuarantee',
  CAPITAL = 'Capital',
  THIRD_PARTY_GUARANTEE = 'ThirdPartyGuarantee',
  INSURANCE_COMPANY = 'InsuranceCompany',
  LANDLORDS_MUTUAL_FUND = 'LandlordMutualFund',
  OTHER = 'Other',
}

export enum SecurityDepositAmountOptions {
  ONE_MONTH = 'OneMonth',
  TWO_MONTHS = 'TwoMonths',
  THREE_MONTHS = 'ThreeMonths',
  OTHER = 'Other',
}

export enum OtherFeesPayeeOptions {
  LANDLORD = 'Landlord',
  TENANT = 'Tenant',
}

export enum EmergencyExitOptions {
  YES = '1',
  NO = '0',
}
