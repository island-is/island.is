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

export enum UserRole {
  LANDLORD = 'landlord',
  TENANT = 'tenant',
}

export enum Routes {
  LANDLORDINFORMATION = 'landlordInfo',
  TENANTINFORMATION = 'tenantInfo',
  PROPERTYINFORMATION = 'registerProperty.info',
  PROPERTYSEARCH = 'registerProperty.searchresults',
  PROPERTYCATEGORY = 'registerProperty.category',
  SPECIALPROVISIONS = 'specialProvisions',
  CONDITION = 'condition',
  FIREPROTECTIONS = 'fireProtections',
  RENTALPERIOD = 'rentalPeriod',
  RENTALAMOUNT = 'rentalAmount',
  SECURITYDEPOSIT = 'securityDeposit',
  OTHERFEES = 'otherFees',
  SUMMARY = 'summary',
}

export enum RentalHousingCategoryTypes {
  ENTIRE_HOME = 'entireHome',
  ROOM = 'room',
  COMMERCIAL = 'commercial',
}

export enum RentalHousingCategoryClass {
  GENERAL_MARKET = 'generalMarket',
  SPECIAL_GROUPS = 'specialGroups',
}

export enum RentalHousingCategoryClassGroup {
  STUDENT_HOUSING = 'studentHousing',
  SENIOR_CITIZEN_HOUSING = 'seniorCitizenHousing',
  COMMUNE = 'commune',
  HALFWAY_HOUSE = 'halfwayHouse',
  INCOME_BASED_HOUSING = 'incomeBasedHousing',
}

export enum RentalHousingConditionInspector {
  CONTRACT_PARTIES = 'contractParties',
  INDEPENDENT_PARTY = 'independentParty',
}

export enum RentalAmountIndexTypes {
  CONSUMER_PRICE_INDEX = 'consumerPriceIndex',
  CONSTRUCTION_COST_INDEX = 'constructionCostIndex',
  WAGE_INDEX = 'wageIndex',
}

export enum RentalAmountPaymentDateOptions {
  FIRST_DAY = 'firstDay',
  LAST_DAY = 'lastDay',
  OTHER = 'other',
}

export enum RentalPaymentMethodOptions {
  BANK_TRANSFER = 'bankTransfer',
  PAYMENT_SLIP = 'paymentSlip',
  OTHER = 'other',
}

export enum SecurityDepositTypeOptions {
  BANK_GUARANTEE = 'bankGuarantee',
  CAPITAL = 'capital',
  THIRD_PARTY_GUARANTEE = 'thirdPartyGuarantee',
  INSURANCE_COMPANY = 'insuranceCompany',
  LANDLORDS_MUTUAL_FUND = 'tenantsMutualFund',
  OTHER = 'other',
}

export enum SecurityDepositAmountOptions {
  ONE_MONTH = '1 month',
  TWO_MONTHS = '2 months',
  THREE_MONTHS = '3 months',
  OTHER = 'other',
}

export enum OtherFeesPayeeOptions {
  LANDLORD_OR_NOT_APPLICABLE = 'landlordPaysOrNotApplicable',
  LANDLORD = 'landlordPays',
  TENANT = 'tenantPays',
}

export enum NextStepInReviewOptions {
  GO_TO_SIGNING = 'goToSigning',
  EDIT_APPLICATION = 'editApplication',
}
