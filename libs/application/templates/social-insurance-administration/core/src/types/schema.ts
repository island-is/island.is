export type Maybe<T> = T | null
export type InputMaybe<T> = Maybe<T>
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> }
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any
}

export enum AccessCategory {
  Apigw = 'APIGW',
  Xroad = 'XROAD',
}

export type AccidentNotificationAttachment = {
  __typename?: 'AccidentNotificationAttachment'
  InjuryCertificate?: Maybe<Scalars['Boolean']>
  PoliceReport?: Maybe<Scalars['Boolean']>
  ProxyDocument?: Maybe<Scalars['Boolean']>
  Unknown?: Maybe<Scalars['Boolean']>
}

export type AccidentNotificationConfirmation = {
  __typename?: 'AccidentNotificationConfirmation'
  CompanyParty?: Maybe<Scalars['Boolean']>
  InjuredOrRepresentativeParty?: Maybe<Scalars['Boolean']>
  Unknown?: Maybe<Scalars['Boolean']>
}

export type AccidentNotificationStatus = {
  __typename?: 'AccidentNotificationStatus'
  numberIHI: Scalars['Float']
  receivedAttachments?: Maybe<AccidentNotificationAttachment>
  receivedConfirmations?: Maybe<AccidentNotificationConfirmation>
  status: HealthInsuranceAccidentNotificationStatusTypes
}

export type AccordionSlice = {
  __typename?: 'AccordionSlice'
  accordionItems?: Maybe<Array<OneColumnText>>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  showTitle?: Maybe<Scalars['Boolean']>
  title: Scalars['String']
  titleHeadingLevel?: Maybe<Scalars['String']>
  type: Scalars['String']
}

export type ActionCardMetaData = {
  __typename?: 'ActionCardMetaData'
  deleteButton?: Maybe<Scalars['Boolean']>
  description?: Maybe<Scalars['String']>
  draftFinishedSteps?: Maybe<Scalars['Float']>
  draftTotalSteps?: Maybe<Scalars['Float']>
  history?: Maybe<Array<ApplicationHistory>>
  historyButton?: Maybe<Scalars['String']>
  pendingAction?: Maybe<PendingAction>
  tag?: Maybe<ActionCardTag>
  title?: Maybe<Scalars['String']>
}

export type ActionCardTag = {
  __typename?: 'ActionCardTag'
  label?: Maybe<Scalars['String']>
  variant?: Maybe<Scalars['String']>
}

export type ActionMailBody = {
  __typename?: 'ActionMailBody'
  action: Scalars['String']
  messageId: Scalars['String']
  success: Scalars['Boolean']
}

export type AddAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
  url: Scalars['String']
}

export type Address = {
  city: Scalars['String']
  postalCode: Scalars['String']
  streetAddress: Scalars['String']
}

export type Addresses = {
  __typename?: 'Addresses'
  addresses: Array<HmsSearchAddress>
}

export type AdminNotification = {
  __typename?: 'AdminNotification'
  id: Scalars['Int']
  notificationId: Scalars['ID']
  sender: NotificationSender
  sent: Scalars['DateTime']
}

export type AdminNotifications = {
  __typename?: 'AdminNotifications'
  data: Array<AdminNotification>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type AdministrationofOccupationalSafetyandHealthCourseModel = {
  __typename?: 'AdministrationofOccupationalSafetyandHealthCourseModel'
  alwaysOpen?: Maybe<Scalars['Boolean']>
  category: Scalars['String']
  dateFrom: Scalars['String']
  dateTo: Scalars['String']
  description: Scalars['String']
  id: Scalars['Float']
  location: Scalars['String']
  name: Scalars['String']
  price: Scalars['Float']
  registrationUrl: Scalars['String']
  status: Scalars['String']
  subCategory: Scalars['String']
  time: Scalars['String']
}

export type AdministrationofOccupationalSafetyandHealthCoursesResponseModel = {
  __typename?: 'AdministrationofOccupationalSafetyandHealthCoursesResponseModel'
  courses: Array<AdministrationofOccupationalSafetyandHealthCourseModel>
}

export type AirDiscountSchemeConfirmInvoiceInput = {
  age: AirDiscountSchemeRangeInput
  airline?: InputMaybe<Scalars['String']>
  flightLeg?: InputMaybe<AirDiscountSchemeTravelInput>
  gender?: InputMaybe<AirDiscountSchemeFlightLegGender>
  isExplicit?: InputMaybe<Scalars['Boolean']>
  nationalId?: InputMaybe<Scalars['String']>
  period: AirDiscountSchemePeriodInput
  postalCode?: InputMaybe<Scalars['Int']>
  state?: InputMaybe<Array<AirDiscountSchemeFlightLegState>>
}

export type AirDiscountSchemeConnectionDiscountCode = {
  __typename?: 'AirDiscountSchemeConnectionDiscountCode'
  code: Scalars['ID']
  flightDesc: Scalars['String']
  flightId: Scalars['String']
  validUntil: Scalars['String']
}

export type AirDiscountSchemeCreateExplicitDiscountCodeInput = {
  comment: Scalars['String']
  isExplicit: Scalars['Boolean']
  nationalId: Scalars['String']
  needsConnectionFlight: Scalars['Boolean']
  numberOfDaysUntilExpiration: Scalars['Int']
  postalcode: Scalars['Int']
}

export type AirDiscountSchemeDiscount = {
  __typename?: 'AirDiscountSchemeDiscount'
  connectionDiscountCodes: Array<AirDiscountSchemeConnectionDiscountCode>
  discountCode?: Maybe<Scalars['String']>
  expiresIn: Scalars['Float']
  nationalId: Scalars['ID']
  user: AirDiscountSchemeUser
}

export type AirDiscountSchemeFlight = {
  __typename?: 'AirDiscountSchemeFlight'
  bookingDate: Scalars['DateTime']
  flightLegs: Array<AirDiscountSchemeFlightLeg>
  id: Scalars['ID']
  user: AirDiscountSchemeUser
  userInfo: AirDiscountSchemeUserInfo
}

export type AirDiscountSchemeFlightLeg = {
  __typename?: 'AirDiscountSchemeFlightLeg'
  airline: Scalars['String']
  cooperation?: Maybe<Scalars['String']>
  discountPrice: Scalars['Float']
  financialState: Scalars['String']
  flight: AirDiscountSchemeFlight
  id: Scalars['ID']
  originalPrice: Scalars['Float']
  travel: Scalars['String']
}

export enum AirDiscountSchemeFlightLegGender {
  Kk = 'kk',
  Kvk = 'kvk',
  Manneskja = 'manneskja',
  X = 'x',
}

export enum AirDiscountSchemeFlightLegState {
  AwaitingCredit = 'AWAITING_CREDIT',
  AwaitingDebit = 'AWAITING_DEBIT',
  Cancelled = 'CANCELLED',
  SentCredit = 'SENT_CREDIT',
  SentDebit = 'SENT_DEBIT',
}

export type AirDiscountSchemeFlightLegsInput = {
  age: AirDiscountSchemeRangeInput
  airline?: InputMaybe<Scalars['String']>
  flightLeg?: InputMaybe<AirDiscountSchemeTravelInput>
  gender?: InputMaybe<AirDiscountSchemeFlightLegGender>
  isExplicit?: InputMaybe<Scalars['Boolean']>
  nationalId?: InputMaybe<Scalars['String']>
  period: AirDiscountSchemePeriodInput
  postalCode?: InputMaybe<Scalars['Int']>
  state?: InputMaybe<Array<AirDiscountSchemeFlightLegState>>
}

export type AirDiscountSchemeFund = {
  __typename?: 'AirDiscountSchemeFund'
  credit: Scalars['Float']
  total: Scalars['Float']
  used: Scalars['Float']
}

export type AirDiscountSchemePeriodInput = {
  from: Scalars['DateTime']
  to: Scalars['DateTime']
}

export type AirDiscountSchemeRangeInput = {
  from: Scalars['Int']
  to: Scalars['Int']
}

export type AirDiscountSchemeTravelInput = {
  from?: InputMaybe<Scalars['String']>
  to?: InputMaybe<Scalars['String']>
}

export type AirDiscountSchemeUser = {
  __typename?: 'AirDiscountSchemeUser'
  flightLegs?: Maybe<Array<AirDiscountSchemeFlightLeg>>
  fund?: Maybe<AirDiscountSchemeFund>
  meetsADSRequirements: Scalars['Boolean']
  mobile?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  role: Scalars['String']
}

export type AirDiscountSchemeUserInfo = {
  __typename?: 'AirDiscountSchemeUserInfo'
  age: Scalars['Float']
  gender: Scalars['String']
  postalCode: Scalars['Float']
}

export type AircraftRegistryAircraft = {
  __typename?: 'AircraftRegistryAircraft'
  identifiers?: Maybe<Scalars['String']>
  maxWeight?: Maybe<Scalars['Float']>
  operator?: Maybe<AircraftRegistryPerson>
  owners?: Maybe<Array<AircraftRegistryPerson>>
  productionYear?: Maybe<Scalars['Float']>
  registrationNumber?: Maybe<Scalars['Float']>
  serialNumber?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  unregistered?: Maybe<Scalars['Boolean']>
  unregisteredDate?: Maybe<Scalars['DateTime']>
}

export type AircraftRegistryAllAircraftsInput = {
  pageNumber: Scalars['Float']
  pageSize: Scalars['Float']
  searchTerm?: InputMaybe<Scalars['String']>
}

export type AircraftRegistryAllAircraftsResponse = {
  __typename?: 'AircraftRegistryAllAircraftsResponse'
  aircrafts?: Maybe<Array<AircraftRegistryAircraft>>
  pageNumber?: Maybe<Scalars['Float']>
  pageSize?: Maybe<Scalars['Float']>
  totalCount?: Maybe<Scalars['Float']>
}

export type AircraftRegistryPerson = {
  __typename?: 'AircraftRegistryPerson'
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  country?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
  postcode?: Maybe<Scalars['String']>
  ssn?: Maybe<Scalars['Float']>
}

export type AlcoholLicence = {
  __typename?: 'AlcoholLicence'
  issuedBy?: Maybe<Scalars['String']>
  licenceSubType?: Maybe<Scalars['String']>
  licenceType?: Maybe<Scalars['String']>
  licenseHolder?: Maybe<Scalars['String']>
  licenseNumber?: Maybe<Scalars['String']>
  licenseResponsible?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  office?: Maybe<Scalars['String']>
  validFrom?: Maybe<Scalars['DateTime']>
  validTo?: Maybe<Scalars['DateTime']>
  year?: Maybe<Scalars['Float']>
}

export type AlertBanner = {
  __typename?: 'AlertBanner'
  bannerVariant: Scalars['String']
  description?: Maybe<Scalars['String']>
  dismissedForDays: Scalars['Int']
  id: Scalars['ID']
  isDismissable: Scalars['Boolean']
  link?: Maybe<ReferenceLink>
  linkTitle?: Maybe<Scalars['String']>
  servicePortalPaths?: Maybe<Array<Scalars['String']>>
  showAlertBanner: Scalars['Boolean']
  title?: Maybe<Scalars['String']>
}

export type AnchorPage = {
  __typename?: 'AnchorPage'
  category?: Maybe<ArticleCategory>
  content: Array<Slice>
  featuredImage?: Maybe<Image>
  id: Scalars['ID']
  image?: Maybe<Image>
  intro?: Maybe<Scalars['String']>
  pageType?: Maybe<Scalars['String']>
  seeMoreText?: Maybe<Scalars['String']>
  shortIntro?: Maybe<Scalars['String']>
  shortTitle?: Maybe<Scalars['String']>
  slug: Scalars['String']
  thumbnail?: Maybe<Image>
  tinyThumbnail?: Maybe<Image>
  title: Scalars['String']
}

export type AnchorPageListSlice = {
  __typename?: 'AnchorPageListSlice'
  id: Scalars['ID']
  pages: Array<AnchorPage>
  title: Scalars['String']
}

export type ApiCatalogue = {
  __typename?: 'ApiCatalogue'
  pageInfo?: Maybe<PageInfo>
  services: Array<Service>
}

export type Appendix = {
  __typename?: 'Appendix'
  text?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type AppendixInput = {
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type Application = {
  __typename?: 'Application'
  actionCard?: Maybe<ActionCardMetaData>
  answers: Scalars['JSON']
  applicant: Scalars['String']
  applicantActors: Array<Scalars['String']>
  assignees: Array<Scalars['String']>
  created: Scalars['DateTime']
  externalData: Scalars['JSON']
  id: Scalars['ID']
  institution?: Maybe<Scalars['String']>
  modified: Scalars['DateTime']
  name?: Maybe<Scalars['String']>
  progress?: Maybe<Scalars['Float']>
  pruned?: Maybe<Scalars['Boolean']>
  state: Scalars['String']
  status: ApplicationResponseDtoStatusEnum
  typeId: ApplicationResponseDtoTypeIdEnum
}

export type ApplicationAdmin = {
  __typename?: 'ApplicationAdmin'
  actionCard?: Maybe<ActionCardMetaData>
  applicant: Scalars['String']
  applicantActors: Array<Scalars['String']>
  applicantName?: Maybe<Scalars['String']>
  assignees: Array<Scalars['String']>
  created: Scalars['DateTime']
  id: Scalars['ID']
  institution?: Maybe<Scalars['String']>
  modified: Scalars['DateTime']
  name?: Maybe<Scalars['String']>
  paymentStatus?: Maybe<Scalars['String']>
  progress?: Maybe<Scalars['Float']>
  pruneAt?: Maybe<Scalars['DateTime']>
  pruned?: Maybe<Scalars['Boolean']>
  state: Scalars['String']
  status: ApplicationListAdminResponseDtoStatusEnum
  typeId: ApplicationListAdminResponseDtoTypeIdEnum
}

export type ApplicationAdminPaginatedResponse = {
  __typename?: 'ApplicationAdminPaginatedResponse'
  count: Scalars['Float']
  rows: Array<ApplicationAdmin>
}

export type ApplicationApplicationInput = {
  id: Scalars['String']
}

export type ApplicationApplicationsAdminInput = {
  nationalId: Scalars['String']
  status?: InputMaybe<Array<Scalars['String']>>
  typeId?: InputMaybe<Array<Scalars['String']>>
}

export type ApplicationApplicationsAdminStatisticsInput = {
  endDate: Scalars['String']
  startDate: Scalars['String']
}

export type ApplicationApplicationsInput = {
  scopeCheck?: InputMaybe<Scalars['Boolean']>
  status?: InputMaybe<Array<Scalars['String']>>
  typeId?: InputMaybe<Array<Scalars['String']>>
}

export type ApplicationApplicationsInstitutionAdminInput = {
  applicantNationalId?: InputMaybe<Scalars['String']>
  count: Scalars['Float']
  from?: InputMaybe<Scalars['String']>
  nationalId: Scalars['String']
  page: Scalars['Float']
  status?: InputMaybe<Array<Scalars['String']>>
  to?: InputMaybe<Scalars['String']>
}

export type ApplicationEligibility = {
  __typename?: 'ApplicationEligibility'
  isEligible: Scalars['Boolean']
  requirements: Array<ApplicationEligibilityRequirement>
}

export type ApplicationEligibilityInput = {
  applicationFor: Scalars['String']
}

export type ApplicationEligibilityRequirement = {
  __typename?: 'ApplicationEligibilityRequirement'
  daysOfResidency?: Maybe<Scalars['Float']>
  key: RequirementKey
  requirementMet: Scalars['Boolean']
}

export type ApplicationFileInput = {
  applicationId: Scalars['String']
  key: Scalars['String']
  name: Scalars['String']
  size: Scalars['Float']
  type: Scalars['String']
}

export type ApplicationHistory = {
  __typename?: 'ApplicationHistory'
  date: Scalars['DateTime']
  log?: Maybe<Scalars['String']>
}

export type ApplicationInformation = {
  __typename?: 'ApplicationInformation'
  applicantId: Scalars['String']
  applicationFundId: Scalars['String']
  applicationId: Scalars['ID']
  applicationRights: Array<ApplicationRights>
  children: Array<ApplicationInformationChildren>
  dateOfBirth: Scalars['String']
  email: Scalars['String']
  employers: Array<ApplicationInformationEmployer>
  expectedDateOfBirth: Scalars['String']
  nationalRegisteryId: Scalars['String']
  otherParentId?: Maybe<Scalars['String']>
  otherParentName?: Maybe<Scalars['String']>
  paymentInfo: ParentalLeavePaymentInfo
  periods: Array<ApplicationInformationPeriod>
  phoneNumber: Scalars['String']
  result: Scalars['String']
  status: Scalars['String']
  testData?: Maybe<Scalars['String']>
}

export type ApplicationInformationChildren = {
  __typename?: 'ApplicationInformationChildren'
  dateOfBirth: Scalars['String']
  expectedDateOfBirth: Scalars['String']
  name: Scalars['String']
  nationalRegistryId: Scalars['String']
}

export type ApplicationInformationEmployer = {
  __typename?: 'ApplicationInformationEmployer'
  email?: Maybe<Scalars['String']>
  employerId?: Maybe<Scalars['String']>
  nationalRegistryId?: Maybe<Scalars['String']>
}

export type ApplicationInformationPeriod = {
  __typename?: 'ApplicationInformationPeriod'
  approved: Scalars['Boolean']
  days: Scalars['String']
  firstPeriodStart: Scalars['String']
  from: Scalars['String']
  paid: Scalars['Boolean']
  ratio: Scalars['String']
  rightsCodePeriod: Scalars['String']
  to: Scalars['String']
}

export enum ApplicationListAdminResponseDtoStatusEnum {
  Approved = 'approved',
  Completed = 'completed',
  Draft = 'draft',
  Inprogress = 'inprogress',
  Notstarted = 'notstarted',
  Rejected = 'rejected',
}

export enum ApplicationListAdminResponseDtoTypeIdEnum {
  AccidentNotification = 'AccidentNotification',
  AdditionalSupportForTheElderly = 'AdditionalSupportForTheElderly',
  AlcoholTaxRedemption = 'AlcoholTaxRedemption',
  AnnouncementOfDeath = 'AnnouncementOfDeath',
  AnonymityInVehicleRegistry = 'AnonymityInVehicleRegistry',
  CarRecycling = 'CarRecycling',
  ChangeCoOwnerOfVehicle = 'ChangeCoOwnerOfVehicle',
  ChangeMachineSupervisor = 'ChangeMachineSupervisor',
  ChangeOperatorOfVehicle = 'ChangeOperatorOfVehicle',
  ChildrenResidenceChangeV2 = 'ChildrenResidenceChangeV2',
  Citizenship = 'Citizenship',
  ComplaintsToAlthingiOmbudsman = 'ComplaintsToAlthingiOmbudsman',
  CriminalRecord = 'CriminalRecord',
  DataProtectionAuthorityComplaint = 'DataProtectionAuthorityComplaint',
  DeathBenefits = 'DeathBenefits',
  DeregisterMachine = 'DeregisterMachine',
  DigitalTachographDriversCard = 'DigitalTachographDriversCard',
  DocumentProviderOnboarding = 'DocumentProviderOnboarding',
  DrivingAssessmentApproval = 'DrivingAssessmentApproval',
  DrivingInstructorRegistrations = 'DrivingInstructorRegistrations',
  DrivingLearnersPermit = 'DrivingLearnersPermit',
  DrivingLicense = 'DrivingLicense',
  DrivingLicenseBookUpdateInstructor = 'DrivingLicenseBookUpdateInstructor',
  DrivingLicenseDuplicate = 'DrivingLicenseDuplicate',
  DrivingSchoolConfirmation = 'DrivingSchoolConfirmation',
  EnergyFunds = 'EnergyFunds',
  Estate = 'Estate',
  EuropeanHealthInsuranceCard = 'EuropeanHealthInsuranceCard',
  ExampleAuthDelegation = 'ExampleAuthDelegation',
  ExampleCommonActions = 'ExampleCommonActions',
  ExampleFolderStructureAndConventions = 'ExampleFolderStructureAndConventions',
  ExampleInputs = 'ExampleInputs',
  ExampleNoInputs = 'ExampleNoInputs',
  ExamplePayment = 'ExamplePayment',
  ExampleStateTransfers = 'ExampleStateTransfers',
  FinancialAid = 'FinancialAid',
  FinancialStatementCemetery = 'FinancialStatementCemetery',
  FinancialStatementIndividualElection = 'FinancialStatementIndividualElection',
  FinancialStatementPoliticalParty = 'FinancialStatementPoliticalParty',
  FundingGovernmentProjects = 'FundingGovernmentProjects',
  GeneralFishingLicense = 'GeneralFishingLicense',
  GeneralPetitionService = 'GeneralPetitionService',
  GrindavikHousingBuyout = 'GrindavikHousingBuyout',
  HealthInsurance = 'HealthInsurance',
  HealthInsuranceDeclaration = 'HealthInsuranceDeclaration',
  HealthcareLicenseCertificate = 'HealthcareLicenseCertificate',
  HealthcareWorkPermit = 'HealthcareWorkPermit',
  HomeSupport = 'HomeSupport',
  HouseholdSupplement = 'HouseholdSupplement',
  IdCard = 'IdCard',
  IncomePlan = 'IncomePlan',
  InheritanceReport = 'InheritanceReport',
  InstitutionCollaboration = 'InstitutionCollaboration',
  LegalGazette = 'LegalGazette',
  LicensePlateRenewal = 'LicensePlateRenewal',
  LoginService = 'LoginService',
  MachineRegistration = 'MachineRegistration',
  MarriageConditions = 'MarriageConditions',
  MedicalAndRehabilitationPayments = 'MedicalAndRehabilitationPayments',
  MortgageCertificate = 'MortgageCertificate',
  MunicipalListCreation = 'MunicipalListCreation',
  MunicipalListSigning = 'MunicipalListSigning',
  NewPrimarySchool = 'NewPrimarySchool',
  NoDebtCertificate = 'NoDebtCertificate',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  OldAgePension = 'OldAgePension',
  OperatingLicense = 'OperatingLicense',
  OrderVehicleLicensePlate = 'OrderVehicleLicensePlate',
  OrderVehicleRegistrationCertificate = 'OrderVehicleRegistrationCertificate',
  PSign = 'PSign',
  ParentalLeave = 'ParentalLeave',
  ParliamentaryListCreation = 'ParliamentaryListCreation',
  ParliamentaryListSigning = 'ParliamentaryListSigning',
  Passport = 'Passport',
  PassportAnnulment = 'PassportAnnulment',
  PensionSupplement = 'PensionSupplement',
  PracticalExam = 'PracticalExam',
  PresidentialListCreation = 'PresidentialListCreation',
  PresidentialListSigning = 'PresidentialListSigning',
  PublicDebtPaymentPlan = 'PublicDebtPaymentPlan',
  RentalAgreement = 'RentalAgreement',
  RequestInspectionForMachine = 'RequestInspectionForMachine',
  SecondarySchool = 'SecondarySchool',
  SeminarRegistration = 'SeminarRegistration',
  StreetRegistration = 'StreetRegistration',
  TrainingLicenseOnAWorkMachine = 'TrainingLicenseOnAWorkMachine',
  TransferOfMachineOwnership = 'TransferOfMachineOwnership',
  TransferOfVehicleOwnership = 'TransferOfVehicleOwnership',
  University = 'University',
  WorkAccidentNotification = 'WorkAccidentNotification',
}

export type ApplicationPayment = {
  __typename?: 'ApplicationPayment'
  fulfilled: Scalars['Boolean']
  paymentUrl: Scalars['String']
}

export enum ApplicationResponseDtoStatusEnum {
  Approved = 'approved',
  Completed = 'completed',
  Draft = 'draft',
  Inprogress = 'inprogress',
  Notstarted = 'notstarted',
  Rejected = 'rejected',
}

export enum ApplicationResponseDtoTypeIdEnum {
  AccidentNotification = 'AccidentNotification',
  AdditionalSupportForTheElderly = 'AdditionalSupportForTheElderly',
  AlcoholTaxRedemption = 'AlcoholTaxRedemption',
  AnnouncementOfDeath = 'AnnouncementOfDeath',
  AnonymityInVehicleRegistry = 'AnonymityInVehicleRegistry',
  CarRecycling = 'CarRecycling',
  ChangeCoOwnerOfVehicle = 'ChangeCoOwnerOfVehicle',
  ChangeMachineSupervisor = 'ChangeMachineSupervisor',
  ChangeOperatorOfVehicle = 'ChangeOperatorOfVehicle',
  ChildrenResidenceChangeV2 = 'ChildrenResidenceChangeV2',
  Citizenship = 'Citizenship',
  ComplaintsToAlthingiOmbudsman = 'ComplaintsToAlthingiOmbudsman',
  CriminalRecord = 'CriminalRecord',
  DataProtectionAuthorityComplaint = 'DataProtectionAuthorityComplaint',
  DeathBenefits = 'DeathBenefits',
  DeregisterMachine = 'DeregisterMachine',
  DigitalTachographDriversCard = 'DigitalTachographDriversCard',
  DocumentProviderOnboarding = 'DocumentProviderOnboarding',
  DrivingAssessmentApproval = 'DrivingAssessmentApproval',
  DrivingInstructorRegistrations = 'DrivingInstructorRegistrations',
  DrivingLearnersPermit = 'DrivingLearnersPermit',
  DrivingLicense = 'DrivingLicense',
  DrivingLicenseBookUpdateInstructor = 'DrivingLicenseBookUpdateInstructor',
  DrivingLicenseDuplicate = 'DrivingLicenseDuplicate',
  DrivingSchoolConfirmation = 'DrivingSchoolConfirmation',
  EnergyFunds = 'EnergyFunds',
  Estate = 'Estate',
  EuropeanHealthInsuranceCard = 'EuropeanHealthInsuranceCard',
  ExampleAuthDelegation = 'ExampleAuthDelegation',
  ExampleCommonActions = 'ExampleCommonActions',
  ExampleFolderStructureAndConventions = 'ExampleFolderStructureAndConventions',
  ExampleInputs = 'ExampleInputs',
  ExampleNoInputs = 'ExampleNoInputs',
  ExamplePayment = 'ExamplePayment',
  ExampleStateTransfers = 'ExampleStateTransfers',
  FinancialAid = 'FinancialAid',
  FinancialStatementCemetery = 'FinancialStatementCemetery',
  FinancialStatementIndividualElection = 'FinancialStatementIndividualElection',
  FinancialStatementPoliticalParty = 'FinancialStatementPoliticalParty',
  FundingGovernmentProjects = 'FundingGovernmentProjects',
  GeneralFishingLicense = 'GeneralFishingLicense',
  GeneralPetitionService = 'GeneralPetitionService',
  GrindavikHousingBuyout = 'GrindavikHousingBuyout',
  HealthInsurance = 'HealthInsurance',
  HealthInsuranceDeclaration = 'HealthInsuranceDeclaration',
  HealthcareLicenseCertificate = 'HealthcareLicenseCertificate',
  HealthcareWorkPermit = 'HealthcareWorkPermit',
  HomeSupport = 'HomeSupport',
  HouseholdSupplement = 'HouseholdSupplement',
  IdCard = 'IdCard',
  IncomePlan = 'IncomePlan',
  InheritanceReport = 'InheritanceReport',
  InstitutionCollaboration = 'InstitutionCollaboration',
  LegalGazette = 'LegalGazette',
  LicensePlateRenewal = 'LicensePlateRenewal',
  LoginService = 'LoginService',
  MachineRegistration = 'MachineRegistration',
  MarriageConditions = 'MarriageConditions',
  MedicalAndRehabilitationPayments = 'MedicalAndRehabilitationPayments',
  MortgageCertificate = 'MortgageCertificate',
  MunicipalListCreation = 'MunicipalListCreation',
  MunicipalListSigning = 'MunicipalListSigning',
  NewPrimarySchool = 'NewPrimarySchool',
  NoDebtCertificate = 'NoDebtCertificate',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  OldAgePension = 'OldAgePension',
  OperatingLicense = 'OperatingLicense',
  OrderVehicleLicensePlate = 'OrderVehicleLicensePlate',
  OrderVehicleRegistrationCertificate = 'OrderVehicleRegistrationCertificate',
  PSign = 'PSign',
  ParentalLeave = 'ParentalLeave',
  ParliamentaryListCreation = 'ParliamentaryListCreation',
  ParliamentaryListSigning = 'ParliamentaryListSigning',
  Passport = 'Passport',
  PassportAnnulment = 'PassportAnnulment',
  PensionSupplement = 'PensionSupplement',
  PracticalExam = 'PracticalExam',
  PresidentialListCreation = 'PresidentialListCreation',
  PresidentialListSigning = 'PresidentialListSigning',
  PublicDebtPaymentPlan = 'PublicDebtPaymentPlan',
  RentalAgreement = 'RentalAgreement',
  RequestInspectionForMachine = 'RequestInspectionForMachine',
  SecondarySchool = 'SecondarySchool',
  SeminarRegistration = 'SeminarRegistration',
  StreetRegistration = 'StreetRegistration',
  TrainingLicenseOnAWorkMachine = 'TrainingLicenseOnAWorkMachine',
  TransferOfMachineOwnership = 'TransferOfMachineOwnership',
  TransferOfVehicleOwnership = 'TransferOfVehicleOwnership',
  University = 'University',
  WorkAccidentNotification = 'WorkAccidentNotification',
}

export type ApplicationRights = {
  __typename?: 'ApplicationRights'
  days: Scalars['String']
  daysLeft: Scalars['String']
  months: Scalars['String']
  rightsDescription: Scalars['String']
  rightsUnit: Scalars['String']
}

export type ApplicationStatistics = {
  __typename?: 'ApplicationStatistics'
  approved: Scalars['Float']
  completed: Scalars['Float']
  count: Scalars['Float']
  draft: Scalars['Float']
  inprogress: Scalars['Float']
  name: Scalars['String']
  rejected: Scalars['Float']
  typeid: Scalars['String']
}

export type Appraisal = {
  __typename?: 'Appraisal'
  activeAppraisal?: Maybe<Scalars['Float']>
  activePlotAssessment?: Maybe<Scalars['Float']>
  activeStructureAppraisal?: Maybe<Scalars['Float']>
  activeYear?: Maybe<Scalars['Float']>
  plannedAppraisal?: Maybe<Scalars['Float']>
  plannedPlotAssessment?: Maybe<Scalars['Float']>
  plannedStructureAppraisal?: Maybe<Scalars['Float']>
  plannedYear?: Maybe<Scalars['Float']>
}

export type AppraisalUnit = {
  __typename?: 'AppraisalUnit'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyLandValue?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  unitCode?: Maybe<Scalars['String']>
  units?: Maybe<Array<Unit>>
}

export type Article = {
  __typename?: 'Article'
  activeTranslations?: Maybe<Scalars['JSON']>
  alertBanner?: Maybe<AlertBanner>
  body: Array<Slice>
  category?: Maybe<ArticleCategory>
  featuredImage?: Maybe<Image>
  group?: Maybe<ArticleGroup>
  id: Scalars['ID']
  importance?: Maybe<Scalars['Float']>
  intro?: Maybe<Scalars['String']>
  keywords?: Maybe<Array<Scalars['String']>>
  organization?: Maybe<Array<Organization>>
  otherCategories?: Maybe<Array<ArticleCategory>>
  otherGroups?: Maybe<Array<ArticleGroup>>
  otherSubgroups?: Maybe<Array<ArticleSubgroup>>
  processEntry?: Maybe<ProcessEntry>
  processEntryButtonText?: Maybe<Scalars['String']>
  relatedArticles?: Maybe<Array<Article>>
  relatedContent?: Maybe<Array<Link>>
  relatedOrganization?: Maybe<Array<Organization>>
  responsibleParty?: Maybe<Array<Organization>>
  shortTitle?: Maybe<Scalars['String']>
  showTableOfContents?: Maybe<Scalars['Boolean']>
  signLanguageVideo?: Maybe<EmbeddedVideo>
  slug: Scalars['String']
  stepper?: Maybe<Stepper>
  subArticles: Array<SubArticle>
  subgroup?: Maybe<ArticleSubgroup>
  title: Scalars['String']
}

export type ArticleCategory = {
  __typename?: 'ArticleCategory'
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type ArticleGroup = {
  __typename?: 'ArticleGroup'
  description?: Maybe<Scalars['String']>
  importance?: Maybe<Scalars['Float']>
  slug: Scalars['String']
  title: Scalars['String']
}

export type ArticleReference = {
  __typename?: 'ArticleReference'
  category?: Maybe<ArticleCategory>
  group?: Maybe<ArticleGroup>
  id: Scalars['ID']
  intro: Scalars['String']
  organization?: Maybe<Array<Organization>>
  processEntry?: Maybe<ProcessEntry>
  processEntryButtonText: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
}

export type ArticleSubgroup = {
  __typename?: 'ArticleSubgroup'
  importance?: Maybe<Scalars['Float']>
  slug: Scalars['String']
  title: Scalars['String']
}

export type Asset = {
  __typename?: 'Asset'
  contentType: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
  typename: Scalars['String']
  url: Scalars['String']
}

export type AssetName = {
  __typename?: 'AssetName'
  name: Scalars['String']
}

export type AssignApplicationInput = {
  token: Scalars['String']
}

export type AttachmentPresignedUrlInput = {
  attachmentKey: Scalars['String']
  id: Scalars['String']
}

export type Auction = {
  __typename?: 'Auction'
  content?: Maybe<Array<Slice>>
  date: Scalars['String']
  id: Scalars['ID']
  organization: Organization
  title: Scalars['String']
  type: Scalars['String']
  updatedAt: Scalars['String']
}

export type AudienceAndScope = {
  __typename?: 'AudienceAndScope'
  audience: Scalars['String']
  scope: Scalars['String']
}

export type AuthActorDelegationInput = {
  delegationTypes?: InputMaybe<Array<AuthDelegationType>>
}

export type AuthAdminClient = {
  __typename?: 'AuthAdminClient'
  availableEnvironments: Array<AuthAdminEnvironment>
  clientId: Scalars['ID']
  clientType: AuthAdminClientType
  defaultEnvironment: AuthAdminClientEnvironment
  environments: Array<AuthAdminClientEnvironment>
  sso: AuthAdminClientSso
}

export type AuthAdminClientAllowedScope = {
  __typename?: 'AuthAdminClientAllowedScope'
  description?: Maybe<Array<AuthAdminTranslatedValue>>
  displayName: Array<AuthAdminTranslatedValue>
  domainName?: Maybe<Scalars['String']>
  name: Scalars['ID']
}

export type AuthAdminClientClaim = {
  __typename?: 'AuthAdminClientClaim'
  type: Scalars['String']
  value: Scalars['String']
}

export type AuthAdminClientClaimInput = {
  type: Scalars['String']
  value: Scalars['String']
}

export type AuthAdminClientEnvironment = {
  __typename?: 'AuthAdminClientEnvironment'
  absoluteRefreshTokenLifetime: Scalars['Int']
  accessTokenLifetime: Scalars['Int']
  allowOfflineAccess: Scalars['Boolean']
  allowedScopes?: Maybe<Array<AuthAdminClientAllowedScope>>
  clientId: Scalars['String']
  clientType: AuthAdminClientType
  customClaims?: Maybe<Array<AuthAdminClientClaim>>
  displayName: Array<AuthAdminTranslatedValue>
  environment: AuthAdminEnvironment
  id: Scalars['ID']
  postLogoutRedirectUris: Array<Scalars['String']>
  promptDelegations: Scalars['Boolean']
  redirectUris: Array<Scalars['String']>
  refreshTokenExpiration: AuthAdminRefreshTokenExpiration
  requireApiScopes: Scalars['Boolean']
  requireConsent: Scalars['Boolean']
  requirePkce: Scalars['Boolean']
  secrets: Array<AuthAdminClientSecret>
  singleSession: Scalars['Boolean']
  slidingRefreshTokenLifetime: Scalars['Int']
  sso: AuthAdminClientSso
  supportTokenExchange: Scalars['Boolean']
  supportedDelegationTypes?: Maybe<Array<Scalars['String']>>
  /** @deprecated Use supportedDelegationTypes instead */
  supportsCustomDelegation: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  supportsLegalGuardians: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  supportsPersonalRepresentatives: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  supportsProcuringHolders: Scalars['Boolean']
  tenantId: Scalars['String']
}

export type AuthAdminClientInput = {
  clientId: Scalars['String']
  includeArchived?: InputMaybe<Scalars['Boolean']>
  tenantId: Scalars['String']
}

export type AuthAdminClientSecret = {
  __typename?: 'AuthAdminClientSecret'
  clientId: Scalars['String']
  decryptedValue?: Maybe<Scalars['String']>
  secretId: Scalars['ID']
}

export enum AuthAdminClientSso {
  Disabled = 'disabled',
  Enabled = 'enabled',
}

export enum AuthAdminClientType {
  Machine = 'machine',
  Native = 'native',
  Spa = 'spa',
  Web = 'web',
}

export type AuthAdminClientsInput = {
  tenantId: Scalars['String']
}

export type AuthAdminClientsPayload = {
  __typename?: 'AuthAdminClientsPayload'
  data: Array<AuthAdminClient>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type AuthAdminCreateClientResponse = {
  __typename?: 'AuthAdminCreateClientResponse'
  clientId: Scalars['String']
  environment: AuthAdminEnvironment
}

export enum AuthAdminCreateClientType {
  Machine = 'machine',
  Native = 'native',
  Web = 'web',
}

export type AuthAdminCreateScopeResponse = {
  __typename?: 'AuthAdminCreateScopeResponse'
  environment: AuthAdminEnvironment
  scopeName: Scalars['String']
}

export type AuthAdminDelegationProvider = {
  __typename?: 'AuthAdminDelegationProvider'
  delegationTypes: Array<AuthAdminDelegationType>
  description: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
}

export type AuthAdminDelegationType = {
  __typename?: 'AuthAdminDelegationType'
  description: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  providerId: Scalars['String']
}

export type AuthAdminDeleteClientInput = {
  clientId: Scalars['String']
  tenantId: Scalars['String']
}

export enum AuthAdminEnvironment {
  Development = 'Development',
  Production = 'Production',
  Staging = 'Staging',
}

export type AuthAdminPatchClientInput = {
  absoluteRefreshTokenLifetime?: InputMaybe<Scalars['Int']>
  accessTokenLifetime?: InputMaybe<Scalars['Int']>
  addedDelegationTypes?: InputMaybe<Array<Scalars['String']>>
  addedScopes?: InputMaybe<Array<Scalars['String']>>
  allowOfflineAccess?: InputMaybe<Scalars['Boolean']>
  clientId: Scalars['String']
  customClaims?: InputMaybe<Array<AuthAdminClientClaimInput>>
  displayName?: InputMaybe<Array<AuthAdminTranslatedValueInput>>
  environments: Array<AuthAdminEnvironment>
  postLogoutRedirectUris?: InputMaybe<Array<Scalars['String']>>
  promptDelegations?: InputMaybe<Scalars['Boolean']>
  redirectUris?: InputMaybe<Array<Scalars['String']>>
  refreshTokenExpiration?: InputMaybe<AuthAdminRefreshTokenExpiration>
  removedDelegationTypes?: InputMaybe<Array<Scalars['String']>>
  removedScopes?: InputMaybe<Array<Scalars['String']>>
  requireApiScopes?: InputMaybe<Scalars['Boolean']>
  requireConsent?: InputMaybe<Scalars['Boolean']>
  requirePkce?: InputMaybe<Scalars['Boolean']>
  singleSession?: InputMaybe<Scalars['Boolean']>
  slidingRefreshTokenLifetime?: InputMaybe<Scalars['Int']>
  sso?: InputMaybe<AuthAdminClientSso>
  supportTokenExchange?: InputMaybe<Scalars['Boolean']>
  supportsCustomDelegation?: InputMaybe<Scalars['Boolean']>
  supportsLegalGuardians?: InputMaybe<Scalars['Boolean']>
  supportsPersonalRepresentatives?: InputMaybe<Scalars['Boolean']>
  supportsProcuringHolders?: InputMaybe<Scalars['Boolean']>
  tenantId: Scalars['String']
}

export type AuthAdminPatchScopeInput = {
  addedDelegationTypes?: InputMaybe<Array<Scalars['String']>>
  allowExplicitDelegationGrant?: InputMaybe<Scalars['Boolean']>
  automaticDelegationGrant?: InputMaybe<Scalars['Boolean']>
  description?: InputMaybe<Array<AuthAdminTranslatedValueInput>>
  displayName?: InputMaybe<Array<AuthAdminTranslatedValueInput>>
  environments: Array<AuthAdminEnvironment>
  grantToAuthenticatedUser?: InputMaybe<Scalars['Boolean']>
  grantToLegalGuardians?: InputMaybe<Scalars['Boolean']>
  grantToPersonalRepresentatives?: InputMaybe<Scalars['Boolean']>
  grantToProcuringHolders?: InputMaybe<Scalars['Boolean']>
  isAccessControlled?: InputMaybe<Scalars['Boolean']>
  removedDelegationTypes?: InputMaybe<Array<Scalars['String']>>
  scopeName: Scalars['String']
  tenantId: Scalars['String']
}

export type AuthAdminPublishClientInput = {
  clientId: Scalars['String']
  sourceEnvironment: AuthAdminEnvironment
  targetEnvironment: AuthAdminEnvironment
  tenantId: Scalars['String']
}

export type AuthAdminPublishScopeInput = {
  scopeName: Scalars['String']
  sourceEnvironment: AuthAdminEnvironment
  targetEnvironment: AuthAdminEnvironment
  tenantId: Scalars['String']
}

export enum AuthAdminRefreshTokenExpiration {
  Absolute = 'Absolute',
  Sliding = 'Sliding',
}

export type AuthAdminRevokeSecretsInput = {
  clientId: Scalars['String']
  environment: AuthAdminEnvironment
  tenantId: Scalars['String']
}

export type AuthAdminRotateSecretInput = {
  clientId: Scalars['String']
  environment: AuthAdminEnvironment
  revokeOldSecrets?: InputMaybe<Scalars['Boolean']>
  tenantId: Scalars['String']
}

export type AuthAdminScope = {
  __typename?: 'AuthAdminScope'
  availableEnvironments: Array<AuthAdminEnvironment>
  defaultEnvironment: AuthAdminScopeEnvironment
  environments: Array<AuthAdminScopeEnvironment>
  scopeName: Scalars['ID']
}

export type AuthAdminScopeEnvironment = {
  __typename?: 'AuthAdminScopeEnvironment'
  /** @deprecated Use supportedDelegationTypes instead */
  allowExplicitDelegationGrant: Scalars['Boolean']
  alsoForDelegatedUser: Scalars['Boolean']
  automaticDelegationGrant: Scalars['Boolean']
  description: Array<AuthAdminTranslatedValue>
  displayName: Array<AuthAdminTranslatedValue>
  domainName: Scalars['String']
  emphasize: Scalars['Boolean']
  environment: AuthAdminEnvironment
  grantToAuthenticatedUser: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  grantToLegalGuardians: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  grantToPersonalRepresentatives: Scalars['Boolean']
  /** @deprecated Use supportedDelegationTypes instead */
  grantToProcuringHolders: Scalars['Boolean']
  groupId?: Maybe<Scalars['String']>
  isAccessControlled: Scalars['Boolean']
  name: Scalars['ID']
  order?: Maybe<Scalars['Float']>
  required: Scalars['Boolean']
  showInDiscoveryDocument: Scalars['Boolean']
  supportedDelegationTypes: Array<Scalars['String']>
}

export type AuthAdminScopesPayload = {
  __typename?: 'AuthAdminScopesPayload'
  data: Array<AuthAdminScope>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type AuthAdminTenant = {
  __typename?: 'AuthAdminTenant'
  availableEnvironments: Array<AuthAdminEnvironment>
  defaultEnvironment: AuthAdminTenantEnvironment
  environments: Array<AuthAdminTenantEnvironment>
  id: Scalars['ID']
}

export type AuthAdminTenantEnvironment = {
  __typename?: 'AuthAdminTenantEnvironment'
  displayName: Array<AuthAdminTranslatedValue>
  environment: AuthAdminEnvironment
  id: Scalars['ID']
  name: Scalars['String']
}

export type AuthAdminTenantsPayload = {
  __typename?: 'AuthAdminTenantsPayload'
  data: Array<AuthAdminTenant>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type AuthAdminTranslatedValue = {
  __typename?: 'AuthAdminTranslatedValue'
  locale: Scalars['String']
  value: Scalars['String']
}

export type AuthAdminTranslatedValueInput = {
  locale: Scalars['String']
  value: Scalars['String']
}

export type AuthApiScope = {
  __typename?: 'AuthApiScope'
  description?: Maybe<Scalars['String']>
  displayName: Scalars['String']
  group?: Maybe<AuthApiScopeGroup>
  name: Scalars['ID']
}

export type AuthApiScopeGroup = {
  __typename?: 'AuthApiScopeGroup'
  children?: Maybe<Array<AuthApiScope>>
  description?: Maybe<Scalars['String']>
  displayName: Scalars['String']
  name: Scalars['ID']
}

export type AuthApiScopesInput = {
  direction?: InputMaybe<AuthDomainDirection>
  domain?: InputMaybe<Scalars['String']>
  lang?: InputMaybe<Scalars['String']>
}

export type AuthClient = {
  __typename?: 'AuthClient'
  clientId: Scalars['ID']
  clientName?: Maybe<Scalars['String']>
  domain?: Maybe<AuthDomain>
  domainName?: Maybe<Scalars['String']>
}

export type AuthClientDomainArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthConsent = {
  __typename?: 'AuthConsent'
  client: AuthClient
  tenants: Array<AuthConsentTenant>
}

export type AuthConsentClientArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthConsentTenantsArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthConsentScopeNode = {
  __typename?: 'AuthConsentScopeNode'
  children?: Maybe<Array<AuthConsentScopeNode>>
  description?: Maybe<Scalars['String']>
  displayName: Scalars['String']
  hasConsent?: Maybe<Scalars['Boolean']>
  name: Scalars['ID']
}

export type AuthConsentTenant = {
  __typename?: 'AuthConsentTenant'
  scopes?: Maybe<Array<AuthConsentScopeNode>>
  tenant: AuthDomain
}

export type AuthConsentTenantTenantArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthConsentsPaginated = {
  __typename?: 'AuthConsentsPaginated'
  data: Array<AuthConsent>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type AuthCustomDelegation = AuthDelegation & {
  __typename?: 'AuthCustomDelegation'
  createdBy?: Maybe<Identity>
  domain: AuthDomain
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  scopes: Array<AuthDelegationScope>
  to: Identity
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthCustomDelegationDomainArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthDelegation = {
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export enum AuthDelegationDirection {
  Incoming = 'incoming',
  Outgoing = 'outgoing',
}

export type AuthDelegationInput = {
  delegationId: Scalars['String']
}

export enum AuthDelegationProvider {
  Delegationdb = 'delegationdb',
  Fyrirtaekjaskra = 'fyrirtaekjaskra',
  Syslumenn = 'syslumenn',
  Talsmannagrunnur = 'talsmannagrunnur',
  Thjodskra = 'thjodskra',
}

export type AuthDelegationProviderEnvironment = {
  __typename?: 'AuthDelegationProviderEnvironment'
  environment: AuthAdminEnvironment
  providers: Array<AuthAdminDelegationProvider>
}

export type AuthDelegationProviderPayload = {
  __typename?: 'AuthDelegationProviderPayload'
  environments: Array<AuthDelegationProviderEnvironment>
}

export type AuthDelegationScope = {
  __typename?: 'AuthDelegationScope'
  apiScope?: Maybe<AuthApiScope>
  displayName: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthDelegationScopeApiScopeArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type AuthDelegationScopeInput = {
  name: Scalars['String']
  validTo: Scalars['DateTime']
}

export enum AuthDelegationType {
  Custom = 'Custom',
  GeneralMandate = 'GeneralMandate',
  LegalGuardian = 'LegalGuardian',
  LegalGuardianMinor = 'LegalGuardianMinor',
  LegalRepresentative = 'LegalRepresentative',
  PersonalRepresentative = 'PersonalRepresentative',
  ProcurationHolder = 'ProcurationHolder',
}

export type AuthDelegationsInput = {
  direction?: InputMaybe<AuthDelegationDirection>
  domain?: InputMaybe<Scalars['String']>
}

export type AuthDomain = {
  __typename?: 'AuthDomain'
  description: Scalars['String']
  displayName: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['String']
  organisationLogoKey: Scalars['String']
  organisationLogoUrl?: Maybe<Scalars['String']>
}

export enum AuthDomainDirection {
  Outgoing = 'outgoing',
}

export type AuthDomainsInput = {
  direction?: InputMaybe<AuthDomainDirection>
  lang?: InputMaybe<Scalars['String']>
}

export type AuthExtensionCredProps = {
  rk?: InputMaybe<Scalars['Boolean']>
}

export type AuthGeneralMandate = AuthDelegation & {
  __typename?: 'AuthGeneralMandate'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthLegalGuardianDelegation = AuthDelegation & {
  __typename?: 'AuthLegalGuardianDelegation'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthLegalGuardianMinorDelegation = AuthDelegation & {
  __typename?: 'AuthLegalGuardianMinorDelegation'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthLegalRepresentativeDelegation = AuthDelegation & {
  __typename?: 'AuthLegalRepresentativeDelegation'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthLoginRestriction = {
  __typename?: 'AuthLoginRestriction'
  restricted: Scalars['Boolean']
  until?: Maybe<Scalars['DateTime']>
}

export type AuthMergedDelegation = {
  __typename?: 'AuthMergedDelegation'
  from: Identity
  to: Identity
  /** @deprecated Use types instead */
  type: AuthDelegationType
  types: Array<AuthDelegationType>
}

export type AuthPasskeyAuthenticationOptions = {
  __typename?: 'AuthPasskeyAuthenticationOptions'
  allowCredentials: Array<AuthPasskeyAuthenticationOptionsCredentials>
  challenge: Scalars['String']
  rpId: Scalars['String']
  timeout: Scalars['Float']
  userVerification: Scalars['String']
}

export type AuthPasskeyAuthenticationOptionsCredentials = {
  __typename?: 'AuthPasskeyAuthenticationOptionsCredentials'
  id: Scalars['String']
  transports: Array<Scalars['String']>
  type: Scalars['String']
}

export type AuthPasskeyRegistrationObject = {
  authenticatorAttachment?: InputMaybe<Scalars['String']>
  clientExtensionResults: AuthPasskeyRegistrationObjectClientExtensionResults
  id: Scalars['String']
  rawId: Scalars['String']
  response: AuthPasskeyRegistrationObjectResponse
  type: Scalars['String']
}

export type AuthPasskeyRegistrationObjectClientExtensionResults = {
  appid?: InputMaybe<Scalars['Boolean']>
  credProps?: InputMaybe<AuthExtensionCredProps>
  hmacCreateSecret?: InputMaybe<Scalars['Boolean']>
}

export type AuthPasskeyRegistrationObjectResponse = {
  attestationObject: Scalars['String']
  authenticatorData?: InputMaybe<Scalars['String']>
  clientDataJSON: Scalars['String']
  publicKey?: InputMaybe<Scalars['String']>
  publicKeyAlgorithm?: InputMaybe<Scalars['Float']>
  transports?: InputMaybe<Array<Scalars['String']>>
}

export type AuthPasskeyRegistrationOptions = {
  __typename?: 'AuthPasskeyRegistrationOptions'
  attestation?: Maybe<Scalars['String']>
  authenticatorSelection?: Maybe<AuthRegistrationOptionsAuthenticatorSelection>
  challenge: Scalars['String']
  excludeCredentials?: Maybe<
    Array<AuthRegistrationOptionsPublicKeyCredentialDescriptorJson>
  >
  extensions?: Maybe<AuthRegistrationOptionsExtensions>
  pubKeyCredParams: Array<AuthRegistrationOptionsPublicKeyCredentialOption>
  rp: AuthRegistrationOptionsRp
  timeout?: Maybe<Scalars['Float']>
  user: AuthRegistrationOptionsUser
}

export type AuthPasskeyRegistrationVerification = {
  __typename?: 'AuthPasskeyRegistrationVerification'
  verified: Scalars['Boolean']
}

export type AuthPersonalRepresentativeDelegation = AuthDelegation & {
  __typename?: 'AuthPersonalRepresentativeDelegation'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthProcuringHolderDelegation = AuthDelegation & {
  __typename?: 'AuthProcuringHolderDelegation'
  createdBy?: Maybe<Identity>
  from: Identity
  id?: Maybe<Scalars['ID']>
  provider: AuthDelegationProvider
  referenceId?: Maybe<Scalars['String']>
  to?: Maybe<Identity>
  type: AuthDelegationType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthRegistrationOptionsAuthenticatorSelection = {
  __typename?: 'AuthRegistrationOptionsAuthenticatorSelection'
  authenticatorAttachment?: Maybe<Scalars['String']>
  requireResidentKey?: Maybe<Scalars['Boolean']>
  residentKey?: Maybe<Scalars['String']>
  userVerification?: Maybe<Scalars['String']>
}

export type AuthRegistrationOptionsExtensions = {
  __typename?: 'AuthRegistrationOptionsExtensions'
  appid?: Maybe<Scalars['String']>
  credProps?: Maybe<Scalars['Boolean']>
  hmacCreateSecret?: Maybe<Scalars['Boolean']>
}

export type AuthRegistrationOptionsPublicKeyCredentialDescriptorJson = {
  __typename?: 'AuthRegistrationOptionsPublicKeyCredentialDescriptorJSON'
  id: Scalars['String']
  transports: Array<Scalars['String']>
  type: Scalars['String']
}

export type AuthRegistrationOptionsPublicKeyCredentialOption = {
  __typename?: 'AuthRegistrationOptionsPublicKeyCredentialOption'
  alg: Scalars['Float']
  type: Scalars['String']
}

export type AuthRegistrationOptionsRp = {
  __typename?: 'AuthRegistrationOptionsRp'
  id?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export type AuthRegistrationOptionsUser = {
  __typename?: 'AuthRegistrationOptionsUser'
  displayName: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
}

export type AuthScopeTreeNode = AuthApiScope | AuthApiScopeGroup

export type BasicVehicleInformation = {
  __typename?: 'BasicVehicleInformation'
  color?: Maybe<Scalars['String']>
  make?: Maybe<Scalars['String']>
  mileageReading?: Maybe<Scalars['String']>
  permno?: Maybe<Scalars['String']>
  requireMileage?: Maybe<Scalars['Boolean']>
  role?: Maybe<Scalars['String']>
}

export type BloodDonationRestrictionDetails = {
  __typename?: 'BloodDonationRestrictionDetails'
  cardText: Array<Slice>
  description: Scalars['String']
  detailedText: Array<Slice>
  hasCardText: Scalars['Boolean']
  hasDetailedText: Scalars['Boolean']
  id: Scalars['ID']
  keywordsText: Scalars['String']
  title: Scalars['String']
}

export type BloodDonationRestrictionGenericTag = {
  __typename?: 'BloodDonationRestrictionGenericTag'
  key: Scalars['ID']
  label: Scalars['String']
}

export type BloodDonationRestrictionGenericTagList = {
  __typename?: 'BloodDonationRestrictionGenericTagList'
  items: Array<BloodDonationRestrictionGenericTag>
  total: Scalars['Int']
}

export type BloodDonationRestrictionList = {
  __typename?: 'BloodDonationRestrictionList'
  input: GetBloodDonationRestrictionsInputModel
  items: Array<BloodDonationRestrictionListItem>
  total: Scalars['Int']
}

export type BloodDonationRestrictionListItem = {
  __typename?: 'BloodDonationRestrictionListItem'
  cardText: Array<Slice>
  description: Scalars['String']
  hasCardText: Scalars['Boolean']
  hasDetailedText: Scalars['Boolean']
  id: Scalars['ID']
  keywordsText: Scalars['String']
  title: Scalars['String']
}

export type Broker = {
  __typename?: 'Broker'
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
}

export type BulkMailAction = {
  __typename?: 'BulkMailAction'
  messageId: Scalars['String']
  success: Scalars['Boolean']
}

export type BulkUploadUser = {
  nationalId: Scalars['String']
  pageNumber: Scalars['Float']
}

export type BulkVehicleMileageRequestOverviewInput = {
  guid: Scalars['ID']
  locale: Scalars['String']
}

export type BulkVehicleMileageRequestStatusInput = {
  requestId: Scalars['ID']
}

export type BulletEntry = IconBullet | NumberBulletGroup

export type BulletListSlice = {
  __typename?: 'BulletListSlice'
  bullets: Array<BulletEntry>
  dividerOnTop?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type BurningPermit = {
  __typename?: 'BurningPermit'
  dateFrom?: Maybe<Scalars['DateTime']>
  dateTo?: Maybe<Scalars['DateTime']>
  licensee?: Maybe<Scalars['String']>
  office?: Maybe<Scalars['String']>
  place?: Maybe<Scalars['String']>
  responsibleParty?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Float']>
  subtype?: Maybe<Scalars['String']>
  timeFrom?: Maybe<Scalars['String']>
  timeTo?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type BurningPermitsResponse = {
  __typename?: 'BurningPermitsResponse'
  list: Array<BurningPermit>
}

export enum CalculationType {
  E = 'E',
  Kg = 'KG',
  L = 'L',
  U = 'U',
}

export enum CaseSubscriptionType {
  AllChanges = 'AllChanges',
  StatusChanges = 'StatusChanges',
}

export type CategoryPage = Article | Manual

export type CertificateInfoResponse = {
  __typename?: 'CertificateInfoResponse'
  expirationDate?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  releaseDate?: Maybe<Scalars['String']>
}

export type ChangeAppendix = {
  __typename?: 'ChangeAppendix'
  diff?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type Chart = {
  __typename?: 'Chart'
  alternativeDescription: Scalars['String']
  chartDescription: Scalars['String']
  components: Array<ChartComponent>
  customStyleConfig?: Maybe<Scalars['String']>
  dateFrom?: Maybe<Scalars['String']>
  dateTo?: Maybe<Scalars['String']>
  displayAsCard: Scalars['Boolean']
  flipAxis?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  numberOfDataPoints?: Maybe<Scalars['Float']>
  reduceAndRoundValue?: Maybe<Scalars['Boolean']>
  sourceData?: Maybe<Scalars['String']>
  startExpanded: Scalars['Boolean']
  title: Scalars['String']
  xAxisFormat?: Maybe<Scalars['String']>
  xAxisKey?: Maybe<Scalars['String']>
  xAxisValueType?: Maybe<Scalars['String']>
  yAxisLabel?: Maybe<Scalars['String']>
}

export type ChartComponent = {
  __typename?: 'ChartComponent'
  id: Scalars['ID']
  interval?: Maybe<Scalars['Float']>
  label: Scalars['String']
  sourceDataKey: Scalars['String']
  stackId?: Maybe<Scalars['String']>
  type: Scalars['String']
  values?: Maybe<Scalars['String']>
}

export type ChartNumberBox = {
  __typename?: 'ChartNumberBox'
  displayChangeMonthOverMonth: Scalars['Boolean']
  displayChangeYearOverYear: Scalars['Boolean']
  displayTimestamp?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  numberBoxDate?: Maybe<Scalars['String']>
  numberBoxDescription: Scalars['String']
  reduceAndRoundValue?: Maybe<Scalars['Boolean']>
  sourceDataKey: Scalars['String']
  title: Scalars['String']
  valueType: Scalars['String']
}

export type CheckTachoNetExists = {
  __typename?: 'CheckTachoNetExists'
  exists: Scalars['Boolean']
}

export type CheckTachoNetInput = {
  birthDate: Scalars['DateTime']
  birthPlace: Scalars['String']
  drivingLicenceIssuingCountry: Scalars['String']
  drivingLicenceNumber: Scalars['String']
  firstName: Scalars['String']
  lastName: Scalars['String']
}

export type ClientCredentials = {
  __typename?: 'ClientCredentials'
  clientId: Scalars['String']
  clientSecret: Scalars['String']
  providerId: Scalars['String']
}

export type CoOwnerChangeAnswers = {
  coOwners?: InputMaybe<Array<CoOwnerChangeAnswersCoOwners>>
  owner: CoOwnerChangeAnswersUser
  ownerCoOwners?: InputMaybe<Array<CoOwnerChangeAnswersOwnerCoOwners>>
  pickVehicle: CoOwnerChangeAnswersPickVehicle
  vehicleMileage: CoOwnerChangeAnswersVehicleMileage
}

export type CoOwnerChangeAnswersCoOwners = {
  email: Scalars['String']
  nationalId: Scalars['String']
  wasRemoved?: InputMaybe<Scalars['String']>
}

export type CoOwnerChangeAnswersOwnerCoOwners = {
  email: Scalars['String']
  nationalId: Scalars['String']
  wasRemoved?: InputMaybe<Scalars['String']>
}

export type CoOwnerChangeAnswersPickVehicle = {
  plate: Scalars['String']
}

export type CoOwnerChangeAnswersUser = {
  email: Scalars['String']
  nationalId: Scalars['String']
}

export type CoOwnerChangeAnswersVehicleMileage = {
  value?: InputMaybe<Scalars['String']>
}

/** Collection has different statuses to represent the state of collection */
export enum CollectionStatus {
  /** Collection contains active extended list. */
  Active = 'Active',
  InInitialReview = 'InInitialReview',
  /** Collection has no open lists. Lists are being reviewed by processing admin. */
  InReview = 'InReview',
  /** Collection is not active, has been closed or has not yet started. */
  Inactive = 'Inactive',
  /** Collection contains active list. In intial open time. */
  InitialActive = 'InitialActive',
  /** Collection has been marked as processed. */
  Processed = 'Processed',
  /** All lists for collection have been reviewed, the collection has not been marked as processed. */
  Processing = 'Processing',
}

export type CommunicationResponse = {
  __typename?: 'CommunicationResponse'
  sent: Scalars['Boolean']
}

export type ConnectedComponent = {
  __typename?: 'ConnectedComponent'
  configJson?: Maybe<Scalars['JSON']>
  id: Scalars['ID']
  json?: Maybe<Scalars['JSON']>
  title: Scalars['String']
  translationStrings?: Maybe<Scalars['JSONObject']>
  type?: Maybe<Scalars['String']>
}

export type ConsultationPortalAdviceResult = {
  __typename?: 'ConsultationPortalAdviceResult'
  adviceDocuments?: Maybe<Array<ConsultationPortalDocumentInfoResult>>
  content?: Maybe<Scalars['String']>
  created?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['String']>
  isHidden?: Maybe<Scalars['Boolean']>
  isPrivate?: Maybe<Scalars['Boolean']>
  number?: Maybe<Scalars['Float']>
  participantEmail?: Maybe<Scalars['String']>
  participantName?: Maybe<Scalars['String']>
}

export type ConsultationPortalAllTypesResult = {
  __typename?: 'ConsultationPortalAllTypesResult'
  caseStatuses?: Maybe<Scalars['JSONObject']>
  caseTypes?: Maybe<Scalars['JSONObject']>
  institutions?: Maybe<Scalars['JSONObject']>
  policyAreas?: Maybe<Scalars['JSONObject']>
}

export type ConsultationPortalCaseInput = {
  caseId?: InputMaybe<Scalars['Int']>
}

export type ConsultationPortalCaseItemResult = {
  __typename?: 'ConsultationPortalCaseItemResult'
  adviceCount?: Maybe<Scalars['Float']>
  caseNumber?: Maybe<Scalars['String']>
  created?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['Float']>
  institutionName?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  policyAreaName?: Maybe<Scalars['String']>
  processBegins?: Maybe<Scalars['DateTime']>
  processEnds?: Maybe<Scalars['DateTime']>
  publishOnWeb?: Maybe<Scalars['DateTime']>
  shortDescription?: Maybe<Scalars['String']>
  statusName?: Maybe<Scalars['String']>
  typeName?: Maybe<Scalars['String']>
}

export type ConsultationPortalCasePostAdviceCommandInput = {
  content?: InputMaybe<Scalars['String']>
  fileUrls?: InputMaybe<Array<Scalars['String']>>
  privateAdvice?: InputMaybe<Scalars['Boolean']>
}

export type ConsultationPortalCaseResult = {
  __typename?: 'ConsultationPortalCaseResult'
  additionalDocuments?: Maybe<Array<ConsultationPortalDocumentInfoResult>>
  adviceCount?: Maybe<Scalars['Float']>
  advicePublishTypeId?: Maybe<Scalars['Float']>
  advicePublishTypeName?: Maybe<Scalars['String']>
  allowUsersToSendPrivateAdvices?: Maybe<Scalars['Boolean']>
  announcementText?: Maybe<Scalars['String']>
  caseNumber?: Maybe<Scalars['String']>
  changed?: Maybe<Scalars['DateTime']>
  contactEmail?: Maybe<Scalars['String']>
  contactName?: Maybe<Scalars['String']>
  created?: Maybe<Scalars['DateTime']>
  detailedDescription?: Maybe<Scalars['String']>
  documents?: Maybe<Array<ConsultationPortalDocumentInfoResult>>
  extraStakeholderList?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Float']>
  institutionName?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  oldInstitutionName?: Maybe<Scalars['String']>
  policyAreaName?: Maybe<Scalars['String']>
  processBegins?: Maybe<Scalars['DateTime']>
  processEnds?: Maybe<Scalars['DateTime']>
  publishOnWeb?: Maybe<Scalars['DateTime']>
  relatedCases?: Maybe<Array<ConsultationPortalRelatedCaseResult>>
  shortDescription?: Maybe<Scalars['String']>
  stakeholders?: Maybe<Array<ConsultationPortalCaseStakeholderResult>>
  statusName?: Maybe<Scalars['String']>
  summaryDate?: Maybe<Scalars['DateTime']>
  summaryDocumentId?: Maybe<Scalars['String']>
  summaryLink?: Maybe<Scalars['String']>
  summaryText?: Maybe<Scalars['String']>
  typeName?: Maybe<Scalars['String']>
}

export type ConsultationPortalCaseStakeholderResult = {
  __typename?: 'ConsultationPortalCaseStakeholderResult'
  email?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type ConsultationPortalCaseSubscriptionCommandInput = {
  id?: InputMaybe<Scalars['Float']>
  subscriptionType?: InputMaybe<CaseSubscriptionType>
}

export type ConsultationPortalCaseSubscriptionResult = {
  __typename?: 'ConsultationPortalCaseSubscriptionResult'
  type?: Maybe<CaseSubscriptionType>
}

export type ConsultationPortalCasesAggregateResult = {
  __typename?: 'ConsultationPortalCasesAggregateResult'
  cases?: Maybe<Array<ConsultationPortalCaseItemResult>>
  filterGroups?: Maybe<Scalars['JSONObject']>
  total: Scalars['Float']
}

export type ConsultationPortalCasesInput = {
  caseStatuses?: InputMaybe<Array<Scalars['Float']>>
  caseTypes?: InputMaybe<Array<Scalars['Float']>>
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
  institutions?: InputMaybe<Array<Scalars['Float']>>
  orderBy?: InputMaybe<Scalars['String']>
  pageNumber?: InputMaybe<Scalars['Float']>
  pageSize?: InputMaybe<Scalars['Float']>
  policyAreas?: InputMaybe<Array<Scalars['Float']>>
  searchQuery?: InputMaybe<Scalars['String']>
}

export type ConsultationPortalDocumentInfoResult = {
  __typename?: 'ConsultationPortalDocumentInfoResult'
  description?: Maybe<Scalars['String']>
  fileName?: Maybe<Scalars['String']>
  fileType?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  link?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Float']>
}

export type ConsultationPortalPostAdviceInput = {
  caseId?: InputMaybe<Scalars['Int']>
  postCaseAdviceCommand?: InputMaybe<ConsultationPortalCasePostAdviceCommandInput>
}

export type ConsultationPortalPostCaseSubscriptionCommandInput = {
  subscriptionType?: InputMaybe<CaseSubscriptionType>
}

export type ConsultationPortalPostCaseSubscriptionTypeInput = {
  caseId?: InputMaybe<Scalars['Int']>
  postCaseSubscriptionCommand?: InputMaybe<ConsultationPortalPostCaseSubscriptionCommandInput>
}

export type ConsultationPortalPostEmailCommandInput = {
  email?: InputMaybe<Scalars['String']>
}

export type ConsultationPortalRelatedCaseResult = {
  __typename?: 'ConsultationPortalRelatedCaseResult'
  caseNumber?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type ConsultationPortalStatisticsResult = {
  __typename?: 'ConsultationPortalStatisticsResult'
  casesInReview?: Maybe<Scalars['Float']>
  totalAdvices?: Maybe<Scalars['Float']>
  totalCases?: Maybe<Scalars['Float']>
}

export type ConsultationPortalSubscriptionCommandInput = {
  id?: InputMaybe<Scalars['Float']>
  subscriptionType?: InputMaybe<SubscriptionType>
}

export type ConsultationPortalUserAdviceAggregate = {
  __typename?: 'ConsultationPortalUserAdviceAggregate'
  advices?: Maybe<Array<ConsultationPortalUserAdviceResult>>
  total?: Maybe<Scalars['Float']>
}

export type ConsultationPortalUserAdviceCaseResult = {
  __typename?: 'ConsultationPortalUserAdviceCaseResult'
  caseNumber?: Maybe<Scalars['String']>
  institutionName?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  policyAreaName?: Maybe<Scalars['String']>
  processBegins?: Maybe<Scalars['DateTime']>
  processEnds?: Maybe<Scalars['DateTime']>
  statusName?: Maybe<Scalars['String']>
  typeName?: Maybe<Scalars['String']>
}

export type ConsultationPortalUserAdviceResult = {
  __typename?: 'ConsultationPortalUserAdviceResult'
  _case?: Maybe<ConsultationPortalUserAdviceCaseResult>
  adviceDocuments?: Maybe<Array<ConsultationPortalDocumentInfoResult>>
  caseId?: Maybe<Scalars['Float']>
  content?: Maybe<Scalars['String']>
  created?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['String']>
  participantEmail?: Maybe<Scalars['String']>
  participantName?: Maybe<Scalars['String']>
}

export type ConsultationPortalUserAdvicesInput = {
  oldestFirst?: InputMaybe<Scalars['Boolean']>
  pageNumber?: InputMaybe<Scalars['Float']>
  pageSize?: InputMaybe<Scalars['Float']>
  searchQuery?: InputMaybe<Scalars['String']>
}

export type ConsultationPortalUserCaseSubscriptionResult = {
  __typename?: 'ConsultationPortalUserCaseSubscriptionResult'
  id?: Maybe<Scalars['Float']>
  subscriptionType?: Maybe<Scalars['String']>
}

export type ConsultationPortalUserEmailResult = {
  __typename?: 'ConsultationPortalUserEmailResult'
  email?: Maybe<Scalars['String']>
  emailVerified?: Maybe<Scalars['Boolean']>
}

export type ConsultationPortalUserSubscriptionResult = {
  __typename?: 'ConsultationPortalUserSubscriptionResult'
  id?: Maybe<Scalars['Float']>
  subscriptionType?: Maybe<Scalars['String']>
}

export type ConsultationPortalUserSubscriptionsAggregate = {
  __typename?: 'ConsultationPortalUserSubscriptionsAggregate'
  cases?: Maybe<Array<ConsultationPortalUserCaseSubscriptionResult>>
  institutions?: Maybe<Array<ConsultationPortalUserSubscriptionResult>>
  policyAreas?: Maybe<Array<ConsultationPortalUserSubscriptionResult>>
  subscribedToAll?: Maybe<Scalars['Boolean']>
  subscribedToAllType?: Maybe<SubscriptionType>
}

export type ConsultationPortalUserSubscriptionsCommandInput = {
  caseIds?: InputMaybe<Array<ConsultationPortalCaseSubscriptionCommandInput>>
  institutionIds?: InputMaybe<Array<ConsultationPortalSubscriptionCommandInput>>
  policyAreaIds?: InputMaybe<Array<ConsultationPortalSubscriptionCommandInput>>
  subscribeToAll?: InputMaybe<Scalars['Boolean']>
  subscribeToAllType?: InputMaybe<SubscriptionType>
}

export type Contact = {
  __typename?: 'Contact'
  created: Scalars['DateTime']
  email: Scalars['String']
  id: Scalars['String']
  modified: Scalars['DateTime']
  name: Scalars['String']
  phoneNumber: Scalars['String']
}

export type ContactUs = {
  __typename?: 'ContactUs'
  errorMessage: Scalars['String']
  id: Scalars['ID']
  invalidEmail: Scalars['String']
  invalidPhone: Scalars['String']
  labelEmail: Scalars['String']
  labelMessage: Scalars['String']
  labelName: Scalars['String']
  labelPhone: Scalars['String']
  labelSubject: Scalars['String']
  required: Scalars['String']
  submitButtonText: Scalars['String']
  successMessage: Scalars['String']
  title: Scalars['String']
}

export type ContactUsInput = {
  email: Scalars['String']
  message: Scalars['String']
  name: Scalars['String']
  phone?: InputMaybe<Scalars['String']>
  subject?: InputMaybe<Scalars['String']>
}

export enum ContentLanguage {
  En = 'en',
  Is = 'is',
}

export type ContentSlug = {
  __typename?: 'ContentSlug'
  activeTranslations?: Maybe<Scalars['JSON']>
  id: Scalars['ID']
  slug?: Maybe<TextFieldLocales>
  title?: Maybe<TextFieldLocales>
  type: Scalars['String']
  url?: Maybe<TextFieldLocales>
}

export type CostOfLivingCalculatorModel = {
  __typename?: 'CostOfLivingCalculatorModel'
  clothes: Scalars['Int']
  communication: Scalars['Int']
  food: Scalars['Int']
  hobby: Scalars['Int']
  medicalCost: Scalars['Int']
  numberOf: Scalars['String']
  otherServices: Scalars['Int']
  text: Scalars['String']
  total: Scalars['Int']
  transport: Scalars['Int']
}

export type CostOfLivingCalculatorResponseModel = {
  __typename?: 'CostOfLivingCalculatorResponseModel'
  items: Array<CostOfLivingCalculatorModel>
}

export type CoursesModel = {
  __typename?: 'CoursesModel'
  courseId?: Maybe<Scalars['String']>
  courseName?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  finalgrade?: Maybe<Scalars['String']>
  stage?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['String']>
  units?: Maybe<Scalars['String']>
}

export enum CreateApplicationDtoTypeIdEnum {
  AccidentNotification = 'AccidentNotification',
  AdditionalSupportForTheElderly = 'AdditionalSupportForTheElderly',
  AlcoholTaxRedemption = 'AlcoholTaxRedemption',
  AnnouncementOfDeath = 'AnnouncementOfDeath',
  AnonymityInVehicleRegistry = 'AnonymityInVehicleRegistry',
  CarRecycling = 'CarRecycling',
  ChangeCoOwnerOfVehicle = 'ChangeCoOwnerOfVehicle',
  ChangeMachineSupervisor = 'ChangeMachineSupervisor',
  ChangeOperatorOfVehicle = 'ChangeOperatorOfVehicle',
  ChildrenResidenceChangeV2 = 'ChildrenResidenceChangeV2',
  Citizenship = 'Citizenship',
  ComplaintsToAlthingiOmbudsman = 'ComplaintsToAlthingiOmbudsman',
  CriminalRecord = 'CriminalRecord',
  DataProtectionAuthorityComplaint = 'DataProtectionAuthorityComplaint',
  DeathBenefits = 'DeathBenefits',
  DeregisterMachine = 'DeregisterMachine',
  DigitalTachographDriversCard = 'DigitalTachographDriversCard',
  DocumentProviderOnboarding = 'DocumentProviderOnboarding',
  DrivingAssessmentApproval = 'DrivingAssessmentApproval',
  DrivingInstructorRegistrations = 'DrivingInstructorRegistrations',
  DrivingLearnersPermit = 'DrivingLearnersPermit',
  DrivingLicense = 'DrivingLicense',
  DrivingLicenseBookUpdateInstructor = 'DrivingLicenseBookUpdateInstructor',
  DrivingLicenseDuplicate = 'DrivingLicenseDuplicate',
  DrivingSchoolConfirmation = 'DrivingSchoolConfirmation',
  EnergyFunds = 'EnergyFunds',
  Estate = 'Estate',
  EuropeanHealthInsuranceCard = 'EuropeanHealthInsuranceCard',
  ExampleAuthDelegation = 'ExampleAuthDelegation',
  ExampleCommonActions = 'ExampleCommonActions',
  ExampleFolderStructureAndConventions = 'ExampleFolderStructureAndConventions',
  ExampleInputs = 'ExampleInputs',
  ExampleNoInputs = 'ExampleNoInputs',
  ExamplePayment = 'ExamplePayment',
  ExampleStateTransfers = 'ExampleStateTransfers',
  FinancialAid = 'FinancialAid',
  FinancialStatementCemetery = 'FinancialStatementCemetery',
  FinancialStatementIndividualElection = 'FinancialStatementIndividualElection',
  FinancialStatementPoliticalParty = 'FinancialStatementPoliticalParty',
  FundingGovernmentProjects = 'FundingGovernmentProjects',
  GeneralFishingLicense = 'GeneralFishingLicense',
  GeneralPetitionService = 'GeneralPetitionService',
  GrindavikHousingBuyout = 'GrindavikHousingBuyout',
  HealthInsurance = 'HealthInsurance',
  HealthInsuranceDeclaration = 'HealthInsuranceDeclaration',
  HealthcareLicenseCertificate = 'HealthcareLicenseCertificate',
  HealthcareWorkPermit = 'HealthcareWorkPermit',
  HomeSupport = 'HomeSupport',
  HouseholdSupplement = 'HouseholdSupplement',
  IdCard = 'IdCard',
  IncomePlan = 'IncomePlan',
  InheritanceReport = 'InheritanceReport',
  InstitutionCollaboration = 'InstitutionCollaboration',
  LegalGazette = 'LegalGazette',
  LicensePlateRenewal = 'LicensePlateRenewal',
  LoginService = 'LoginService',
  MachineRegistration = 'MachineRegistration',
  MarriageConditions = 'MarriageConditions',
  MedicalAndRehabilitationPayments = 'MedicalAndRehabilitationPayments',
  MortgageCertificate = 'MortgageCertificate',
  MunicipalListCreation = 'MunicipalListCreation',
  MunicipalListSigning = 'MunicipalListSigning',
  NewPrimarySchool = 'NewPrimarySchool',
  NoDebtCertificate = 'NoDebtCertificate',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  OldAgePension = 'OldAgePension',
  OperatingLicense = 'OperatingLicense',
  OrderVehicleLicensePlate = 'OrderVehicleLicensePlate',
  OrderVehicleRegistrationCertificate = 'OrderVehicleRegistrationCertificate',
  PSign = 'PSign',
  ParentalLeave = 'ParentalLeave',
  ParliamentaryListCreation = 'ParliamentaryListCreation',
  ParliamentaryListSigning = 'ParliamentaryListSigning',
  Passport = 'Passport',
  PassportAnnulment = 'PassportAnnulment',
  PensionSupplement = 'PensionSupplement',
  PracticalExam = 'PracticalExam',
  PresidentialListCreation = 'PresidentialListCreation',
  PresidentialListSigning = 'PresidentialListSigning',
  PublicDebtPaymentPlan = 'PublicDebtPaymentPlan',
  RentalAgreement = 'RentalAgreement',
  RequestInspectionForMachine = 'RequestInspectionForMachine',
  SecondarySchool = 'SecondarySchool',
  SeminarRegistration = 'SeminarRegistration',
  StreetRegistration = 'StreetRegistration',
  TrainingLicenseOnAWorkMachine = 'TrainingLicenseOnAWorkMachine',
  TransferOfMachineOwnership = 'TransferOfMachineOwnership',
  TransferOfVehicleOwnership = 'TransferOfVehicleOwnership',
  University = 'University',
  WorkAccidentNotification = 'WorkAccidentNotification',
}

export type CreateApplicationInput = {
  initialQuery?: InputMaybe<Scalars['String']>
  typeId: CreateApplicationDtoTypeIdEnum
}

export type CreateAuthAdminClientInput = {
  clientId: Scalars['ID']
  clientType: AuthAdminCreateClientType
  displayName: Scalars['String']
  environments: Array<AuthAdminEnvironment>
  sso?: InputMaybe<AuthAdminClientSso>
  supportedDelegationTypes?: InputMaybe<Array<Scalars['String']>>
  tenantId: Scalars['ID']
}

export type CreateAuthDelegationInput = {
  domainName?: InputMaybe<Scalars['String']>
  scopes?: InputMaybe<Array<AuthDelegationScopeInput>>
  toNationalId: Scalars['String']
}

export type CreateAuthLoginRestrictionInput = {
  until: Scalars['DateTime']
}

export type CreateBarcodeResult = {
  __typename?: 'CreateBarcodeResult'
  /** Barcode expire time in seconds */
  expiresIn: Scalars['Int']
  /** Barcode token */
  token: Scalars['String']
}

export type CreateChangeAppendixInput = {
  diff?: InputMaybe<Scalars['String']>
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type CreateContactInput = {
  email: Scalars['String']
  name: Scalars['String']
  phoneNumber: Scalars['String']
}

export type CreateDelegationInput = {
  fromNationalId: Scalars['String']
  referenceId: Scalars['String']
  toNationalId: Scalars['String']
  type: Scalars['String']
  validTo?: InputMaybe<Scalars['DateTime']>
}

export type CreateDraftRegulationCancelInput = {
  changingId: Scalars['String']
  date: Scalars['String']
  regulation: Scalars['String']
}

export type CreateDraftRegulationChangeInput = {
  appendixes?: InputMaybe<Array<CreateChangeAppendixInput>>
  changingId: Scalars['String']
  comments?: InputMaybe<Scalars['String']>
  date?: InputMaybe<Scalars['String']>
  diff?: InputMaybe<Scalars['String']>
  regulation: Scalars['String']
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type CreateDraftRegulationInput = {
  type?: InputMaybe<Scalars['String']>
}

export type CreateDrivingSchoolTestResultInput = {
  bookId: Scalars['String']
  comments: Scalars['String']
  createdOn: Scalars['String']
  schoolEmployeeNationalId: Scalars['String']
  schoolNationalId: Scalars['String']
  schoolTypeId: Scalars['Float']
}

export type CreateEmailVerificationInput = {
  email: Scalars['String']
}

export type CreateEndorsementInput = {
  endorsementDto: EndorsementInput
  listId: Scalars['String']
}

export type CreateEndorsementListDto = {
  adminLock: Scalars['Boolean']
  closedDate: Scalars['DateTime']
  description?: InputMaybe<Scalars['String']>
  endorsementMetadata: Array<MetadataInput>
  meta?: InputMaybe<Scalars['JSON']>
  openedDate: Scalars['DateTime']
  tags: Array<EndorsementListDtoTagsEnum>
  title: Scalars['String']
}

export type CreateFormSystemApplicantDtoInput = {
  applicantTypeId: Scalars['String']
  formId: Scalars['String']
}

export type CreateFormSystemApplicantInput = {
  createFormApplicantTypeDto?: InputMaybe<CreateFormSystemApplicantDtoInput>
}

export type CreateFormSystemApplicationInput = {
  slug?: InputMaybe<Scalars['String']>
}

export type CreateFormSystemCertificationDtoInput = {
  certificationTypeId?: InputMaybe<Scalars['String']>
  formId?: InputMaybe<Scalars['String']>
}

export type CreateFormSystemCertificationInput = {
  createFormCertificationTypeDto?: InputMaybe<CreateFormSystemCertificationDtoInput>
}

export type CreateFormSystemFieldDtoInput = {
  displayOrder?: InputMaybe<Scalars['Int']>
  fieldType?: InputMaybe<Scalars['String']>
  screenId?: InputMaybe<Scalars['String']>
}

export type CreateHelpdeskInput = {
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type CreateIcelandicNameInput = {
  description?: InputMaybe<Scalars['String']>
  icelandicName: Scalars['String']
  status: Scalars['String']
  type: Scalars['String']
  url?: InputMaybe<Scalars['String']>
  verdict?: InputMaybe<Scalars['String']>
  visible: Scalars['Boolean']
}

export type CreatePracticalDrivingLessonInput = {
  bookId: Scalars['String']
  comments: Scalars['String']
  createdOn: Scalars['String']
  minutes: Scalars['Float']
}

export type CreateProviderInput = {
  clientName: Scalars['String']
  nationalId: Scalars['String']
}

export type CreateRegulationPresignedPostInput = {
  fileName: Scalars['String']
  hash: Scalars['String']
  regId: Scalars['String']
}

export type CreateScopeInput = {
  description: Scalars['String']
  displayName: Scalars['String']
  environments: Array<AuthAdminEnvironment>
  name: Scalars['String']
  tenantId: Scalars['String']
}

export type CreateSmsVerificationInput = {
  mobilePhoneNumber: Scalars['String']
}

export type CreateUserProfileInput = {
  canNudge?: InputMaybe<Scalars['Boolean']>
  documentNotifications?: InputMaybe<Scalars['Boolean']>
  email?: InputMaybe<Scalars['String']>
  emailCode?: InputMaybe<Scalars['String']>
  emailStatus?: InputMaybe<Scalars['String']>
  locale?: InputMaybe<Scalars['String']>
  mobilePhoneNumber?: InputMaybe<Scalars['String']>
  mobileStatus?: InputMaybe<Scalars['String']>
  smsCode?: InputMaybe<Scalars['String']>
}

export type CustomPage = {
  __typename?: 'CustomPage'
  alertBanner?: Maybe<AlertBanner>
  configJson?: Maybe<Scalars['JSONObject']>
  content?: Maybe<Array<Slice>>
  id: Scalars['ID']
  ogDescription?: Maybe<Scalars['String']>
  ogImage?: Maybe<Image>
  ogTitle?: Maybe<Scalars['String']>
  translationStrings: Scalars['JSONObject']
  uniqueIdentifier: Scalars['String']
}

export enum CustomPageUniqueIdentifier {
  BloodDonationRestrictions = 'BloodDonationRestrictions',
  DirectorateOfLabourMyPages = 'DirectorateOfLabourMyPages',
  Grants = 'Grants',
  OfficialJournalOfIceland = 'OfficialJournalOfIceland',
  OfficialJournalOfIcelandHelp = 'OfficialJournalOfIcelandHelp',
  PensionCalculator = 'PensionCalculator',
  Vacancies = 'Vacancies',
  Verdicts = 'Verdicts',
}

export enum DataCategory {
  Financial = 'FINANCIAL',
  Health = 'HEALTH',
  Official = 'OFFICIAL',
  Open = 'OPEN',
  Personal = 'PERSONAL',
  Public = 'PUBLIC',
}

export type DataProvider = {
  actionId: Scalars['String']
  order: Scalars['Float']
}

export type DelegationAdminCustomModel = {
  __typename?: 'DelegationAdminCustomModel'
  incoming: Array<AuthCustomDelegation>
  name: Scalars['String']
  nationalId: Scalars['String']
  outgoing: Array<AuthCustomDelegation>
}

export type DeleteApplicationInput = {
  id: Scalars['String']
}

export type DeleteAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
}

export type DeleteAuthDelegationInput = {
  delegationId: Scalars['String']
}

export type DeleteDraftRegulationCancelInput = {
  id: Scalars['String']
}

export type DeleteDraftRegulationChangeInput = {
  id: Scalars['String']
}

export type DeleteDraftRegulationInput = {
  draftId: Scalars['String']
}

export type DeleteDraftRegulationModel = {
  __typename?: 'DeleteDraftRegulationModel'
  id: Scalars['String']
}

export type DeleteFormSystemApplicantInput = {
  id?: InputMaybe<Scalars['String']>
}

export type DeleteFormSystemCertificationInput = {
  id: Scalars['String']
}

export type DeleteIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type DeleteIslykillValueInput = {
  email?: InputMaybe<Scalars['Boolean']>
  mobilePhoneNumber?: InputMaybe<Scalars['Boolean']>
}

export type DeleteNameResponse = {
  __typename?: 'DeleteNameResponse'
  id: Scalars['Float']
}

export type DeletePracticalDrivingLessonInput = {
  bookId: Scalars['String']
  id: Scalars['String']
  reason: Scalars['String']
}

export type DeleteTokenResponse = {
  __typename?: 'DeleteTokenResponse'
  success: Scalars['Boolean']
}

export type DetailedSchedule = {
  __typename?: 'DetailedSchedule'
  paidAmount: Scalars['Float']
  paidDate: Scalars['String']
  payExplanation: Scalars['String']
  paymentNumber: Scalars['String']
  unpaidAmount: Scalars['Float']
}

export type DiplomaItems = {
  __typename?: 'DiplomaItems'
  diplomaCode?: Maybe<Scalars['String']>
  diplomaCredits?: Maybe<Scalars['Float']>
  diplomaCreditsTotal?: Maybe<Scalars['Float']>
  diplomaDate?: Maybe<Scalars['String']>
  diplomaId?: Maybe<Scalars['Float']>
  diplomaLongName?: Maybe<Scalars['String']>
  diplomaName?: Maybe<Scalars['String']>
  organisation?: Maybe<Scalars['String']>
  organisationId?: Maybe<Scalars['Float']>
  organisationShort?: Maybe<Scalars['String']>
}

export type DiplomaModel = {
  __typename?: 'DiplomaModel'
  items?: Maybe<Array<DiplomaItems>>
}

export type DirectTaxPaymentModel = {
  __typename?: 'DirectTaxPaymentModel'
  month: Scalars['Float']
  payerNationalId: Scalars['String']
  personalAllowance: Scalars['Float']
  totalSalary: Scalars['Float']
  withheldAtSource: Scalars['Float']
  year: Scalars['Float']
}

export type Disqualification = {
  __typename?: 'Disqualification'
  to: Scalars['String']
}

export type DistrictCommissionerAgencies = {
  __typename?: 'DistrictCommissionerAgencies'
  address: Scalars['String']
  id: Scalars['String']
  name: Scalars['String']
  place: Scalars['String']
}

export type Districts = {
  __typename?: 'Districts'
  description?: Maybe<Scalars['String']>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  image?: Maybe<Image>
  links: Array<Link>
  title: Scalars['String']
}

export type Document = {
  __typename?: 'Document'
  bookmarked?: Maybe<Scalars['Boolean']>
  categoryId?: Maybe<Scalars['String']>
  date: Scalars['DateTime']
  fileType: Scalars['String']
  id: Scalars['ID']
  opened: Scalars['Boolean']
  senderName: Scalars['String']
  senderNatReg: Scalars['String']
  subject: Scalars['String']
  url: Scalars['String']
}

export type DocumentCategory = {
  __typename?: 'DocumentCategory'
  id: Scalars['ID']
  name: Scalars['String']
}

export type DocumentConfirmActions = {
  __typename?: 'DocumentConfirmActions'
  confirmed?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
}

export type DocumentConfirmActionsInput = {
  confirmed?: InputMaybe<Scalars['Boolean']>
  id: Scalars['String']
}

export type DocumentDetails = {
  __typename?: 'DocumentDetails'
  archived?: Maybe<Scalars['Boolean']>
  bookmarked?: Maybe<Scalars['Boolean']>
  categoryId?: Maybe<Scalars['String']>
  content: Scalars['String']
  fileType: Scalars['String']
  html: Scalars['String']
  publicationDate?: Maybe<Scalars['DateTime']>
  senderKennitala?: Maybe<Scalars['String']>
  senderName?: Maybe<Scalars['String']>
  subject?: Maybe<Scalars['String']>
  url: Scalars['String']
}

export type DocumentInput = {
  /** Optional. For logging only. */
  category?: InputMaybe<Scalars['String']>
  id: Scalars['String']
  includeDocument?: InputMaybe<Scalars['Boolean']>
  pageSize?: InputMaybe<Scalars['Float']>
  /** Optional. For logging only. */
  provider?: InputMaybe<Scalars['String']>
}

export type DocumentListResponse = {
  __typename?: 'DocumentListResponse'
  data: Array<Document>
  totalCount?: Maybe<Scalars['Float']>
  unreadCount?: Maybe<Scalars['Float']>
}

export type DocumentMailAction = {
  __typename?: 'DocumentMailAction'
  messageIds: Array<Scalars['String']>
  success: Scalars['Boolean']
}

export type DocumentPageNumber = {
  __typename?: 'DocumentPageNumber'
  pageNumber: Scalars['Int']
}

export type DocumentPageResponse = {
  __typename?: 'DocumentPageResponse'
  messagePage: Scalars['Int']
}

export type DocumentPdfRenderer = {
  __typename?: 'DocumentPdfRenderer'
  id: Scalars['String']
  success: Scalars['Boolean']
}

export type DocumentPdfRendererInput = {
  actions?: InputMaybe<Array<Scalars['String']>>
  error?: InputMaybe<Scalars['String']>
  id: Scalars['String']
  isCourtCase?: InputMaybe<Scalars['Boolean']>
  success: Scalars['Boolean']
}

export type DocumentProviderCategoriesAndTypesPostInput = {
  active?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<Scalars['String']>
}

export type DocumentProviderCategoriesAndTypesPutInput = {
  active?: InputMaybe<Scalars['Boolean']>
  id: Scalars['Int']
  name?: InputMaybe<Scalars['String']>
}

export type DocumentProviderCategory = {
  __typename?: 'DocumentProviderCategory'
  active?: Maybe<Scalars['Boolean']>
  id: Scalars['Int']
  name?: Maybe<Scalars['String']>
}

export type DocumentProviderPaperMail = {
  __typename?: 'DocumentProviderPaperMail'
  dateAdded?: Maybe<Scalars['DateTime']>
  dateUpdated?: Maybe<Scalars['DateTime']>
  nationalId: Scalars['String']
  origin: Scalars['String']
  wantsPaper: Scalars['Boolean']
}

export type DocumentProviderPaperMailInput = {
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
}

export type DocumentProviderPaperMailResponse = {
  __typename?: 'DocumentProviderPaperMailResponse'
  paperMail: Array<DocumentProviderPaperMail>
  totalCount: Scalars['Int']
}

export type DocumentProviderType = {
  __typename?: 'DocumentProviderType'
  active?: Maybe<Scalars['Boolean']>
  id: Scalars['Int']
  name?: Maybe<Scalars['String']>
}

export type DocumentSender = {
  __typename?: 'DocumentSender'
  id: Scalars['ID']
  name: Scalars['String']
}

export type DocumentType = {
  __typename?: 'DocumentType'
  id: Scalars['ID']
  name: Scalars['String']
}

export type DocumentV2 = {
  __typename?: 'DocumentV2'
  actions?: Maybe<Array<DocumentV2Action>>
  alert?: Maybe<DocumentV2Action>
  archived?: Maybe<Scalars['Boolean']>
  bookmarked?: Maybe<Scalars['Boolean']>
  categoryId?: Maybe<Scalars['String']>
  confirmation?: Maybe<DocumentV2Action>
  content?: Maybe<DocumentV2Content>
  documentDate?: Maybe<Scalars['DateTime']>
  /** URL in download service. For downloading PDFs */
  downloadUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isUrgent?: Maybe<Scalars['Boolean']>
  name?: Maybe<Scalars['String']>
  opened?: Maybe<Scalars['Boolean']>
  publicationDate?: Maybe<Scalars['DateTime']>
  sender: DocumentsV2Sender
  subject: Scalars['String']
}

export type DocumentV2Action = {
  __typename?: 'DocumentV2Action'
  data?: Maybe<Scalars['String']>
  icon?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type DocumentV2Content = {
  __typename?: 'DocumentV2Content'
  type: DocumentsV2FileType
  /** Either pdf base64 string, html markup string, or an url */
  value?: Maybe<Scalars['String']>
}

export type DocumentV2MarkAllMailAsRead = {
  __typename?: 'DocumentV2MarkAllMailAsRead'
  success: Scalars['Boolean']
}

export type DocumentV2PaperMailPreferences = {
  __typename?: 'DocumentV2PaperMailPreferences'
  nationalId: Scalars['String']
  wantsPaper: Scalars['Boolean']
}

export type DocumentsV2 = {
  __typename?: 'DocumentsV2'
  categories: Array<DocumentsV2Category>
  data: Array<DocumentV2>
  pageInfo: PageInfoDto
  senders: Array<DocumentsV2Sender>
  totalCount: Scalars['Float']
  types: Array<DocumentsV2Type>
  unreadCount?: Maybe<Scalars['Float']>
}

export type DocumentsV2Base = {
  id: Scalars['String']
  name?: Maybe<Scalars['String']>
}

export type DocumentsV2Category = DocumentsV2Base & {
  __typename?: 'DocumentsV2Category'
  id: Scalars['String']
  name?: Maybe<Scalars['String']>
}

export type DocumentsV2DocumentsInput = {
  archived?: InputMaybe<Scalars['Boolean']>
  bookmarked?: InputMaybe<Scalars['Boolean']>
  categoryIds?: InputMaybe<Array<Scalars['String']>>
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
  opened?: InputMaybe<Scalars['Boolean']>
  order?: InputMaybe<DocumentsV2PageOrder>
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  senderNationalId?: InputMaybe<Array<Scalars['String']>>
  sortBy?: InputMaybe<DocumentsV2PageSort>
  subjectContains?: InputMaybe<Scalars['String']>
  typeId?: InputMaybe<Scalars['String']>
}

export enum DocumentsV2FileType {
  Html = 'HTML',
  Pdf = 'PDF',
  Unknown = 'UNKNOWN',
  Url = 'URL',
}

export type DocumentsV2MailActionInput = {
  action: Scalars['String']
  documentIds: Array<Scalars['String']>
}

export enum DocumentsV2PageOrder {
  Ascending = 'Ascending',
  Descending = 'Descending',
}

export enum DocumentsV2PageSort {
  Category = 'Category',
  Date = 'Date',
  Publication = 'Publication',
  Sender = 'Sender',
  Subject = 'Subject',
  Type = 'Type',
}

export type DocumentsV2Sender = {
  __typename?: 'DocumentsV2Sender'
  id?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type DocumentsV2Type = DocumentsV2Base & {
  __typename?: 'DocumentsV2Type'
  id: Scalars['String']
  name?: Maybe<Scalars['String']>
}

export type DraftProgressInput = {
  stepsFinished: Scalars['Float']
  totalSteps: Scalars['Float']
}

export type DraftRegulationCancelModel = {
  __typename?: 'DraftRegulationCancelModel'
  date?: Maybe<Scalars['String']>
  dropped?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  regTitle?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type DraftRegulationChangeModel = {
  __typename?: 'DraftRegulationChangeModel'
  appendixes?: Maybe<Array<ChangeAppendix>>
  comments?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['String']>
  diff?: Maybe<Scalars['String']>
  dropped?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  regTitle?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type DraftRegulationPagingModel = {
  __typename?: 'DraftRegulationPagingModel'
  page: Scalars['Float']
  pages: Scalars['Float']
}

/** Info about how to download the draft regulation PDF */
export type DraftRegulationPdfDownloadModel = {
  __typename?: 'DraftRegulationPdfDownloadModel'
  /** Does the download go through the download service? If true needs special handling in client */
  downloadService: Scalars['Boolean']
  /** URL of the draft regulation PDF file */
  url?: Maybe<Scalars['String']>
}

export type DraftRegulationShippedModel = {
  __typename?: 'DraftRegulationShippedModel'
  authors: Array<RegulationShippedAuthor>
  draftingStatus: Scalars['String']
  fastTrack?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
  idealPublishDate?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type DraftRegulationSummary = {
  __typename?: 'DraftRegulationSummary'
  authors: Array<RegulationSummaryAuthor>
  draftingStatus: Scalars['String']
  fastTrack?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
  idealPublishDate?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type DrivingBookLesson = {
  __typename?: 'DrivingBookLesson'
  comments: Scalars['String']
  id: Scalars['ID']
  lessonTime: Scalars['Float']
  registerDate: Scalars['String']
  teacherName: Scalars['String']
  teacherNationalId: Scalars['String']
}

export type DrivingLicenceTestResult = {
  __typename?: 'DrivingLicenceTestResult'
  comments: Scalars['String']
  examDate: Scalars['String']
  hasPassed: Scalars['Boolean']
  id: Scalars['ID']
  score: Scalars['Float']
  scorePart1: Scalars['Float']
  scorePart2: Scalars['Float']
  testCenterName: Scalars['String']
  testCenterNationalId: Scalars['String']
  testExaminerName: Scalars['String']
  testExaminerNationalId: Scalars['String']
  testTypeCode: Scalars['String']
  testTypeId: Scalars['Float']
  testTypeName: Scalars['String']
}

export type DrivingLicenceTestResultId = {
  __typename?: 'DrivingLicenceTestResultId'
  id: Scalars['ID']
}

export type DrivingLicense = {
  __typename?: 'DrivingLicense'
  birthCountry?: Maybe<Scalars['String']>
  categories: Array<Eligibility>
  disqualification?: Maybe<Disqualification>
  expires: Scalars['DateTime']
  id: Scalars['ID']
  issued: Scalars['DateTime']
  name: Scalars['String']
  remarks: Array<Scalars['String']>
}

export type DrivingLicenseBook = {
  __typename?: 'DrivingLicenseBook'
  createdOn: Scalars['String']
  drivingSchoolExams: Array<DrivingSchoolExam>
  id: Scalars['String']
  isDigital: Scalars['Boolean']
  licenseCategory: Scalars['String']
  practiceDriving: Scalars['Boolean']
  schoolName: Scalars['String']
  schoolNationalId: Scalars['String']
  status: Scalars['Float']
  statusName: Scalars['String']
  teacherName: Scalars['String']
  teacherNationalId: Scalars['String']
  teachersAndLessons: Array<DrivingBookLesson>
  testResults: Array<DrivingLicenceTestResult>
  totalLessonCount: Scalars['Float']
  totalLessonTime: Scalars['Float']
}

export type DrivingLicenseBookSchool = {
  __typename?: 'DrivingLicenseBookSchool'
  address: Scalars['String']
  allowedDrivingSchoolTypes: Array<DrivingSchoolType>
  email: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['ID']
  phoneNumber: Scalars['String']
  website: Scalars['String']
  zipCode: Scalars['String']
}

export type DrivingLicenseBookStudent = {
  __typename?: 'DrivingLicenseBookStudent'
  active: Scalars['Boolean']
  address: Scalars['String']
  bookLicenseCategories: Array<Scalars['String']>
  email: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  nationalId: Scalars['String']
  primaryPhoneNumber: Scalars['String']
  secondaryPhoneNumber: Scalars['String']
  zipCode: Scalars['Float']
}

export type DrivingLicenseBookStudentForTeacher = {
  __typename?: 'DrivingLicenseBookStudentForTeacher'
  id: Scalars['ID']
  name: Scalars['String']
  nationalId: Scalars['String']
  totalLessonCount: Scalars['Float']
}

export type DrivingLicenseBookStudentInput = {
  licenseCategory?: InputMaybe<Scalars['String']>
  nationalId: Scalars['String']
}

export type DrivingLicenseBookStudentOverview = {
  __typename?: 'DrivingLicenseBookStudentOverview'
  active: Scalars['Boolean']
  address: Scalars['String']
  book: DrivingLicenseBook
  bookLicenseCategories: Array<Scalars['String']>
  email: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  nationalId: Scalars['String']
  primaryPhoneNumber: Scalars['String']
  secondaryPhoneNumber: Scalars['String']
  zipCode: Scalars['Float']
}

export type DrivingLicenseBookStudentsInput = {
  cursor: Scalars['String']
  key: Scalars['String']
  licenseCategory: Scalars['String']
  limit: Scalars['Float']
}

export type DrivingLicenseBookSuccess = {
  __typename?: 'DrivingLicenseBookSuccess'
  success: Scalars['Boolean']
}

export type DrivingLicenseQualityPhoto = {
  __typename?: 'DrivingLicenseQualityPhoto'
  dataUri?: Maybe<Scalars['String']>
  hasQualityPhoto: Scalars['Boolean']
}

export type DrivingLicenseQualitySignature = {
  __typename?: 'DrivingLicenseQualitySignature'
  dataUri?: Maybe<Scalars['String']>
  hasQualitySignature: Scalars['Boolean']
}

export type DrivingSchoolExam = {
  __typename?: 'DrivingSchoolExam'
  comments: Scalars['String']
  examDate: Scalars['String']
  id: Scalars['ID']
  schoolEmployeeName: Scalars['String']
  schoolEmployeeNationalId: Scalars['String']
  schoolName: Scalars['String']
  schoolNationalId: Scalars['String']
  schoolTypeCode: Scalars['String']
  schoolTypeId: Scalars['Float']
  schoolTypeName: Scalars['String']
  status: Scalars['Float']
  statusName: Scalars['String']
}

export type DrivingSchoolType = {
  __typename?: 'DrivingSchoolType'
  licenseCategory: Scalars['String']
  schoolTypeCode: Scalars['String']
  schoolTypeId: Scalars['Float']
  schoolTypeName: Scalars['String']
}

export type EditDraftBody = {
  appendixes?: InputMaybe<Array<AppendixInput>>
  comments?: InputMaybe<Scalars['String']>
  draftingNotes?: InputMaybe<Scalars['String']>
  draftingStatus?: InputMaybe<Scalars['String']>
  effectiveDate?: InputMaybe<Scalars['String']>
  fastTrack: Scalars['Boolean']
  idealPublishDate?: InputMaybe<Scalars['String']>
  lawChapters?: InputMaybe<Array<Scalars['String']>>
  ministry?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  signatureDate?: InputMaybe<Scalars['String']>
  signatureText?: InputMaybe<Scalars['String']>
  signedDocumentUrl?: InputMaybe<Scalars['String']>
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
}

export type EditDraftRegulationInput = {
  body: EditDraftBody
  id: Scalars['String']
}

export type EducationCompulsorySchoolCourse = {
  __typename?: 'EducationCompulsorySchoolCourse'
  competence: EducationCompulsorySchoolCourseCompetence
  gradeCategories?: Maybe<Array<EducationCompulsorySchoolGradeCategory>>
  label: Scalars['String']
  totalGrade?: Maybe<EducationCompulsorySchoolGrade>
}

export type EducationCompulsorySchoolCourseCompetence = {
  __typename?: 'EducationCompulsorySchoolCourseCompetence'
  competenceStatus?: Maybe<Scalars['String']>
  competencyGrade: Scalars['String']
}

export type EducationCompulsorySchoolGrade = {
  __typename?: 'EducationCompulsorySchoolGrade'
  compulsorySchoolGrade: EducationCompulsorySchoolGradeDetail
  /** National standardised test grade */
  serialGrade: EducationCompulsorySchoolGradeDetail
}

export type EducationCompulsorySchoolGradeCategory = {
  label: Scalars['String']
}

export type EducationCompulsorySchoolGradeCategoryText = EducationCompulsorySchoolGradeCategory & {
  __typename?: 'EducationCompulsorySchoolGradeCategoryText'
  label: Scalars['String']
  text: Scalars['String']
}

export type EducationCompulsorySchoolGradeCategoryWeighted = EducationCompulsorySchoolGradeCategory & {
  __typename?: 'EducationCompulsorySchoolGradeCategoryWeighted'
  grade: EducationCompulsorySchoolGrade
  label: Scalars['String']
}

export type EducationCompulsorySchoolGradeDetail = {
  __typename?: 'EducationCompulsorySchoolGradeDetail'
  grade: Scalars['String']
  label?: Maybe<Scalars['String']>
  weight?: Maybe<Scalars['Int']>
}

export type EducationCompulsorySchoolGradeLevelExamResults = {
  __typename?: 'EducationCompulsorySchoolGradeLevelExamResults'
  coursesExamResults?: Maybe<Array<EducationCompulsorySchoolCourse>>
  gradeLevel: Scalars['Int']
}

export type EducationCompulsorySchoolStudentCareer = {
  __typename?: 'EducationCompulsorySchoolStudentCareer'
  examDateSpan?: Maybe<Scalars['String']>
  examResults?: Maybe<Array<EducationCompulsorySchoolGradeLevelExamResults>>
  isChildOfUser?: Maybe<Scalars['Boolean']>
  name: Scalars['String']
  nationalId: Scalars['String']
}

export type EducationCourseGrade = {
  __typename?: 'EducationCourseGrade'
  competence: Scalars['String']
  competenceStatus: Scalars['String']
  gradeSum?: Maybe<GradeType>
  grades: Array<GradeType>
  label: Scalars['String']
  progressText?: Maybe<Grade>
  wordAndNumbers?: Maybe<Grade>
}

export type EducationExamFamilyOverview = {
  __typename?: 'EducationExamFamilyOverview'
  familyIndex: Scalars['Int']
  isChild: Scalars['Boolean']
  name: Scalars['String']
  nationalId: Scalars['ID']
  organizationName: Scalars['String']
  organizationType: Scalars['String']
  yearInterval: Scalars['String']
}

export type EducationExamResult = {
  __typename?: 'EducationExamResult'
  fullName: Scalars['String']
  grades: Array<EducationGradeResult>
  id: Scalars['ID']
}

export type EducationFriggAddressModel = {
  __typename?: 'EducationFriggAddressModel'
  address: Scalars['String']
  country?: Maybe<Scalars['String']>
  id: Scalars['String']
  municipality?: Maybe<Scalars['String']>
  postCode: Scalars['String']
}

export type EducationFriggKeyOptionModel = {
  __typename?: 'EducationFriggKeyOptionModel'
  options: Array<EducationFriggOptionModel>
  type: Scalars['String']
}

export type EducationFriggOptionModel = {
  __typename?: 'EducationFriggOptionModel'
  id: Scalars['String']
  key: Scalars['String']
  value: Array<EducationFriggValueModel>
}

export type EducationFriggOptionsListInput = {
  type: Scalars['String']
}

export type EducationFriggOrganizationModel = {
  __typename?: 'EducationFriggOrganizationModel'
  address?: Maybe<EducationFriggAddressModel>
  children?: Maybe<Array<EducationFriggOrganizationModel>>
  email?: Maybe<Scalars['String']>
  gradeLevels?: Maybe<Array<Scalars['String']>>
  id: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['String']
  phone?: Maybe<Scalars['String']>
  type: OrganizationModelTypeEnum
  unitId?: Maybe<Scalars['String']>
  website?: Maybe<Scalars['String']>
}

export type EducationFriggValueModel = {
  __typename?: 'EducationFriggValueModel'
  content: Scalars['String']
  language: Scalars['String']
}

export type EducationGradeResult = {
  __typename?: 'EducationGradeResult'
  courses: Array<EducationCourseGrade>
  studentYear: Scalars['String']
}

export type EducationLicense = {
  __typename?: 'EducationLicense'
  date: Scalars['String']
  id: Scalars['ID']
  programme: Scalars['String']
  school: Scalars['String']
}

export type EducationSignedLicense = {
  __typename?: 'EducationSignedLicense'
  url: Scalars['ID']
}

export type EducationUserFamilyCompulsorySchoolCareer = {
  __typename?: 'EducationUserFamilyCompulsorySchoolCareer'
  familyMemberCareers?: Maybe<Array<EducationCompulsorySchoolStudentCareer>>
  userCareer?: Maybe<EducationCompulsorySchoolStudentCareer>
}

export type Eligibility = {
  __typename?: 'Eligibility'
  comment: Scalars['String']
  expires: Scalars['DateTime']
  issued: Scalars['DateTime']
  name: Scalars['ID']
}

export type EmailSignup = {
  __typename?: 'EmailSignup'
  configuration?: Maybe<Scalars['JSON']>
  description?: Maybe<Scalars['String']>
  formFields?: Maybe<Array<FormField>>
  id: Scalars['ID']
  signupType?: Maybe<Scalars['String']>
  title: Scalars['String']
  translations?: Maybe<Scalars['JSON']>
}

export type EmailSignupInput = {
  inputFields: Array<EmailSignupInputField>
  signupID: Scalars['String']
}

export type EmailSignupInputField = {
  id: Scalars['String']
  name: Scalars['String']
  type: Scalars['String']
  value: Scalars['String']
}

export type EmailSignupResponse = {
  __typename?: 'EmailSignupResponse'
  subscribed: Scalars['Boolean']
}

export type Embed = {
  __typename?: 'Embed'
  altText?: Maybe<Scalars['String']>
  aspectRatio?: Maybe<Scalars['String']>
  embedUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  title: Scalars['String']
}

export type EmbeddedVideo = {
  __typename?: 'EmbeddedVideo'
  id: Scalars['ID']
  thumbnailImageUrl?: Maybe<Scalars['String']>
  title: Scalars['String']
  url: Scalars['String']
}

export type Endorsement = {
  __typename?: 'Endorsement'
  created: Scalars['String']
  endorsementList?: Maybe<EndorsementListOpen>
  endorsementListId: Scalars['String']
  endorser: Scalars['String']
  id: Scalars['ID']
  meta: EndorsementMetadata
  modified: Scalars['String']
}

export type EndorsementInput = {
  showName: Scalars['Boolean']
}

export type EndorsementList = {
  __typename?: 'EndorsementList'
  adminLock: Scalars['Boolean']
  closedDate: Scalars['DateTime']
  created: Scalars['String']
  description?: Maybe<Scalars['String']>
  endorsementCounter?: Maybe<Scalars['Float']>
  id: Scalars['ID']
  meta: Scalars['JSON']
  modified: Scalars['String']
  openedDate: Scalars['DateTime']
  owner?: Maybe<Scalars['String']>
  ownerName?: Maybe<Scalars['String']>
  tags: Array<EndorsementListTagsEnum>
  title: Scalars['String']
}

export enum EndorsementListControllerFindByTagsTagsEnum {
  GeneralPetition = 'generalPetition',
}

export enum EndorsementListDtoTagsEnum {
  GeneralPetition = 'generalPetition',
}

export type EndorsementListOpen = {
  __typename?: 'EndorsementListOpen'
  adminLock: Scalars['Boolean']
  closedDate: Scalars['DateTime']
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  openedDate: Scalars['DateTime']
  tags?: Maybe<Array<EndorsementListOpenTagsEnum>>
  title: Scalars['String']
}

export enum EndorsementListOpenTagsEnum {
  GeneralPetition = 'generalPetition',
}

export enum EndorsementListTagsEnum {
  GeneralPetition = 'generalPetition',
}

export type EndorsementMetadata = {
  __typename?: 'EndorsementMetadata'
  fullName?: Maybe<Scalars['String']>
  locality?: Maybe<Scalars['String']>
}

export enum EndorsementMetadataDtoFieldEnum {
  FullName = 'fullName',
  ShowName = 'showName',
}

export type EndorsementPaginationInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
  tags: Array<EndorsementListControllerFindByTagsTagsEnum>
}

export type EnergyFundVehicleDetailsWithGrant = {
  __typename?: 'EnergyFundVehicleDetailsWithGrant'
  color?: Maybe<Scalars['String']>
  firstRegistrationDate?: Maybe<Scalars['DateTime']>
  hasReceivedSubsidy?: Maybe<Scalars['Boolean']>
  make?: Maybe<Scalars['String']>
  newRegistrationDate?: Maybe<Scalars['DateTime']>
  permno?: Maybe<Scalars['String']>
  requireMileage?: Maybe<Scalars['Boolean']>
  vehicleGrant?: Maybe<Scalars['Float']>
  vehicleGrantItemCode?: Maybe<Scalars['String']>
  vin?: Maybe<Scalars['String']>
}

export type EnergyFundVehicleGrant = {
  __typename?: 'EnergyFundVehicleGrant'
  hasReceivedSubsidy?: Maybe<Scalars['Boolean']>
  vehicleGrant?: Maybe<Scalars['Float']>
  vehicleGrantItemCode?: Maybe<Scalars['String']>
}

export type EnhancedAsset = {
  __typename?: 'EnhancedAsset'
  description: Scalars['String']
  file?: Maybe<Asset>
  genericTags: Array<GenericTag>
  id: Scalars['ID']
  organization: Organization
  releaseDate?: Maybe<Scalars['String']>
  title: Scalars['String']
}

export type EnhancedAssetSearchResult = {
  __typename?: 'EnhancedAssetSearchResult'
  items: Array<EnhancedAsset>
  total: Scalars['Float']
}

export type EntryTitle = {
  __typename?: 'EntryTitle'
  title: Scalars['String']
}

export enum Environment {
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
  Staging = 'STAGING',
}

export type ErrorPage = {
  __typename?: 'ErrorPage'
  description?: Maybe<Html>
  errorCode: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
}

export type EstateRelations = {
  __typename?: 'EstateRelations'
  relations: Array<Scalars['String']>
}

export type Event = {
  __typename?: 'Event'
  content?: Maybe<Array<Slice>>
  contentImage?: Maybe<Image>
  endDate: Scalars['String']
  featuredImage?: Maybe<Image>
  firstPublishedAt?: Maybe<Scalars['String']>
  fullWidthImageInContent?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  location: EventLocation
  organization?: Maybe<Organization>
  slug: Scalars['String']
  startDate: Scalars['String']
  thumbnailImage?: Maybe<Image>
  time: EventTime
  title: Scalars['String']
  video?: Maybe<EmbeddedVideo>
}

export type EventList = {
  __typename?: 'EventList'
  items: Array<Event>
  total: Scalars['Int']
}

export type EventLocation = {
  __typename?: 'EventLocation'
  floor?: Maybe<Scalars['String']>
  freeText?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
  useFreeText?: Maybe<Scalars['Boolean']>
}

export type EventSlice = {
  __typename?: 'EventSlice'
  backgroundImage?: Maybe<Image>
  date: Scalars['String']
  id: Scalars['ID']
  link?: Maybe<Link>
  subtitle: Scalars['String']
  title: Scalars['String']
}

export type EventTime = {
  __typename?: 'EventTime'
  endTime?: Maybe<Scalars['String']>
  startTime?: Maybe<Scalars['String']>
}

export type ExamineeEligibility = {
  __typename?: 'ExamineeEligibility'
  errorMsg?: Maybe<Scalars['String']>
  errorMsgEn?: Maybe<Scalars['String']>
  isEligible?: Maybe<Scalars['Boolean']>
  nationalId?: Maybe<Scalars['String']>
}

export type ExamineeEligibilityInput = {
  nationalIds?: InputMaybe<Array<Scalars['String']>>
  xCorrelationID: Scalars['String']
}

export type ExamineeValidationInput = {
  workMachineExamineeDto?: InputMaybe<WorkMachineExamineeInput>
  xCorrelationID?: InputMaybe<Scalars['String']>
}

export type ExistsEndorsementResponse = {
  __typename?: 'ExistsEndorsementResponse'
  hasEndorsed: Scalars['Boolean']
}

export type ExportEndorsementListInput = {
  fileType: Scalars['String']
  listId: Scalars['String']
}

export type ExportUrlResponse = {
  __typename?: 'ExportUrlResponse'
  url: Scalars['String']
}

export type ExternalLinks = {
  __typename?: 'ExternalLinks'
  bugReport?: Maybe<Scalars['String']>
  documentation?: Maybe<Scalars['String']>
  featureRequest?: Maybe<Scalars['String']>
  responsibleParty: Scalars['String']
}

export type FaqList = {
  __typename?: 'FaqList'
  id: Scalars['ID']
  questions: Array<QuestionAndAnswer>
  showTitle?: Maybe<Scalars['Boolean']>
  title: Scalars['String']
}

export type Featured = {
  __typename?: 'Featured'
  attention: Scalars['Boolean']
  thing?: Maybe<ReferenceLink>
  title: Scalars['String']
}

export type FeaturedArticles = {
  __typename?: 'FeaturedArticles'
  articles: Array<ArticleReference>
  automaticallyFetchArticles?: Maybe<Scalars['Boolean']>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  image?: Maybe<Image>
  introText?: Maybe<Array<Slice>>
  link?: Maybe<Link>
  resolvedArticles: Array<Article>
  sortBy: Scalars['String']
  title: Scalars['String']
}

export type FeaturedEvents = {
  __typename?: 'FeaturedEvents'
  id: Scalars['ID']
  namespace: Scalars['JSONObject']
  noEventsFoundText?: Maybe<Array<Slice>>
  organization?: Maybe<Scalars['String']>
  resolvedEventList: EventList
}

export type FeaturedLinks = {
  __typename?: 'FeaturedLinks'
  featuredLinks?: Maybe<Array<Featured>>
  id: Scalars['ID']
  title: Scalars['String']
}

export type FeaturedSupportQnAs = {
  __typename?: 'FeaturedSupportQNAs'
  automaticallyFetchSupportQNAs?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  link?: Maybe<Link>
  renderedTitle?: Maybe<Scalars['String']>
  resolvedSupportQNAs: Array<SupportQna>
  supportQNAs?: Maybe<Array<SupportQna>>
}

export type FetchEducationSignedLicenseUrlInput = {
  licenseId: Scalars['String']
}

export type FinanceAssessmentYears = {
  __typename?: 'FinanceAssessmentYears'
  year?: Maybe<Array<Scalars['String']>>
}

export type FinanceChargeItemSubjectsByYear = {
  __typename?: 'FinanceChargeItemSubjectsByYear'
  chargeItemSubjects: Array<FinanceChargeItemSubjectsByYearData>
  more?: Maybe<Scalars['Boolean']>
  nextKey?: Maybe<Scalars['String']>
}

export type FinanceChargeItemSubjectsByYearData = {
  __typename?: 'FinanceChargeItemSubjectsByYearData'
  chargeItemSubject: Scalars['String']
  lastMoveDate: Scalars['String']
  periods: Array<FinanceChargeItemSubjectsByYearPeriodData>
  totalAmount: Scalars['Float']
}

export type FinanceChargeItemSubjectsByYearPeriodData = {
  __typename?: 'FinanceChargeItemSubjectsByYearPeriodData'
  amount: Scalars['String']
  description: Scalars['String']
  lastMoveDate: Scalars['String']
  period: Scalars['String']
}

export type FinanceChargeTypeDetails = {
  __typename?: 'FinanceChargeTypeDetails'
  chargeType: Array<FinanceChargeTypeDetailsData>
}

export type FinanceChargeTypeDetailsData = {
  __typename?: 'FinanceChargeTypeDetailsData'
  chargeItemSubjectDescription: Scalars['String']
  chargeItemSubjects: Scalars['String']
  iD: Scalars['String']
  lastMovementDate: Scalars['String']
  name: Scalars['String']
}

export type FinanceChargeTypePeriodSubject = {
  __typename?: 'FinanceChargeTypePeriodSubject'
  message?: Maybe<Scalars['String']>
  more?: Maybe<Scalars['Boolean']>
  nextKey?: Maybe<Scalars['String']>
  records: Array<FinanceChargeTypePeriodSubjectData>
}

export type FinanceChargeTypePeriodSubjectData = {
  __typename?: 'FinanceChargeTypePeriodSubjectData'
  accountReference: Scalars['String']
  actionCategory: Scalars['String']
  amount: Scalars['Float']
  category: Scalars['String']
  chargeItemSubject: Scalars['String']
  chargeType: Scalars['String']
  collectingOrganization: Scalars['String']
  createDate: Scalars['String']
  createTime: Scalars['String']
  itemCode: Scalars['String']
  performingOrganization: Scalars['String']
  period: Scalars['String']
  periodType: Scalars['String']
  reference: Scalars['String']
  referenceToLevy: Scalars['String']
  subCategory: Scalars['String']
  valueDate: Scalars['String']
}

export type FinanceChargeTypesByYear = {
  __typename?: 'FinanceChargeTypesByYear'
  chargeType?: Maybe<Array<FinanceChargeTypesByYearData>>
}

export type FinanceChargeTypesByYearData = {
  __typename?: 'FinanceChargeTypesByYearData'
  iD: Scalars['String']
  name: Scalars['String']
}

export type FinanceCustomerChargeType = {
  __typename?: 'FinanceCustomerChargeType'
  chargeType: Array<FinanceCustomerChargeTypeItem>
}

export type FinanceCustomerChargeTypeItem = {
  __typename?: 'FinanceCustomerChargeTypeItem'
  id: Scalars['String']
  name: Scalars['String']
}

export type FinanceCustomerRecords = {
  __typename?: 'FinanceCustomerRecords'
  records?: Maybe<Array<FinanceCustomerRecordsItem>>
}

export type FinanceCustomerRecordsItem = {
  __typename?: 'FinanceCustomerRecordsItem'
  accountReference: Scalars['String']
  actionCategory?: Maybe<Scalars['String']>
  amount: Scalars['Float']
  category: Scalars['String']
  chargeItemSubject: Scalars['String']
  chargeType: Scalars['String']
  collectingOrganization: Scalars['String']
  createDate: Scalars['String']
  createTime: Scalars['String']
  itemCode: Scalars['String']
  performingOrganization: Scalars['String']
  period: Scalars['String']
  periodType: Scalars['String']
  reference: Scalars['String']
  referenceToLevy: Scalars['String']
  subCategory: Scalars['String']
  valueDate: Scalars['String']
}

export type FinanceCustomerTapsControlModel = {
  __typename?: 'FinanceCustomerTapsControlModel'
  RecordsTap: Scalars['Boolean']
  employeeClaimsTap: Scalars['Boolean']
  localTaxTap: Scalars['Boolean']
  schedulesTap: Scalars['Boolean']
}

export type FinanceDebtStatus = {
  __typename?: 'FinanceDebtStatus'
  approvedSchedule: Scalars['Float']
  notPossibleToSchedule: Scalars['Float']
  possibleToSchedule: Scalars['Float']
  totalAmount: Scalars['Float']
}

export type FinanceDebtStatusModel = {
  __typename?: 'FinanceDebtStatusModel'
  myDebtStatus: Array<FinanceDebtStatus>
}

export type FinanceDocumentData = {
  __typename?: 'FinanceDocumentData'
  document: Scalars['String']
  type: Scalars['String']
}

export type FinanceDocumentModel = {
  __typename?: 'FinanceDocumentModel'
  docment: FinanceDocumentData
}

export type FinanceDocumentsListItem = {
  __typename?: 'FinanceDocumentsListItem'
  amount: Scalars['Float']
  date: Scalars['String']
  dateOpen: Scalars['String']
  id: Scalars['String']
  note?: Maybe<Scalars['String']>
  sender: Scalars['String']
  type: Scalars['String']
}

export type FinanceDocumentsListModel = {
  __typename?: 'FinanceDocumentsListModel'
  documentsList: Array<FinanceDocumentsListItem>
  downloadServiceURL?: Maybe<Scalars['String']>
}

export type FinancialStatementsInaoClientType = {
  __typename?: 'FinancialStatementsInaoClientType'
  label: Scalars['String']
  value: Scalars['String']
}

export type FinancialStatementsInaoConfig = {
  __typename?: 'FinancialStatementsInaoConfig'
  key: Scalars['String']
  value: Scalars['String']
}

export type FinancialStatementsInaoElection = {
  __typename?: 'FinancialStatementsInaoElection'
  electionDate: Scalars['DateTime']
  electionId: Scalars['String']
  genitiveName?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export type FinancialStatementsInaoTaxInfo = {
  __typename?: 'FinancialStatementsInaoTaxInfo'
  key: Scalars['Float']
  value: Scalars['Float']
}

export type FindEndorsementListInput = {
  listId: Scalars['String']
}

/** Possible types of fishing license codes */
export enum FishingLicenseCodeType {
  CatchMark = 'catchMark',
  CommonWhelk = 'commonWhelk',
  CostalFisheries = 'costalFisheries',
  Crustaceans = 'crustaceans',
  FishWithDanishSeine = 'fishWithDanishSeine',
  Freetime = 'freetime',
  FreetimeHook = 'freetimeHook',
  FreetimeHookMed = 'freetimeHookMed',
  Greyslepp = 'greyslepp',
  HookCatchLimit = 'hookCatchLimit',
  Lumpfish = 'lumpfish',
  NorthIceOceanCod = 'northIceOceanCod',
  OceanQuahogin = 'oceanQuahogin',
  Unknown = 'unknown',
}

export type FishingLicenseDateRestriction = {
  __typename?: 'FishingLicenseDateRestriction'
  dateFrom?: Maybe<Scalars['DateTime']>
  dateTo?: Maybe<Scalars['DateTime']>
}

export type FishingLicenseDeprivation = {
  __typename?: 'FishingLicenseDeprivation'
  explanation: Scalars['String']
  invalidFrom?: Maybe<Scalars['DateTime']>
  validFrom?: Maybe<Scalars['DateTime']>
}

export type FishingLicenseInfo = {
  __typename?: 'FishingLicenseInfo'
  chargeType: Scalars['String']
  code: FishingLicenseCodeType
  name: Scalars['String']
}

export type FishingLicenseLicense = {
  __typename?: 'FishingLicenseLicense'
  answer: Scalars['Boolean']
  areas?: Maybe<Array<FishingLicenseListOptions>>
  attachmentInfo?: Maybe<Scalars['String']>
  dateRestriction?: Maybe<FishingLicenseDateRestriction>
  fishingLicenseInfo: FishingLicenseInfo
  reasons: Array<FishingLicenseReason>
}

export type FishingLicenseListOptions = {
  __typename?: 'FishingLicenseListOptions'
  dateRestriction?: Maybe<FishingLicenseDateRestriction>
  description?: Maybe<Scalars['String']>
  disabled: Scalars['Boolean']
  invalidOption: Scalars['Boolean']
  key?: Maybe<Scalars['String']>
}

export type FishingLicenseReason = {
  __typename?: 'FishingLicenseReason'
  description: Scalars['String']
  directions: Scalars['String']
}

export type FishingLicenseSeaworthiness = {
  __typename?: 'FishingLicenseSeaworthiness'
  validTo: Scalars['DateTime']
}

export type FishingLicenseShip = {
  __typename?: 'FishingLicenseShip'
  deprivations: Array<FishingLicenseDeprivation>
  features: Scalars['String']
  fishingLicenses: Array<FishingLicenseInfo>
  grossTons: Scalars['Float']
  homePort: Scalars['String']
  length: Scalars['Float']
  name: Scalars['String']
  registrationNumber: Scalars['Float']
  seaworthiness: FishingLicenseSeaworthiness
}

export type FiskistofaCatchQuotaCategory = {
  __typename?: 'FiskistofaCatchQuotaCategory'
  allocation?: Maybe<Scalars['Float']>
  betweenShips?: Maybe<Scalars['Float']>
  betweenYears?: Maybe<Scalars['Float']>
  catch?: Maybe<Scalars['Float']>
  catchQuota?: Maybe<Scalars['Float']>
  codEquivalent?: Maybe<Scalars['Float']>
  displacement?: Maybe<Scalars['Float']>
  excessCatch?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
  name: Scalars['String']
  newStatus?: Maybe<Scalars['Float']>
  nextYear?: Maybe<Scalars['Float']>
  specialAlloction?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  unused?: Maybe<Scalars['Float']>
}

export type FiskistofaCategoryChange = {
  catchChange: Scalars['Float']
  catchQuotaChange: Scalars['Float']
  id: Scalars['Float']
}

export type FiskistofaExtendedCatchQuotaCategory = {
  __typename?: 'FiskistofaExtendedCatchQuotaCategory'
  allocatedCatchQuota?: Maybe<Scalars['Float']>
  allocation?: Maybe<Scalars['Float']>
  betweenShips?: Maybe<Scalars['Float']>
  betweenYears?: Maybe<Scalars['Float']>
  catch?: Maybe<Scalars['Float']>
  catchQuota?: Maybe<Scalars['Float']>
  codEquivalent?: Maybe<Scalars['Float']>
  displacement?: Maybe<Scalars['Float']>
  excessCatch?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
  name: Scalars['String']
  newStatus?: Maybe<Scalars['Float']>
  nextYear?: Maybe<Scalars['Float']>
  nextYearFromQuota?: Maybe<Scalars['Float']>
  nextYearQuota?: Maybe<Scalars['Float']>
  percentNextYearFromQuota?: Maybe<Scalars['Float']>
  percentNextYearQuota?: Maybe<Scalars['Float']>
  quotaShare?: Maybe<Scalars['Float']>
  specialAlloction?: Maybe<Scalars['Float']>
  status?: Maybe<Scalars['Float']>
  totalCatchQuota?: Maybe<Scalars['Float']>
  unused?: Maybe<Scalars['Float']>
}

export type FiskistofaExtendedShipStatusInformation = {
  __typename?: 'FiskistofaExtendedShipStatusInformation'
  catchQuotaCategories?: Maybe<Array<FiskistofaExtendedCatchQuotaCategory>>
  shipInformation?: Maybe<FiskistofaShip>
}

export type FiskistofaExtendedShipStatusInformationResponse = {
  __typename?: 'FiskistofaExtendedShipStatusInformationResponse'
  fiskistofaShipStatus?: Maybe<FiskistofaExtendedShipStatusInformation>
}

export type FiskistofaExtendedShipStatusInformationUpdate = {
  __typename?: 'FiskistofaExtendedShipStatusInformationUpdate'
  catchQuotaCategories?: Maybe<Array<FiskistofaCatchQuotaCategory>>
  shipInformation?: Maybe<FiskistofaShip>
}

export type FiskistofaExtendedShipStatusInformationUpdateResponse = {
  __typename?: 'FiskistofaExtendedShipStatusInformationUpdateResponse'
  fiskistofaShipStatus?: Maybe<FiskistofaExtendedShipStatusInformationUpdate>
}

export type FiskistofaGetQuotaTypesForCalendarYearInput = {
  year: Scalars['String']
}

export type FiskistofaGetQuotaTypesForTimePeriodInput = {
  timePeriod: Scalars['String']
}

export type FiskistofaGetShipStatusForCalendarYearInput = {
  shipNumber: Scalars['Float']
  year: Scalars['String']
}

export type FiskistofaGetShipStatusForTimePeriodInput = {
  shipNumber: Scalars['Float']
  timePeriod: Scalars['String']
}

export type FiskistofaGetShipsInput = {
  shipName: Scalars['String']
}

export type FiskistofaGetSingleShipInput = {
  shipNumber: Scalars['Float']
}

export type FiskistofaQuotaCategoryChange = {
  allocatedCatchQuota?: InputMaybe<Scalars['Float']>
  id: Scalars['Float']
  nextYearFromQuota?: InputMaybe<Scalars['Float']>
  nextYearQuota?: InputMaybe<Scalars['Float']>
  quotaShare?: InputMaybe<Scalars['Float']>
}

export type FiskistofaQuotaStatus = {
  __typename?: 'FiskistofaQuotaStatus'
  allocatedCatchQuota?: Maybe<Scalars['Float']>
  excessCatch?: Maybe<Scalars['Float']>
  id?: Maybe<Scalars['Float']>
  newStatus?: Maybe<Scalars['Float']>
  nextYearCatchQuota?: Maybe<Scalars['Float']>
  nextYearFromQuota?: Maybe<Scalars['Float']>
  nextYearQuota?: Maybe<Scalars['Float']>
  percentCatchQuotaFrom?: Maybe<Scalars['Float']>
  percentCatchQuotaTo?: Maybe<Scalars['Float']>
  quotaShare?: Maybe<Scalars['Float']>
  totalCatchQuota?: Maybe<Scalars['Float']>
  unused?: Maybe<Scalars['Float']>
}

export type FiskistofaQuotaStatusResponse = {
  __typename?: 'FiskistofaQuotaStatusResponse'
  fiskistofaShipQuotaStatus?: Maybe<FiskistofaQuotaStatus>
}

export type FiskistofaQuotaType = {
  __typename?: 'FiskistofaQuotaType'
  codEquivalent?: Maybe<Scalars['Float']>
  id: Scalars['Float']
  name: Scalars['String']
  totalCatchQuota?: Maybe<Scalars['Float']>
}

export type FiskistofaQuotaTypeResponse = {
  __typename?: 'FiskistofaQuotaTypeResponse'
  fiskistofaQuotaTypes?: Maybe<Array<FiskistofaQuotaType>>
}

export type FiskistofaShip = {
  __typename?: 'FiskistofaShip'
  id: Scalars['String']
  name: Scalars['String']
  shipNumber?: Maybe<Scalars['Float']>
  timePeriod: Scalars['String']
}

export type FiskistofaShipBasicInfo = {
  __typename?: 'FiskistofaShipBasicInfo'
  homePort: Scalars['String']
  id: Scalars['Float']
  name: Scalars['String']
  operator: Scalars['String']
  typeOfVessel: Scalars['String']
}

export type FiskistofaShipBasicInfoResponse = {
  __typename?: 'FiskistofaShipBasicInfoResponse'
  fiskistofaShips?: Maybe<Array<FiskistofaShipBasicInfo>>
}

export type FiskistofaShipStatusInformation = {
  __typename?: 'FiskistofaShipStatusInformation'
  catchQuotaCategories?: Maybe<Array<FiskistofaCatchQuotaCategory>>
  shipInformation?: Maybe<FiskistofaShip>
}

export type FiskistofaShipStatusInformationResponse = {
  __typename?: 'FiskistofaShipStatusInformationResponse'
  fiskistofaShipStatus?: Maybe<FiskistofaShipStatusInformation>
}

export type FiskistofaSingleShip = {
  __typename?: 'FiskistofaSingleShip'
  grossTons?: Maybe<Scalars['Float']>
  name: Scalars['String']
  operatingCategory: Scalars['String']
  operatorName: Scalars['String']
  operatorSsn: Scalars['String']
  ownerName: Scalars['String']
  ownerSsn: Scalars['String']
  shipNumber?: Maybe<Scalars['Float']>
}

export type FiskistofaSingleShipResponse = {
  __typename?: 'FiskistofaSingleShipResponse'
  fiskistofaSingleShip?: Maybe<FiskistofaSingleShip>
}

export type FiskistofaUpdateShipQuotaStatusForTimePeriodInput = {
  change: FiskistofaQuotaCategoryChange
  shipNumber: Scalars['Float']
  timePeriod: Scalars['String']
}

export type FiskistofaUpdateShipStatusForCalendarYearInput = {
  changes: Array<FiskistofaCategoryChange>
  shipNumber: Scalars['Float']
  year: Scalars['String']
}

export type FiskistofaUpdateShipStatusForTimePeriodInput = {
  changes: Array<FiskistofaCategoryChange>
  shipNumber: Scalars['Float']
  timePeriod: Scalars['String']
}

export type FooterItem = {
  __typename?: 'FooterItem'
  content?: Maybe<Array<Slice>>
  id: Scalars['ID']
  link?: Maybe<Link>
  serviceWebContent?: Maybe<Array<Slice>>
  title: Scalars['String']
}

export type Form = {
  __typename?: 'Form'
  aboutYouHeadingText: Scalars['String']
  defaultFieldNamespace?: Maybe<Scalars['JSON']>
  fields: Array<FormField>
  id: Scalars['ID']
  intro: Scalars['String']
  questionsHeadingText: Scalars['String']
  recipientFormFieldDecider?: Maybe<FormField>
  recipientList?: Maybe<Array<Scalars['String']>>
  successText: Scalars['String']
  title: Scalars['String']
}

export type FormField = {
  __typename?: 'FormField'
  emailConfig?: Maybe<Scalars['JSON']>
  id: Scalars['ID']
  informationText?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  options: Array<Scalars['String']>
  placeholder: Scalars['String']
  required: Scalars['Boolean']
  title: Scalars['String']
  type: Scalars['String']
}

export type FormSystemApplicant = {
  __typename?: 'FormSystemApplicant'
  applicantTypeId?: Maybe<Scalars['String']>
  description?: Maybe<FormSystemLanguageType>
  id: Scalars['String']
  name?: Maybe<FormSystemLanguageType>
  nameSuggestions?: Maybe<Array<FormSystemLanguageType>>
}

export type FormSystemApplication = {
  __typename?: 'FormSystemApplication'
  completed?: Maybe<Array<Maybe<Scalars['String']>>>
  created?: Maybe<Scalars['DateTime']>
  dependencies?: Maybe<Array<Maybe<FormSystemDependency>>>
  events?: Maybe<Array<Maybe<FormSystemApplicationEventDto>>>
  formId?: Maybe<Scalars['String']>
  formName?: Maybe<FormSystemLanguageType>
  id: Scalars['String']
  isTest?: Maybe<Scalars['Boolean']>
  modified?: Maybe<Scalars['DateTime']>
  organizationName?: Maybe<FormSystemLanguageType>
  sections?: Maybe<Array<Maybe<FormSystemSection>>>
  slug?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  submittedAt?: Maybe<Scalars['DateTime']>
}

export type FormSystemApplicationEventDto = {
  __typename?: 'FormSystemApplicationEventDto'
  created?: Maybe<Scalars['DateTime']>
  eventType?: Maybe<Scalars['String']>
  isFileEvent?: Maybe<Scalars['Boolean']>
}

export type FormSystemApplicationInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemApplicationResponse = {
  __typename?: 'FormSystemApplicationResponse'
  application?: Maybe<FormSystemApplication>
  applications?: Maybe<Array<Maybe<FormSystemApplication>>>
  organizations?: Maybe<Array<Maybe<FormSystemOption>>>
  total?: Maybe<Scalars['Float']>
}

export type FormSystemApplicationsInput = {
  isTest: Scalars['Boolean']
  limit?: InputMaybe<Scalars['Float']>
  organizationNationalId?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Float']>
}

export type FormSystemCreateFieldInput = {
  createFieldDto?: InputMaybe<CreateFormSystemFieldDtoInput>
}

export type FormSystemCreateFormInput = {
  organizationNationalId?: InputMaybe<Scalars['String']>
}

export type FormSystemCreateListItemDtoInput = {
  displayOrder?: InputMaybe<Scalars['Int']>
  fieldId?: InputMaybe<Scalars['String']>
}

export type FormSystemCreateListItemInput = {
  createListItemDto?: InputMaybe<FormSystemCreateListItemDtoInput>
}

export type FormSystemCreateScreenDtoInput = {
  displayOrder?: InputMaybe<Scalars['Int']>
  sectionId?: InputMaybe<Scalars['String']>
}

export type FormSystemCreateScreenInput = {
  createScreenDto?: InputMaybe<FormSystemCreateScreenDtoInput>
}

export type FormSystemCreateSectionDtoInput = {
  displayOrder?: InputMaybe<Scalars['Int']>
  formId?: InputMaybe<Scalars['String']>
}

export type FormSystemCreateSectionInput = {
  createSectionDto?: InputMaybe<FormSystemCreateSectionDtoInput>
}

export type FormSystemDeleteFieldInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemDeleteFormInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemDeleteListItemInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemDeleteScreenInput = {
  id: Scalars['String']
}

export type FormSystemDeleteSectionInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemDependency = {
  __typename?: 'FormSystemDependency'
  childProps?: Maybe<Array<Maybe<Scalars['String']>>>
  isSelected?: Maybe<Scalars['Boolean']>
  parentProp?: Maybe<Scalars['String']>
}

export type FormSystemDependencyInput = {
  childProps?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  isSelected?: InputMaybe<Scalars['Boolean']>
  parentProp?: InputMaybe<Scalars['String']>
}

export type FormSystemField = {
  __typename?: 'FormSystemField'
  description?: Maybe<FormSystemLanguageType>
  displayOrder?: Maybe<Scalars['Int']>
  fieldSettings?: Maybe<FormSystemFieldSettings>
  fieldType?: Maybe<Scalars['String']>
  id: Scalars['String']
  isHidden?: Maybe<Scalars['Boolean']>
  isPartOfMultiset: Scalars['Boolean']
  isRequired: Scalars['Boolean']
  list?: Maybe<Array<Maybe<FormSystemListItem>>>
  name: FormSystemLanguageType
  screenId: Scalars['String']
  values?: Maybe<Array<Maybe<FormSystemValueDto>>>
}

export type FormSystemFieldDisplayOrderInput = {
  id?: InputMaybe<Scalars['String']>
  screenId?: InputMaybe<Scalars['String']>
}

export type FormSystemFieldSettings = {
  __typename?: 'FormSystemFieldSettings'
  buttonText?: Maybe<FormSystemLanguageType>
  fileMaxSize?: Maybe<Scalars['Int']>
  fileTypes?: Maybe<Scalars['String']>
  hasLink?: Maybe<Scalars['Boolean']>
  hasPropertyInput?: Maybe<Scalars['Boolean']>
  hasPropertyList?: Maybe<Scalars['Boolean']>
  isLarge?: Maybe<Scalars['Boolean']>
  list?: Maybe<Array<Maybe<FormSystemListItem>>>
  listType?: Maybe<Scalars['String']>
  maxAmount?: Maybe<Scalars['Int']>
  maxDate?: Maybe<Scalars['DateTime']>
  maxFiles?: Maybe<Scalars['Int']>
  maxLength?: Maybe<Scalars['Int']>
  maxValue?: Maybe<Scalars['Int']>
  minAmount?: Maybe<Scalars['Int']>
  minDate?: Maybe<Scalars['DateTime']>
  minLength?: Maybe<Scalars['Int']>
  minValue?: Maybe<Scalars['Int']>
  timeInterval?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
}

export type FormSystemFieldSettingsInput = {
  buttonText?: InputMaybe<FormSystemLanguageTypeInput>
  fileMaxSize?: InputMaybe<Scalars['Int']>
  fileTypes?: InputMaybe<Scalars['String']>
  hasLink?: InputMaybe<Scalars['Boolean']>
  hasPropertyInput?: InputMaybe<Scalars['Boolean']>
  hasPropertyList?: InputMaybe<Scalars['Boolean']>
  isLarge?: InputMaybe<Scalars['Boolean']>
  list?: InputMaybe<Array<InputMaybe<FormSystemListItemInput>>>
  listType?: InputMaybe<Scalars['String']>
  maxAmount?: InputMaybe<Scalars['Int']>
  maxDate?: InputMaybe<Scalars['DateTime']>
  maxFiles?: InputMaybe<Scalars['Int']>
  maxLength?: InputMaybe<Scalars['Int']>
  maxValue?: InputMaybe<Scalars['Int']>
  minAmount?: InputMaybe<Scalars['Int']>
  minDate?: InputMaybe<Scalars['DateTime']>
  minLength?: InputMaybe<Scalars['Int']>
  minValue?: InputMaybe<Scalars['Int']>
  timeInterval?: InputMaybe<Scalars['String']>
  url?: InputMaybe<Scalars['String']>
  year?: InputMaybe<Scalars['Int']>
}

export type FormSystemFieldType = {
  __typename?: 'FormSystemFieldType'
  description: FormSystemLanguageType
  fieldSettings?: Maybe<FormSystemFieldSettings>
  id: Scalars['String']
  isCommon: Scalars['Boolean']
  name: FormSystemLanguageType
  values?: Maybe<Array<Maybe<FormSystemValue>>>
}

export type FormSystemForm = {
  __typename?: 'FormSystemForm'
  applicantTypes?: Maybe<Array<Maybe<FormSystemFormApplicant>>>
  applicationDaysToRemove: Scalars['Int']
  beenPublished?: Maybe<Scalars['Boolean']>
  certificationTypes?: Maybe<Array<Maybe<FormSystemFormCertificationTypeDto>>>
  completedMessage?: Maybe<FormSystemLanguageType>
  created: Scalars['DateTime']
  dependencies?: Maybe<Array<Maybe<FormSystemDependency>>>
  derivedFrom?: Maybe<Scalars['Int']>
  fields?: Maybe<Array<Maybe<FormSystemField>>>
  hasPayment?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
  invalidationDate?: Maybe<Scalars['DateTime']>
  isTranslated: Scalars['Boolean']
  modified: Scalars['DateTime']
  name: FormSystemLanguageType
  organizationDisplayName?: Maybe<FormSystemLanguageType>
  organizationId?: Maybe<Scalars['String']>
  organizationNationalId?: Maybe<Scalars['String']>
  organizationTitle?: Maybe<Scalars['String']>
  organizationTitleEn?: Maybe<Scalars['String']>
  screens?: Maybe<Array<Maybe<FormSystemScreen>>>
  sections?: Maybe<Array<Maybe<FormSystemSection>>>
  slug?: Maybe<Scalars['String']>
  status: Scalars['String']
  stopProgressOnValidatingScreen: Scalars['Boolean']
  urls?: Maybe<Array<Maybe<FormSystemFormUrl>>>
}

export type FormSystemFormApplicant = {
  __typename?: 'FormSystemFormApplicant'
  applicantTypeId?: Maybe<Scalars['String']>
  description?: Maybe<FormSystemLanguageType>
  id: Scalars['String']
  name?: Maybe<FormSystemLanguageType>
  nameSuggestions?: Maybe<Array<FormSystemLanguageType>>
}

export type FormSystemFormCertificationType = {
  __typename?: 'FormSystemFormCertificationType'
  certificationTypeId?: Maybe<Scalars['String']>
  description?: Maybe<FormSystemLanguageType>
  id?: Maybe<Scalars['String']>
  isCommon?: Maybe<Scalars['Boolean']>
  name?: Maybe<FormSystemLanguageType>
  organizationCertificationId?: Maybe<Scalars['String']>
}

export type FormSystemFormCertificationTypeDto = {
  __typename?: 'FormSystemFormCertificationTypeDto'
  certificationTypeId?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
}

export type FormSystemFormResponse = {
  __typename?: 'FormSystemFormResponse'
  applicantTypes?: Maybe<Array<Maybe<FormSystemFormApplicant>>>
  certificationTypes?: Maybe<Array<Maybe<FormSystemFormCertificationType>>>
  fieldTypes?: Maybe<Array<Maybe<FormSystemFieldType>>>
  form?: Maybe<FormSystemForm>
  forms?: Maybe<Array<Maybe<FormSystemForm>>>
  listTypes?: Maybe<Array<Maybe<FormSystemListType>>>
  organizations?: Maybe<Array<Maybe<FormSystemOption>>>
  urls?: Maybe<Array<Maybe<FormSystemOrganizationUrl>>>
}

export type FormSystemFormUrl = {
  __typename?: 'FormSystemFormUrl'
  id?: Maybe<Scalars['String']>
  isTest?: Maybe<Scalars['Boolean']>
  isXroad?: Maybe<Scalars['Boolean']>
  method?: Maybe<Scalars['String']>
  organizationUrlId?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

export type FormSystemFormUrlInput = {
  id?: InputMaybe<Scalars['String']>
  isTest?: InputMaybe<Scalars['Boolean']>
  isXroad?: InputMaybe<Scalars['Boolean']>
  method?: InputMaybe<Scalars['String']>
  organizationUrlId?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Scalars['String']>
  url?: InputMaybe<Scalars['String']>
}

export type FormSystemGetFormInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemGetFormsInput = {
  nationalId?: InputMaybe<Scalars['String']>
}

export type FormSystemGetOrganizationAdminInput = {
  nationalId: Scalars['String']
}

export type FormSystemGetOrganizationInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemLanguageType = {
  __typename?: 'FormSystemLanguageType'
  en?: Maybe<Scalars['String']>
  is?: Maybe<Scalars['String']>
}

export type FormSystemLanguageTypeInput = {
  en?: InputMaybe<Scalars['String']>
  is?: InputMaybe<Scalars['String']>
}

export type FormSystemListItem = {
  __typename?: 'FormSystemListItem'
  description?: Maybe<FormSystemLanguageType>
  displayOrder?: Maybe<Scalars['Int']>
  id: Scalars['String']
  isSelected?: Maybe<Scalars['Boolean']>
  label?: Maybe<FormSystemLanguageType>
  value?: Maybe<Scalars['String']>
}

export type FormSystemListItemDisplayOrderInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemListItemInput = {
  description?: InputMaybe<FormSystemLanguageTypeInput>
  displayOrder?: InputMaybe<Scalars['Int']>
  id?: InputMaybe<Scalars['String']>
  isSelected?: InputMaybe<Scalars['Boolean']>
  label?: InputMaybe<FormSystemLanguageTypeInput>
  value?: InputMaybe<Scalars['String']>
}

export type FormSystemListType = {
  __typename?: 'FormSystemListType'
  description?: Maybe<FormSystemLanguageType>
  id?: Maybe<Scalars['String']>
  isCommon?: Maybe<Scalars['Boolean']>
  name?: Maybe<FormSystemLanguageType>
  type?: Maybe<Scalars['String']>
}

export type FormSystemMonth = {
  __typename?: 'FormSystemMonth'
  amount?: Maybe<Scalars['Int']>
  days?: Maybe<Array<Scalars['Int']>>
  month?: Maybe<Scalars['Int']>
}

export type FormSystemOption = {
  __typename?: 'FormSystemOption'
  isSelected: Scalars['Boolean']
  label: Scalars['String']
  value: Scalars['String']
}

export type FormSystemOrganization = {
  __typename?: 'FormSystemOrganization'
  forms?: Maybe<Array<Maybe<FormSystemForm>>>
  id: Scalars['String']
  name?: Maybe<FormSystemLanguageType>
  nationalId?: Maybe<Scalars['String']>
}

export type FormSystemOrganizationAdmin = {
  __typename?: 'FormSystemOrganizationAdmin'
  certificationTypes?: Maybe<Array<Maybe<FormSystemPermissionType>>>
  fieldTypes?: Maybe<Array<Maybe<FormSystemPermissionType>>>
  listTypes?: Maybe<Array<Maybe<FormSystemPermissionType>>>
  organizationId?: Maybe<Scalars['String']>
  organizations?: Maybe<Array<Maybe<FormSystemOption>>>
  selectedCertificationTypes?: Maybe<Array<Maybe<Scalars['String']>>>
  selectedFieldTypes?: Maybe<Array<Maybe<Scalars['String']>>>
  selectedListTypes?: Maybe<Array<Maybe<Scalars['String']>>>
}

export type FormSystemOrganizationPermissionDto = {
  __typename?: 'FormSystemOrganizationPermissionDto'
  permission?: Maybe<Scalars['String']>
}

export type FormSystemOrganizationPermissionDtoInput = {
  organizationId?: InputMaybe<Scalars['String']>
  permission?: InputMaybe<Scalars['String']>
}

export type FormSystemOrganizationUrl = {
  __typename?: 'FormSystemOrganizationUrl'
  id?: Maybe<Scalars['String']>
  isTest?: Maybe<Scalars['Boolean']>
  isXroad?: Maybe<Scalars['Boolean']>
  method?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

export type FormSystemPermissionType = {
  __typename?: 'FormSystemPermissionType'
  description?: Maybe<FormSystemLanguageType>
  id?: Maybe<Scalars['String']>
  isCommon?: Maybe<Scalars['Boolean']>
  name?: Maybe<FormSystemLanguageType>
}

export type FormSystemScreen = {
  __typename?: 'FormSystemScreen'
  callRuleset?: Maybe<Scalars['Boolean']>
  displayOrder?: Maybe<Scalars['Int']>
  fields?: Maybe<Array<Maybe<FormSystemField>>>
  id: Scalars['String']
  isHidden?: Maybe<Scalars['Boolean']>
  multiset?: Maybe<Scalars['Int']>
  name?: Maybe<FormSystemLanguageType>
  sectionId: Scalars['String']
}

export type FormSystemScreenDisplayOrderInput = {
  id?: InputMaybe<Scalars['String']>
  sectionId?: InputMaybe<Scalars['String']>
}

export type FormSystemSection = {
  __typename?: 'FormSystemSection'
  displayOrder?: Maybe<Scalars['Int']>
  id: Scalars['String']
  isCompleted?: Maybe<Scalars['Boolean']>
  isHidden?: Maybe<Scalars['Boolean']>
  name?: Maybe<FormSystemLanguageType>
  screens?: Maybe<Array<Maybe<FormSystemScreen>>>
  sectionType?: Maybe<Scalars['String']>
  waitingText?: Maybe<FormSystemLanguageType>
}

export type FormSystemSectionDisplayOrderInput = {
  id?: InputMaybe<Scalars['String']>
}

export type FormSystemTranslation = {
  __typename?: 'FormSystemTranslation'
  model: Scalars['String']
  sourceLanguageCode: Scalars['String']
  targetLanguageCode: Scalars['String']
  translations: Array<Scalars['JSON']>
}

export type FormSystemTranslationInput = {
  textToTranslate?: InputMaybe<Scalars['String']>
}

export type FormSystemUpdateFieldDtoInput = {
  description?: InputMaybe<FormSystemLanguageTypeInput>
  fieldSettings?: InputMaybe<FormSystemFieldSettingsInput>
  fieldType?: InputMaybe<Scalars['String']>
  isHidden?: InputMaybe<Scalars['Boolean']>
  isPartOfMultiset?: InputMaybe<Scalars['Boolean']>
  isRequired?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<FormSystemLanguageTypeInput>
}

export type FormSystemUpdateFieldInput = {
  id?: InputMaybe<Scalars['String']>
  updateFieldDto?: InputMaybe<FormSystemUpdateFieldDtoInput>
}

export type FormSystemUpdateFieldsDisplayOrderInput = {
  updateFieldsDisplayOrderDto?: InputMaybe<
    Array<InputMaybe<FormSystemFieldDisplayOrderInput>>
  >
}

export type FormSystemUpdateFormDtoInput = {
  applicationDaysToRemove?: InputMaybe<Scalars['Int']>
  completedMessage?: InputMaybe<FormSystemLanguageTypeInput>
  dependencies?: InputMaybe<Array<InputMaybe<FormSystemDependencyInput>>>
  hasPayment?: InputMaybe<Scalars['Boolean']>
  invalidationDate?: InputMaybe<Scalars['DateTime']>
  isTranslated?: InputMaybe<Scalars['Boolean']>
  name?: InputMaybe<FormSystemLanguageTypeInput>
  organizationDisplayName?: InputMaybe<FormSystemLanguageTypeInput>
  organizationId?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
  status?: InputMaybe<Scalars['String']>
  stopProgressOnValidatingScreen?: InputMaybe<Scalars['Boolean']>
  urls?: InputMaybe<Array<FormSystemFormUrlInput>>
}

export type FormSystemUpdateFormError = {
  __typename?: 'FormSystemUpdateFormError'
  field?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
}

export type FormSystemUpdateFormInput = {
  id?: InputMaybe<Scalars['String']>
  updateFormDto?: InputMaybe<FormSystemUpdateFormDtoInput>
}

export type FormSystemUpdateFormResponse = {
  __typename?: 'FormSystemUpdateFormResponse'
  errors?: Maybe<Array<Maybe<FormSystemUpdateFormError>>>
  updateSuccess?: Maybe<Scalars['Boolean']>
}

export type FormSystemUpdateListItemDtoInput = {
  description?: InputMaybe<FormSystemLanguageTypeInput>
  isSelected?: InputMaybe<Scalars['Boolean']>
  label?: InputMaybe<FormSystemLanguageTypeInput>
  value?: InputMaybe<Scalars['String']>
}

export type FormSystemUpdateListItemInput = {
  id?: InputMaybe<Scalars['String']>
  updateListItemDto?: InputMaybe<FormSystemUpdateListItemDtoInput>
}

export type FormSystemUpdateListItemsDisplayOrderDtoInput = {
  listItemsDisplayOrderDto?: InputMaybe<
    Array<InputMaybe<FormSystemListItemDisplayOrderInput>>
  >
}

export type FormSystemUpdateListItemsDisplayOrderInput = {
  updateListItemsDisplayOrderDto?: InputMaybe<FormSystemUpdateListItemsDisplayOrderDtoInput>
}

export type FormSystemUpdateOrganizationPermissionInput = {
  updateOrganizationPermissionDto?: InputMaybe<FormSystemOrganizationPermissionDtoInput>
}

export type FormSystemUpdateScreenDisplayOrderDtoInput = {
  screensDisplayOrderDto?: InputMaybe<
    Array<InputMaybe<FormSystemScreenDisplayOrderInput>>
  >
}

export type FormSystemUpdateScreenDtoInput = {
  callRuleset?: InputMaybe<Scalars['Boolean']>
  multiset?: InputMaybe<Scalars['Int']>
  name?: InputMaybe<FormSystemLanguageTypeInput>
}

export type FormSystemUpdateScreenInput = {
  id?: InputMaybe<Scalars['String']>
  updateScreenDto?: InputMaybe<FormSystemUpdateScreenDtoInput>
}

export type FormSystemUpdateScreensDisplayOrderInput = {
  updateScreensDisplayOrderDto?: InputMaybe<FormSystemUpdateScreenDisplayOrderDtoInput>
}

export type FormSystemUpdateSectionDtoInput = {
  name?: InputMaybe<FormSystemLanguageTypeInput>
  waitingText?: InputMaybe<FormSystemLanguageTypeInput>
}

export type FormSystemUpdateSectionInput = {
  id?: InputMaybe<Scalars['String']>
  updateSectionDto?: InputMaybe<FormSystemUpdateSectionDtoInput>
}

export type FormSystemUpdateSectionsDisplayOrderDtoInput = {
  sectionsDisplayOrderDto?: InputMaybe<
    Array<InputMaybe<FormSystemSectionDisplayOrderInput>>
  >
}

export type FormSystemUpdateSectionsDisplayOrderInput = {
  updateSectionsDisplayOrderDto?: InputMaybe<FormSystemUpdateSectionsDisplayOrderDtoInput>
}

export type FormSystemValue = {
  __typename?: 'FormSystemValue'
  address?: Maybe<Scalars['String']>
  altName?: Maybe<Scalars['String']>
  bankAccount?: Maybe<Scalars['String']>
  checkboxValue?: Maybe<Scalars['Boolean']>
  date?: Maybe<Scalars['DateTime']>
  email?: Maybe<Scalars['String']>
  homestayNumber?: Maybe<Scalars['String']>
  isNullReport?: Maybe<Scalars['Boolean']>
  iskNumber?: Maybe<Scalars['String']>
  jobTitle?: Maybe<Scalars['String']>
  listValue?: Maybe<Scalars['String']>
  months?: Maybe<Array<Maybe<FormSystemMonth>>>
  municipality?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['Int']>
  phoneNumber?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  propertyNumber?: Maybe<Scalars['String']>
  s3Key?: Maybe<Scalars['String']>
  text?: Maybe<Scalars['String']>
  time?: Maybe<Scalars['String']>
  totalAmount?: Maybe<Scalars['Int']>
  totalDays?: Maybe<Scalars['Int']>
  year?: Maybe<Scalars['Int']>
}

export type FormSystemValueDto = {
  __typename?: 'FormSystemValueDto'
  events?: Maybe<Array<Maybe<FormSystemApplicationEventDto>>>
  id?: Maybe<Scalars['String']>
  json?: Maybe<FormSystemValue>
  order?: Maybe<Scalars['Int']>
}

export type Frontpage = {
  __typename?: 'Frontpage'
  featured: Array<Featured>
  heading?: Maybe<Scalars['String']>
  id: Scalars['ID']
  image?: Maybe<Image>
  imageAlternativeText?: Maybe<Scalars['String']>
  imageMobile?: Maybe<Image>
  lifeEvents: Array<LifeEventPage>
  linkList?: Maybe<LinkList>
  namespace?: Maybe<Namespace>
  slides: Array<FrontpageSlider>
  title?: Maybe<Scalars['String']>
  videos?: Maybe<Array<Image>>
  videosMobile?: Maybe<Array<Image>>
}

export type FrontpageSlider = {
  __typename?: 'FrontpageSlider'
  animationJsonAsset?: Maybe<Asset>
  content: Scalars['String']
  intro?: Maybe<Html>
  link?: Maybe<Scalars['String']>
  subtitle: Scalars['String']
  title: Scalars['String']
}

export type GeneratePkPassInput = {
  licenseType: Scalars['String']
}

export type GenericFormInput = {
  email: Scalars['String']
  files?: InputMaybe<Array<Scalars['String']>>
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
  message: Scalars['String']
  name: Scalars['String']
  recipientFormFieldDeciderValue?: InputMaybe<Scalars['String']>
}

export type GenericLicense = {
  __typename?: 'GenericLicense'
  /** Does the license support pkpass? */
  pkpass: Scalars['Boolean']
  /** Status of pkpass availablity of license */
  pkpassStatus: GenericUserLicensePkPassStatus
  /** Does the license support verification of pkpass? */
  pkpassVerify: Scalars['Boolean']
  /** Provider of the license */
  provider: GenericLicenseProvider
  /** Status of license */
  status: GenericUserLicenseStatus
  /**
   * How long the data about the license should be treated as fresh
   * @deprecated Unclear if this is used, will revert if necessary
   */
  timeout?: Maybe<Scalars['Int']>
  /** Type of license from an exhaustive list */
  type: GenericLicenseType
}

export type GenericLicenseCollection = {
  __typename?: 'GenericLicenseCollection'
  errors?: Maybe<Array<GenericLicenseError>>
  licenses?: Maybe<Array<GenericUserLicense>>
}

export type GenericLicenseDataField = {
  __typename?: 'GenericLicenseDataField'
  /**
   * Display value of data field category
   * @deprecated Only used for cosmetic purposes, can be done better
   */
  description?: Maybe<Scalars['String']>
  /** Name of data field */
  fields?: Maybe<Array<GenericLicenseDataField>>
  /** Hide from service portal */
  hideFromServicePortal?: Maybe<Scalars['Boolean']>
  /** Label of data field */
  label?: Maybe<Scalars['String']>
  /** External meta link */
  link?: Maybe<GenericUserLicenseMetaLinks>
  /** Name of data field */
  name?: Maybe<Scalars['String']>
  tag?: Maybe<GenericUserLicenseMetaTag>
  /** Type of data field */
  type: GenericLicenseDataFieldType
  /** Value of data field */
  value?: Maybe<Scalars['String']>
}

/** Possible types of data fields */
export enum GenericLicenseDataFieldType {
  Category = 'Category',
  Group = 'Group',
  Table = 'Table',
  Value = 'Value',
}

export type GenericLicenseError = {
  __typename?: 'GenericLicenseError'
  code?: Maybe<Scalars['Int']>
  extraData?: Maybe<Scalars['String']>
  /** Info about license fetch */
  fetch: GenericLicenseFetch
  message?: Maybe<Scalars['String']>
  provider?: Maybe<GenericLicenseProvider>
  type: GenericLicenseType
}

export type GenericLicenseFetch = {
  __typename?: 'GenericLicenseFetch'
  /** Status of license fetch */
  status: GenericUserLicenseFetchStatus
  /** Datetime of last update of fetch status */
  updated: Scalars['String']
}

export type GenericLicenseProvider = {
  __typename?: 'GenericLicenseProvider'
  /** Contentful entry id */
  entryId?: Maybe<Scalars['String']>
  /** ID of license provider */
  id: GenericLicenseProviderId
  providerLogo?: Maybe<Scalars['String']>
  providerName?: Maybe<Scalars['String']>
  /** Contentful reference id */
  referenceId?: Maybe<Scalars['String']>
}

/** Exhaustive list of license provider IDs */
export enum GenericLicenseProviderId {
  AdministrationOfOccupationalSafetyAndHealth = 'AdministrationOfOccupationalSafetyAndHealth',
  DistrictCommissioners = 'DistrictCommissioners',
  EnvironmentAgency = 'EnvironmentAgency',
  IcelandicHealthInsurance = 'IcelandicHealthInsurance',
  NationalPoliceCommissioner = 'NationalPoliceCommissioner',
  NatureConservationAgency = 'NatureConservationAgency',
  RegistersIceland = 'RegistersIceland',
  SocialInsuranceAdministration = 'SocialInsuranceAdministration',
}

/** Exhaustive list of license types */
export enum GenericLicenseType {
  AdrLicense = 'AdrLicense',
  DisabilityLicense = 'DisabilityLicense',
  DriversLicense = 'DriversLicense',
  Ehic = 'Ehic',
  FirearmLicense = 'FirearmLicense',
  HuntingLicense = 'HuntingLicense',
  IdentityDocument = 'IdentityDocument',
  MachineLicense = 'MachineLicense',
  PCard = 'PCard',
  Passport = 'Passport',
}

export type GenericList = {
  __typename?: 'GenericList'
  defaultOrder?: Maybe<GetGenericListItemsInputOrderBy>
  filterTags?: Maybe<Array<GenericTag>>
  id: Scalars['ID']
  itemType?: Maybe<GenericListItemType>
  searchInputPlaceholder?: Maybe<Scalars['String']>
  showSearchInput?: Maybe<Scalars['Boolean']>
}

export type GenericListItem = {
  __typename?: 'GenericListItem'
  assetUrl?: Maybe<Scalars['String']>
  cardIntro: Array<Slice>
  content?: Maybe<Array<Slice>>
  date?: Maybe<Scalars['String']>
  externalUrl?: Maybe<Scalars['String']>
  filterTags?: Maybe<Array<GenericTag>>
  fullWidthImageInContent?: Maybe<Scalars['Boolean']>
  genericList?: Maybe<GenericList>
  id: Scalars['ID']
  image?: Maybe<Image>
  slug?: Maybe<Scalars['String']>
  title: Scalars['String']
}

export type GenericListItemResponse = {
  __typename?: 'GenericListItemResponse'
  input: GenericListItemResponseInput
  items: Array<GenericListItem>
  total: Scalars['Int']
}

export type GenericListItemResponseInput = {
  __typename?: 'GenericListItemResponseInput'
  genericListId: Scalars['String']
  lang: Scalars['String']
  orderBy?: Maybe<GetGenericListItemsInputOrderBy>
  page?: Maybe<Scalars['Int']>
  queryString?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
  tagGroups?: Maybe<Scalars['JSON']>
  tags?: Maybe<Array<Scalars['String']>>
}

export enum GenericListItemType {
  Clickable = 'Clickable',
  NonClickable = 'NonClickable',
}

export type GenericOverviewPage = {
  __typename?: 'GenericOverviewPage'
  id: Scalars['ID']
  intro?: Maybe<Html>
  navigation: Menu
  overviewLinks: Array<IntroLinkImage>
  pageIdentifier: Scalars['String']
  title: Scalars['String']
}

export type GenericPage = {
  __typename?: 'GenericPage'
  intro?: Maybe<Scalars['String']>
  mainContent?: Maybe<Scalars['String']>
  misc?: Maybe<Scalars['String']>
  sidebar?: Maybe<Scalars['String']>
  slug: Scalars['String']
  title: Scalars['String']
}

export type GenericPkPass = {
  __typename?: 'GenericPkPass'
  pkpassUrl: Scalars['String']
}

export type GenericPkPassQrCode = {
  __typename?: 'GenericPkPassQrCode'
  pkpassQRCode: Scalars['String']
}

export type GenericPkPassVerification = {
  __typename?: 'GenericPkPassVerification'
  /** Optional data related to the pkpass verification */
  data?: Maybe<Scalars['String']>
  /** Optional error related to the pkpass verification */
  error?: Maybe<GenericPkPassVerificationError>
  /** Is the pkpass valid? */
  valid: Scalars['Boolean']
}

export type GenericPkPassVerificationError = {
  __typename?: 'GenericPkPassVerificationError'
  /** Optional data related to the error */
  data?: Maybe<Scalars['String']>
  /** pkpass verification error message, depandant on origination service */
  message?: Maybe<Scalars['String']>
  /** pkpass verification error code, depandant on origination service, "0" for unknown error */
  status?: Maybe<Scalars['String']>
}

export type GenericTag = {
  __typename?: 'GenericTag'
  genericTagGroup?: Maybe<GenericTagGroup>
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type GenericTagGroup = {
  __typename?: 'GenericTagGroup'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type GenericUserLicense = {
  __typename?: 'GenericUserLicense'
  barcode?: Maybe<CreateBarcodeResult>
  /** Info about license fetch */
  fetch: GenericLicenseFetch
  /** Is license owner child of user */
  isOwnerChildOfUser?: Maybe<Scalars['Boolean']>
  /** License info */
  license: GenericLicense
  /** National ID of license owner */
  nationalId: Scalars['String']
  /** Potential payload of license, both parsed and raw */
  payload?: Maybe<Payload>
}

export type GenericUserLicenseAlert = {
  __typename?: 'GenericUserLicenseAlert'
  message?: Maybe<Scalars['String']>
  title: Scalars['String']
  type: GenericUserLicenseAlertType
}

export enum GenericUserLicenseAlertType {
  Error = 'ERROR',
  Info = 'INFO',
  Warning = 'WARNING',
}

/** Exhaustive list of possible tag icon color */
export enum GenericUserLicenseDataFieldTagColor {
  Green = 'green',
  Red = 'red',
  Yellow = 'yellow',
}

/** Exhaustive list of possible tag icons */
export enum GenericUserLicenseDataFieldTagType {
  CheckmarkCircle = 'checkmarkCircle',
  CloseCircle = 'closeCircle',
}

export enum GenericUserLicenseExpiryStatus {
  Active = 'ACTIVE',
  Expired = 'EXPIRED',
  Expiring = 'EXPIRING',
  Unknown = 'UNKNOWN',
}

/** Possible license fetch statuses */
export enum GenericUserLicenseFetchStatus {
  Error = 'Error',
  Fetched = 'Fetched',
  Fetching = 'Fetching',
  NotFetched = 'NotFetched',
  Stale = 'Stale',
}

export type GenericUserLicenseMetaLinks = {
  __typename?: 'GenericUserLicenseMetaLinks'
  label?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  type?: Maybe<GenericUserLicenseMetaLinksType>
  value?: Maybe<Scalars['String']>
}

/** Exhaustive list meta link type */
export enum GenericUserLicenseMetaLinksType {
  Copy = 'Copy',
  Download = 'Download',
  External = 'External',
}

export type GenericUserLicenseMetaTag = {
  __typename?: 'GenericUserLicenseMetaTag'
  color?: Maybe<Scalars['String']>
  icon?: Maybe<GenericUserLicenseDataFieldTagType>
  iconColor?: Maybe<GenericUserLicenseDataFieldTagColor>
  /** Defaults to the text property if icon defined but iconText left undefined */
  iconText?: Maybe<Scalars['String']>
  text: Scalars['String']
}

export type GenericUserLicenseMetadata = {
  __typename?: 'GenericUserLicenseMetadata'
  /** Display an alert on the detail view */
  alert?: Maybe<GenericUserLicenseAlert>
  /** CTA link, only use if necessary */
  ctaLink?: Maybe<GenericUserLicenseMetaLinks>
  /** Display description for detail view */
  description?: Maybe<Array<GenericUserLicenseMetadataDescription>>
  displayTag?: Maybe<GenericUserLicenseMetaTag>
  expireDate?: Maybe<Scalars['String']>
  expired?: Maybe<Scalars['Boolean']>
  expiryStatus?: Maybe<GenericUserLicenseExpiryStatus>
  /** Unique license identifier */
  licenseId?: Maybe<Scalars['String']>
  licenseNumber?: Maybe<Scalars['String']>
  links?: Maybe<Array<GenericUserLicenseMetaLinks>>
  /** Display name of license for the overview */
  name?: Maybe<Scalars['String']>
  /** Photo of the license holder as a base64 encoded data URI containing a PNG or a JPEG photo (eg `data:image/png;base64,{data}`). */
  photo?: Maybe<Scalars['String']>
  /** Display subtitle for detail view */
  subtitle?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type GenericUserLicenseMetadataDescription = {
  __typename?: 'GenericUserLicenseMetadataDescription'
  linkIconType?: Maybe<GenericUserLicenseMetaLinksType>
  /** If defined, changes text to link */
  linkInText?: Maybe<Scalars['String']>
  text: Scalars['String']
}

/** Possible license pkpass statuses */
export enum GenericUserLicensePkPassStatus {
  Available = 'Available',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

/** Possible license statuses for user */
export enum GenericUserLicenseStatus {
  HasLicense = 'HasLicense',
  NotAvailable = 'NotAvailable',
  Unknown = 'Unknown',
}

export type GetAlertBannerInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetAnchorPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetAnchorPagesInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetAnnualStatusDocumentInput = {
  year: Scalars['String']
}

export type GetApiCatalogueInput = {
  access?: InputMaybe<Array<Scalars['String']>>
  cursor?: InputMaybe<Scalars['String']>
  data?: InputMaybe<Array<Scalars['String']>>
  limit?: InputMaybe<Scalars['Int']>
  pricing?: InputMaybe<Array<Scalars['String']>>
  query?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Array<Scalars['String']>>
}

export type GetApiServiceInput = {
  id: Scalars['ID']
}

export type GetArticleCategoriesInput = {
  lang?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
}

export type GetArticlesInput = {
  category?: InputMaybe<Scalars['String']>
  group?: InputMaybe<Scalars['String']>
  lang?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortField>
  subgroup?: InputMaybe<Scalars['String']>
}

export type GetAuctionInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetAuctionsInput = {
  lang?: InputMaybe<Scalars['String']>
  month?: InputMaybe<Scalars['Float']>
  organization?: InputMaybe<Scalars['String']>
  year?: InputMaybe<Scalars['Float']>
}

export type GetBloodDonationRestrictionDetailsInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetBloodDonationRestrictionGenericTagsInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetBloodDonationRestrictionsInput = {
  lang?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  queryString?: InputMaybe<Scalars['String']>
  tagKeys?: InputMaybe<Array<Scalars['String']>>
}

export type GetBloodDonationRestrictionsInputModel = {
  __typename?: 'GetBloodDonationRestrictionsInputModel'
  lang: Scalars['String']
  page?: Maybe<Scalars['Int']>
  queryString?: Maybe<Scalars['String']>
  tagKeys?: Maybe<Array<Scalars['String']>>
}

export type GetCategoryPagesInput = {
  category?: InputMaybe<Scalars['String']>
  group?: InputMaybe<Scalars['String']>
  lang?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortField>
  subgroup?: InputMaybe<Scalars['String']>
}

export type GetChargeItemSubjectsByYearInput = {
  nextKey: Scalars['String']
  typeId: Scalars['String']
  year: Scalars['String']
}

export type GetChargeTypePeriodSubjectInput = {
  period: Scalars['String']
  subject: Scalars['String']
  typeId: Scalars['String']
  year: Scalars['String']
}

export type GetChargeTypesByYearInput = {
  year: Scalars['String']
}

export type GetChargeTypesDetailsByYearInput = {
  typeId: Scalars['String']
  year: Scalars['String']
}

export type GetContentSlugInput = {
  id: Scalars['String']
}

export type GetCustomPageInput = {
  lang?: InputMaybe<Scalars['String']>
  uniqueIdentifier: CustomPageUniqueIdentifier
}

export type GetCustomSubpageInput = {
  lang?: InputMaybe<Scalars['String']>
  parentPageId: Scalars['String']
  slug: Scalars['String']
}

export type GetCustomerRecordsInput = {
  chargeTypeID?: InputMaybe<Array<Scalars['String']>>
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
}

export type GetDocumentInput = {
  id: Scalars['String']
}

export type GetDocumentListInput = {
  archived?: InputMaybe<Scalars['Boolean']>
  bookmarked?: InputMaybe<Scalars['Boolean']>
  categoryId?: InputMaybe<Scalars['String']>
  dateFrom?: InputMaybe<Scalars['String']>
  dateTo?: InputMaybe<Scalars['String']>
  isLegalGuardian?: InputMaybe<Scalars['Boolean']>
  opened?: InputMaybe<Scalars['Boolean']>
  order?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Float']>
  pageSize?: InputMaybe<Scalars['Float']>
  senderKennitala?: InputMaybe<Scalars['String']>
  sortBy?: InputMaybe<Scalars['String']>
  subjectContains?: InputMaybe<Scalars['String']>
  typeId?: InputMaybe<Scalars['String']>
}

export type GetDocumentPageInput = {
  messageId: Scalars['String']
  pageSize: Scalars['Float']
}

export type GetDraftRegulationInput = {
  draftId: Scalars['String']
}

/** Get a download URL for a draft regulation */
export type GetDraftRegulationPdfDownloadInput = {
  /** Id of the draft regulation */
  draftId: Scalars['String']
}

export type GetDraftRegulationsInput = {
  page: Scalars['Float']
}

export type GetElectronicIdInput = {
  nationalId: Scalars['String']
  phoneNumber: Scalars['String']
}

export type GetErrorPageInput = {
  errorCode: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetEventsInput = {
  lang?: InputMaybe<Scalars['String']>
  onlyIncludePastEvents?: InputMaybe<Scalars['Boolean']>
  order?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  size?: InputMaybe<Scalars['Int']>
}

export type GetFeaturedSupportQnAsInput = {
  category?: InputMaybe<Scalars['String']>
  lang?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  subCategory?: InputMaybe<Scalars['String']>
}

export type GetFinanceDocumentInput = {
  documentID: Scalars['String']
}

export type GetFinanceDocumentsListInput = {
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
  listPath: Scalars['String']
}

export type GetFinancePaymentScheduleInput = {
  scheduleNumber: Scalars['String']
}

export type GetFinancialOverviewInput = {
  chargeTypeID: Scalars['String']
  orgID: Scalars['String']
}

export type GetFrontpageInput = {
  lang?: InputMaybe<Scalars['String']>
  pageIdentifier: Scalars['String']
}

export type GetGenericLicenseInput = {
  licenseId?: InputMaybe<Scalars['String']>
  licenseType: Scalars['String']
}

export type GetGenericLicensesInput = {
  excludedTypes?: InputMaybe<Array<Scalars['String']>>
  force?: InputMaybe<Scalars['Boolean']>
  includedTypes?: InputMaybe<Array<Scalars['String']>>
  onlyList?: InputMaybe<Scalars['Boolean']>
}

export type GetGenericListItemBySlugInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetGenericListItemsInput = {
  genericListId: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
  orderBy?: InputMaybe<GetGenericListItemsInputOrderBy>
  page?: InputMaybe<Scalars['Int']>
  queryString?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  tagGroups?: InputMaybe<Scalars['JSON']>
  tags?: InputMaybe<Array<Scalars['String']>>
}

export enum GetGenericListItemsInputOrderBy {
  Date = 'DATE',
  PublishDate = 'PUBLISH_DATE',
  Title = 'TITLE',
}

export type GetGenericOverviewPageInput = {
  lang?: InputMaybe<Scalars['String']>
  pageIdentifier: Scalars['String']
}

export type GetGenericPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetGenericTagBySlugInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetGenericTagsInTagGroupsInput = {
  lang?: InputMaybe<Scalars['String']>
  tagGroupSlugs?: InputMaybe<Array<Scalars['String']>>
}

export type GetGrantsInput = {
  categories?: InputMaybe<Array<Scalars['String']>>
  funds?: InputMaybe<Array<Scalars['String']>>
  lang?: InputMaybe<Scalars['String']>
  organizations?: InputMaybe<Array<Scalars['String']>>
  page?: InputMaybe<Scalars['Int']>
  search?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<GetGrantsInputSortByEnum>
  status?: InputMaybe<GetGrantsInputAvailabilityStatusEnum>
  types?: InputMaybe<Array<Scalars['String']>>
}

export enum GetGrantsInputAvailabilityStatusEnum {
  Closed = 'CLOSED',
  Open = 'OPEN',
}

export enum GetGrantsInputSortByEnum {
  Alphabetical = 'ALPHABETICAL',
  RecentlyUpdated = 'RECENTLY_UPDATED',
}

export type GetHmsLoansPaymentHistoryInput = {
  loanId: Scalars['Float']
}

export type GetHomestaysInput = {
  year?: InputMaybe<Scalars['Float']>
}

export type GetIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type GetIcelandicNameByInitialLetterInput = {
  initialLetter: Scalars['String']
}

export type GetIcelandicNameBySearchInput = {
  q: Scalars['String']
}

export type GetInitialScheduleInput = {
  disposableIncome: Scalars['Float']
  totalAmount: Scalars['Float']
  type: PaymentScheduleType
}

export type GetIsEmployerValidInput = {
  companyId: Scalars['String']
}

export type GetLifeEventPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetLifeEventsInCategoryInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetLifeEventsInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetMenuInput = {
  lang?: InputMaybe<Scalars['String']>
  name: Scalars['String']
}

export type GetMultiPropertyInput = {
  cursor?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
}

export type GetNamespaceInput = {
  lang?: InputMaybe<Scalars['String']>
  namespace?: InputMaybe<Scalars['String']>
}

export type GetNewsDatesInput = {
  lang?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  tags?: InputMaybe<Array<Scalars['String']>>
}

export type GetNewsInput = {
  lang?: InputMaybe<Scalars['String']>
  month?: InputMaybe<Scalars['Int']>
  order?: InputMaybe<Scalars['String']>
  organization?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  size?: InputMaybe<Scalars['Int']>
  tags?: InputMaybe<Array<Scalars['String']>>
  year?: InputMaybe<Scalars['Int']>
}

export type GetOpenApiInput = {
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  serviceCode: Scalars['String']
  subsystemCode: Scalars['String']
}

export type GetOpenDataPageInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetOpenDataSubpageInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetOperatingLicensesInput = {
  pageNumber?: InputMaybe<Scalars['Float']>
  pageSize?: InputMaybe<Scalars['Float']>
  searchBy?: InputMaybe<Scalars['String']>
}

export type GetOrganizationByNationalIdInput = {
  lang?: InputMaybe<Scalars['String']>
  nationalId: Scalars['String']
}

export type GetOrganizationByTitleInput = {
  lang?: InputMaybe<Scalars['String']>
  title: Scalars['String']
}

export type GetOrganizationInput = {
  lang?: InputMaybe<Scalars['String']>
  slug?: InputMaybe<Scalars['String']>
}

export type GetOrganizationPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetOrganizationPageStandaloneSitemapLevel1Input = {
  categorySlug: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
  organizationPageSlug: Scalars['String']
}

export type GetOrganizationPageStandaloneSitemapLevel2Input = {
  categorySlug: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
  organizationPageSlug: Scalars['String']
  subcategorySlug: Scalars['String']
}

export type GetOrganizationParentSubpageInput = {
  lang?: InputMaybe<Scalars['String']>
  organizationPageSlug: Scalars['String']
  slug: Scalars['String']
}

export type GetOrganizationSubpageByIdInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetOrganizationSubpageInput = {
  lang?: InputMaybe<Scalars['String']>
  organizationSlug: Scalars['String']
  slug: Scalars['String']
}

export type GetOrganizationTagsInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetOrganizationsInput = {
  lang?: InputMaybe<Scalars['String']>
  organizationTitles?: InputMaybe<Array<Scalars['String']>>
  perPage?: InputMaybe<Scalars['Int']>
  referenceIdentifiers?: InputMaybe<Array<Scalars['String']>>
}

export type GetPagingTypes = {
  assetId: Scalars['String']
  cursor?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
}

export type GetParentalLeavesApplicationPaymentPlanInput = {
  applicationId: Scalars['String']
  dateOfBirth: Scalars['String']
}

export type GetParentalLeavesEntitlementsInput = {
  dateOfBirth: Scalars['String']
}

export type GetParentalLeavesEstimatedPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  period: Array<Period>
}

export type GetParentalLeavesPeriodEndDateInput = {
  length: Scalars['String']
  percentage: Scalars['String']
  startDate: Scalars['String']
}

export type GetParentalLeavesPeriodLengthInput = {
  endDate: Scalars['String']
  percentage: Scalars['String']
  startDate: Scalars['String']
}

export type GetPaymentFlowInput = {
  id: Scalars['String']
}

export type GetPowerBiEmbedPropsFromServerResponse = {
  __typename?: 'GetPowerBiEmbedPropsFromServerResponse'
  accessToken?: Maybe<Scalars['String']>
  embedUrl?: Maybe<Scalars['String']>
}

export type GetProjectPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetPublicVehicleSearchInput = {
  search: Scalars['String']
}

export type GetPublishedMaterialInput = {
  lang?: InputMaybe<Scalars['String']>
  organizationSlug?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  searchString?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  sort: Scalars['JSON']
  tagGroups: Scalars['JSON']
  tags: Array<Scalars['String']>
}

export type GetRealEstateInput = {
  assetId: Scalars['String']
}

export type GetRegistryPersonInput = {
  nationalId?: InputMaybe<Scalars['String']>
}

export type GetRegulationFromApiInput = {
  date?: InputMaybe<Scalars['String']>
  regulation: Scalars['String']
}

export type GetRegulationImpactsInput = {
  regulation: Scalars['String']
}

export type GetRegulationInput = {
  date?: InputMaybe<Scalars['String']>
  earlierDate?: InputMaybe<Scalars['String']>
  isCustomDiff?: InputMaybe<Scalars['Boolean']>
  name: Scalars['String']
  viewType: RegulationViewTypes
}

export type GetRegulationOptionListInput = {
  names?: InputMaybe<Array<Scalars['String']>>
}

export type GetRegulationsInput = {
  page?: InputMaybe<Scalars['Float']>
  type: Scalars['String']
}

export type GetRegulationsLawChaptersInput = {
  slugs?: InputMaybe<Array<Scalars['String']>>
  tree?: InputMaybe<Scalars['Boolean']>
}

export type GetRegulationsMinistriesInput = {
  slugs?: InputMaybe<Array<Scalars['String']>>
}

export type GetRegulationsSearchInput = {
  ch?: InputMaybe<Scalars['String']>
  iA?: InputMaybe<Scalars['Boolean']>
  iR?: InputMaybe<Scalars['Boolean']>
  page?: InputMaybe<Scalars['Int']>
  q?: InputMaybe<Scalars['String']>
  rn?: InputMaybe<Scalars['String']>
  year?: InputMaybe<Scalars['Int']>
  yearTo?: InputMaybe<Scalars['Int']>
}

export type GetScheduleDistributionInput = {
  monthAmount?: InputMaybe<Scalars['Float']>
  monthCount?: InputMaybe<Scalars['Float']>
  scheduleType: PaymentScheduleType
  totalAmount: Scalars['Float']
}

export type GetServicePortalAlertBannersInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetServiceWebPageInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSingleArticleInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSingleEntryTitleByIdInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetSingleEventInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSingleGrantInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetSingleManualInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSingleMenuInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetSingleNewsInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSingleSupportQnaInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSubpageHeaderInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetSupportCategoriesInOrganizationInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportCategoriesInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetSupportCategoryInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportQnAsInCategoryInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportQnAsInput = {
  lang?: InputMaybe<Scalars['String']>
}

export type GetTabSectionInput = {
  id: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
}

export type GetTeamMembersInput = {
  lang?: InputMaybe<Scalars['String']>
  orderBy?: InputMaybe<GetTeamMembersInputOrderBy>
  page?: InputMaybe<Scalars['Int']>
  queryString?: InputMaybe<Scalars['String']>
  size?: InputMaybe<Scalars['Int']>
  tagGroups?: InputMaybe<Scalars['JSON']>
  tags?: InputMaybe<Array<Scalars['String']>>
  teamListId: Scalars['String']
}

export enum GetTeamMembersInputOrderBy {
  Manual = 'Manual',
  Name = 'Name',
}

export type GetTranslationsInput = {
  lang: Scalars['String']
  namespaces: Array<Scalars['String']>
}

export type GetUrlInput = {
  lang?: InputMaybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetUserInvolvedPartiesInput = {
  applicationId: Scalars['ID']
}

export type GetVehicleDetailInput = {
  permno: Scalars['String']
  regno?: InputMaybe<Scalars['String']>
  vin?: InputMaybe<Scalars['String']>
}

export type GetVehicleInput = {
  vehicleId: Scalars['String']
}

export type GetVehicleMileageInput = {
  permno: Scalars['String']
}

export type GetVehicleSearchInput = {
  search: Scalars['String']
}

export type GetVehiclesForUserInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
  page: Scalars['Float']
  pageSize: Scalars['Float']
  permno?: InputMaybe<Scalars['String']>
  showDeregeristered: Scalars['Boolean']
  showHistory: Scalars['Boolean']
  type?: InputMaybe<VehicleUserTypeEnum>
}

export type GetVehiclesListV2Input = {
  /** Filter to only show vehicles requiring mileage registration */
  onlyMileage?: InputMaybe<Scalars['Boolean']>
  page: Scalars['Float']
  pageSize: Scalars['Float']
  permno?: InputMaybe<Scalars['String']>
  showCoowned?: InputMaybe<Scalars['Boolean']>
  showOperated?: InputMaybe<Scalars['Boolean']>
  showOwned?: InputMaybe<Scalars['Boolean']>
}

export type Grade = {
  __typename?: 'Grade'
  grade?: Maybe<Scalars['String']>
  label: Scalars['String']
  weight?: Maybe<Scalars['Float']>
}

export type GradeType = {
  __typename?: 'GradeType'
  elementaryGrade?: Maybe<Grade>
  label: Scalars['String']
  serialGrade?: Maybe<Grade>
}

export type Grant = {
  __typename?: 'Grant'
  answeringQuestions: Array<Slice>
  applicationButtonLabel?: Maybe<Scalars['String']>
  applicationHints: Array<Slice>
  applicationId?: Maybe<Scalars['String']>
  applicationUrl?: Maybe<ReferenceLink>
  categoryTags?: Maybe<Array<GenericTag>>
  dateFrom?: Maybe<Scalars['String']>
  dateTo?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  files?: Maybe<Array<Asset>>
  fund?: Maybe<OrganizationFund>
  howToApply: Array<Slice>
  id: Scalars['ID']
  lastUpdateTimestamp: Scalars['String']
  name: Scalars['String']
  specialEmphasis: Array<Slice>
  status?: Maybe<GrantStatus>
  statusText?: Maybe<Scalars['String']>
  supportLinks?: Maybe<Array<Link>>
  typeTag?: Maybe<GenericTag>
  whoCanApply: Array<Slice>
}

export type GrantCardsList = {
  __typename?: 'GrantCardsList'
  displayTitle?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  maxNumberOfCards?: Maybe<Scalars['Int']>
  namespace: Scalars['JSONObject']
  resolvedGrantsList?: Maybe<GrantList>
  sorting?: Maybe<GrantCardsListSorting>
  title: Scalars['String']
}

export enum GrantCardsListSorting {
  Alphabetical = 'ALPHABETICAL',
  MostRecentlyUpdatedFirst = 'MOST_RECENTLY_UPDATED_FIRST',
}

export type GrantList = {
  __typename?: 'GrantList'
  items: Array<Grant>
  total: Scalars['Int']
}

export enum GrantStatus {
  AlwaysOpen = 'ALWAYS_OPEN',
  Closed = 'CLOSED',
  ClosedOpeningSoon = 'CLOSED_OPENING_SOON',
  ClosedOpeningSoonWithEstimation = 'CLOSED_OPENING_SOON_WITH_ESTIMATION',
  ClosedWithNote = 'CLOSED_WITH_NOTE',
  Invalid = 'INVALID',
  Open = 'OPEN',
  OpenWithNote = 'OPEN_WITH_NOTE',
  Unknown = 'UNKNOWN',
}

export type GraphCard = {
  __typename?: 'GraphCard'
  data: Scalars['String']
  datakeys: Scalars['String']
  displayAsCard: Scalars['Boolean']
  graphDescription: Scalars['String']
  graphTitle: Scalars['String']
  id: Scalars['ID']
  organization?: Maybe<Scalars['String']>
  organizationLogo?: Maybe<Image>
  type: Scalars['String']
}

export type GroupedMenu = {
  __typename?: 'GroupedMenu'
  id: Scalars['ID']
  menus: Array<Menu>
  title: Scalars['String']
}

export type HasTeachingRights = {
  __typename?: 'HasTeachingRights'
  hasTeachingRights: Scalars['Boolean']
  nationalId: Scalars['ID']
}

export type HeadingSlice = {
  __typename?: 'HeadingSlice'
  body: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
}

export type HealthDirectorateDispensation = {
  __typename?: 'HealthDirectorateDispensation'
  agentName?: Maybe<Scalars['String']>
  count: Scalars['Float']
  date: Scalars['DateTime']
  id: Scalars['Int']
  items?: Maybe<Array<HealthDirectorateDispensedItem>>
  lastDispensationDate?: Maybe<Scalars['DateTime']>
  nextDispensationDate?: Maybe<Scalars['DateTime']>
}

export type HealthDirectorateDispensedItem = {
  __typename?: 'HealthDirectorateDispensedItem'
  amount?: Maybe<Scalars['String']>
  dosageInstructions?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isExpired?: Maybe<Scalars['Boolean']>
  name?: Maybe<Scalars['String']>
  numberOfPackages?: Maybe<Scalars['String']>
  quantity?: Maybe<Scalars['String']>
  strength?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type HealthDirectorateMedicineDispensationsAtc = {
  __typename?: 'HealthDirectorateMedicineDispensationsATC'
  dispensations: Array<HealthDirectorateMedicineHistoryDispensation>
}

export type HealthDirectorateMedicineHistory = {
  __typename?: 'HealthDirectorateMedicineHistory'
  medicineHistory: Array<HealthDirectorateMedicineHistoryItem>
}

export type HealthDirectorateMedicineHistoryDispensation = {
  __typename?: 'HealthDirectorateMedicineHistoryDispensation'
  agentName?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['DateTime']>
  dosageInstructions?: Maybe<Scalars['String']>
  expirationDate?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['String']>
  indication?: Maybe<Scalars['String']>
  isExpired?: Maybe<Scalars['Boolean']>
  issueDate?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  prescriberName?: Maybe<Scalars['String']>
  quantity?: Maybe<Scalars['String']>
  strength?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  unit?: Maybe<Scalars['String']>
}

export type HealthDirectorateMedicineHistoryItem = {
  __typename?: 'HealthDirectorateMedicineHistoryItem'
  atcCode?: Maybe<Scalars['String']>
  dispensationCount?: Maybe<Scalars['Int']>
  dispensations: Array<HealthDirectorateMedicineHistoryDispensation>
  id?: Maybe<Scalars['String']>
  indication?: Maybe<Scalars['String']>
  lastDispensationDate?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  strength?: Maybe<Scalars['String']>
}

export type HealthDirectorateOrganDonation = {
  __typename?: 'HealthDirectorateOrganDonation'
  donor?: Maybe<HealthDirectorateOrganDonor>
  locale?: Maybe<Scalars['String']>
  organList?: Maybe<Array<HealthDirectorateOrganDonationOrgan>>
}

export type HealthDirectorateOrganDonationLimitations = {
  __typename?: 'HealthDirectorateOrganDonationLimitations'
  /** Text to display if user does not want to donate all organs */
  comment?: Maybe<Scalars['String']>
  hasLimitations: Scalars['Boolean']
  /** List of organs NOT to donate */
  limitedOrgansList?: Maybe<Array<HealthDirectorateOrganDonationOrgan>>
}

export type HealthDirectorateOrganDonationOrgan = {
  __typename?: 'HealthDirectorateOrganDonationOrgan'
  id: Scalars['String']
  name: Scalars['String']
}

export type HealthDirectorateOrganDonor = {
  __typename?: 'HealthDirectorateOrganDonor'
  isDonor: Scalars['Boolean']
  isMinor: Scalars['Boolean']
  isTemporaryResident: Scalars['Boolean']
  limitations?: Maybe<HealthDirectorateOrganDonationLimitations>
}

export type HealthDirectorateOrganDonorInput = {
  comment?: InputMaybe<Scalars['String']>
  isDonor: Scalars['Boolean']
  organLimitations?: InputMaybe<Array<Scalars['String']>>
}

export enum HealthDirectoratePrescribedItemCategory {
  Owner = 'Owner',
  Pn = 'Pn',
  Regimen = 'Regimen',
  Regular = 'Regular',
}

export type HealthDirectoratePrescription = {
  __typename?: 'HealthDirectoratePrescription'
  amountRemaining?: Maybe<Scalars['String']>
  category?: Maybe<HealthDirectoratePrescribedItemCategory>
  dispensations: Array<HealthDirectorateDispensation>
  dosageInstructions?: Maybe<Scalars['String']>
  expiryDate: Scalars['DateTime']
  form?: Maybe<Scalars['String']>
  id: Scalars['String']
  indication?: Maybe<Scalars['String']>
  isRenewable: Scalars['Boolean']
  issueDate: Scalars['DateTime']
  medCardDrugId?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  prescriberName?: Maybe<Scalars['String']>
  quantity?: Maybe<Scalars['String']>
  renewalBlockedReason?: Maybe<HealthDirectoratePrescriptionRenewalBlockedReason>
  renewalStatus?: Maybe<HealthDirectoratePrescriptionRenewalStatus>
  totalPrescribedAmount?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
}

export type HealthDirectoratePrescriptionDocument = {
  __typename?: 'HealthDirectoratePrescriptionDocument'
  id: Scalars['String']
  name: Scalars['String']
  url: Scalars['String']
}

export type HealthDirectoratePrescriptionDocuments = {
  __typename?: 'HealthDirectoratePrescriptionDocuments'
  documents: Array<HealthDirectoratePrescriptionDocument>
  id: Scalars['String']
}

export enum HealthDirectoratePrescriptionRenewalBlockedReason {
  IsRegiment = 'IsRegiment',
  NoMedCard = 'NoMedCard',
  NotFullyDispensed = 'NotFullyDispensed',
  PendingRequest = 'PendingRequest',
  RejectedRequest = 'RejectedRequest',
}

export enum HealthDirectoratePrescriptionRenewalStatus {
  Number_0 = 'NUMBER_0',
  Number_1 = 'NUMBER_1',
  Number_2 = 'NUMBER_2',
}

export type HealthDirectoratePrescriptions = {
  __typename?: 'HealthDirectoratePrescriptions'
  prescriptions: Array<HealthDirectoratePrescription>
}

export type HealthDirectorateReferral = {
  __typename?: 'HealthDirectorateReferral'
  createdDate?: Maybe<Scalars['DateTime']>
  fromContactInfo?: Maybe<HealthDirectorateReferralContact>
  id: Scalars['ID']
  reason?: Maybe<Scalars['String']>
  serviceName?: Maybe<Scalars['String']>
  stateDisplay?: Maybe<Scalars['String']>
  toContactInfo?: Maybe<HealthDirectorateReferralContact>
  validUntilDate?: Maybe<Scalars['DateTime']>
}

export type HealthDirectorateReferralContact = {
  __typename?: 'HealthDirectorateReferralContact'
  department?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  profession?: Maybe<Scalars['String']>
}

export type HealthDirectorateReferralDetail = {
  __typename?: 'HealthDirectorateReferralDetail'
  data?: Maybe<HealthDirectorateReferral>
}

export type HealthDirectorateReferralInput = {
  id: Scalars['String']
}

export type HealthDirectorateReferrals = {
  __typename?: 'HealthDirectorateReferrals'
  referrals: Array<HealthDirectorateReferral>
}

export type HealthDirectorateRenewalInput = {
  id: Scalars['String']
  medCardDrugCategory: Scalars['String']
  medCardDrugId: Scalars['String']
  prescribedItemId: Scalars['String']
}

export type HealthDirectorateVaccination = {
  __typename?: 'HealthDirectorateVaccination'
  comments?: Maybe<Array<Scalars['String']>>
  description?: Maybe<Scalars['String']>
  id: Scalars['String']
  isFeatured?: Maybe<Scalars['Boolean']>
  lastVaccinationDate?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  status?: Maybe<HealthDirectorateVaccinationStatusEnum>
  statusColor?: Maybe<Scalars['String']>
  statusName?: Maybe<Scalars['String']>
  vaccinationsInfo?: Maybe<Array<HealthDirectorateVaccinationsInfo>>
}

export enum HealthDirectorateVaccinationStatusEnum {
  Complete = 'complete',
  Expired = 'expired',
  Incomplete = 'incomplete',
  Rejected = 'rejected',
  Undetermined = 'undetermined',
  Undocumented = 'undocumented',
  Unvaccinated = 'unvaccinated',
  Valid = 'valid',
}

export type HealthDirectorateVaccinations = {
  __typename?: 'HealthDirectorateVaccinations'
  vaccinations: Array<HealthDirectorateVaccination>
}

export type HealthDirectorateVaccinationsAge = {
  __typename?: 'HealthDirectorateVaccinationsAge'
  months?: Maybe<Scalars['Int']>
  years?: Maybe<Scalars['Int']>
}

export type HealthDirectorateVaccinationsInfo = {
  __typename?: 'HealthDirectorateVaccinationsInfo'
  age?: Maybe<HealthDirectorateVaccinationsAge>
  comment?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['DateTime']>
  id: Scalars['Int']
  location?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  rejected?: Maybe<Scalars['Boolean']>
  url?: Maybe<Scalars['String']>
}

export type HealthDirectorateWaitlist = {
  __typename?: 'HealthDirectorateWaitlist'
  id: Scalars['ID']
  lastUpdated?: Maybe<Scalars['DateTime']>
  name: Scalars['String']
  organization: Scalars['String']
  status: Scalars['String']
  waitBegan?: Maybe<Scalars['DateTime']>
}

export type HealthDirectorateWaitlistDetail = {
  __typename?: 'HealthDirectorateWaitlistDetail'
  data?: Maybe<HealthDirectorateWaitlist>
}

export type HealthDirectorateWaitlistInput = {
  id: Scalars['String']
}

export type HealthDirectorateWaitlists = {
  __typename?: 'HealthDirectorateWaitlists'
  waitlists: Array<HealthDirectorateWaitlist>
}

export enum HealthInsuranceAccidentNotificationStatusTypes {
  Accepted = 'ACCEPTED',
  Inprogress = 'INPROGRESS',
  Inprogresswaitingfordocument = 'INPROGRESSWAITINGFORDOCUMENT',
  Refused = 'REFUSED',
}

export type HealthInsuranceAccidentStatusInput = {
  ihiDocumentID: Scalars['Float']
}

export type Helpdesk = {
  __typename?: 'Helpdesk'
  created: Scalars['DateTime']
  email: Scalars['String']
  id: Scalars['String']
  modified: Scalars['DateTime']
  phoneNumber: Scalars['String']
}

export type HmsLoansCoPayer = {
  __typename?: 'HmsLoansCoPayer'
  coPayerName?: Maybe<Scalars['String']>
  coPayerNationalId?: Maybe<Scalars['String']>
}

export type HmsLoansHistory = {
  __typename?: 'HmsLoansHistory'
  accruedInterestPriceImprovements?: Maybe<Scalars['Float']>
  affiliateLoan?: Maybe<Scalars['String']>
  balancePayment?: Maybe<Scalars['String']>
  balanceWithoutInterestPriceImprovements?: Maybe<Scalars['Float']>
  baseIndex?: Maybe<Scalars['Float']>
  coPayerName?: Maybe<Scalars['String']>
  coPayerNationalId?: Maybe<Scalars['String']>
  coPayers?: Maybe<Array<HmsLoansCoPayer>>
  creditor?: Maybe<Scalars['String']>
  epilog?: Maybe<Scalars['String']>
  firstInterestDate?: Maybe<Scalars['DateTime']>
  firstPaymentDate?: Maybe<Scalars['DateTime']>
  homeAddress?: Maybe<Scalars['String']>
  installments?: Maybe<Scalars['Float']>
  interest?: Maybe<Scalars['Float']>
  lastPaymentAmount?: Maybe<Scalars['Float']>
  lastPaymentDate?: Maybe<Scalars['DateTime']>
  lastUnpaidInvoiceDate?: Maybe<Scalars['DateTime']>
  loanAmountWithRepayment?: Maybe<Scalars['Float']>
  loanId?: Maybe<Scalars['Float']>
  loanStatus?: Maybe<Scalars['String']>
  loanType?: Maybe<Scalars['String']>
  municipality?: Maybe<Scalars['String']>
  municipalityNumber?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  nextPaymentDate?: Maybe<Scalars['DateTime']>
  numberOfPaymentDatesRemaining?: Maybe<Scalars['Float']>
  numberOfPaymentPerYear?: Maybe<Scalars['Float']>
  originalLoanAmount?: Maybe<Scalars['Float']>
  paymentDelayment?: Maybe<Scalars['String']>
  paymentFee?: Maybe<Scalars['String']>
  postNumber?: Maybe<Scalars['Float']>
  priceIndexType?: Maybe<Scalars['String']>
  properties?: Maybe<Array<HmsLoansProperty>>
  propertyAddress?: Maybe<Scalars['String']>
  propertyId?: Maybe<Scalars['String']>
  propertyMunicipality?: Maybe<Scalars['String']>
  remainingBalanceWithoutDebt?: Maybe<Scalars['Float']>
  repaymentFee?: Maybe<Scalars['Float']>
  statusSettlementPayment?: Maybe<Scalars['Float']>
  temporaryPaymentDelayment?: Maybe<Scalars['String']>
  totalDueAmount?: Maybe<Scalars['Float']>
  totalNumberOfPayments?: Maybe<Scalars['Float']>
  variableInterest?: Maybe<Scalars['String']>
}

export type HmsLoansHistoryPdf = {
  __typename?: 'HmsLoansHistoryPdf'
  data?: Maybe<Scalars['String']>
  mime?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type HmsLoansPaymentHistory = {
  __typename?: 'HmsLoansPaymentHistory'
  costPayment?: Maybe<Scalars['Float']>
  defaultInterest?: Maybe<Scalars['Float']>
  interest?: Maybe<Scalars['Float']>
  loanId?: Maybe<Scalars['Float']>
  paymentAmount?: Maybe<Scalars['Float']>
  paymentDate?: Maybe<Scalars['DateTime']>
  priceImprovementInterest?: Maybe<Scalars['Float']>
  priceImprovementPayment?: Maybe<Scalars['Float']>
  totalPayment?: Maybe<Scalars['Float']>
  transactionDate?: Maybe<Scalars['DateTime']>
}

export type HmsLoansProperty = {
  __typename?: 'HmsLoansProperty'
  epilog?: Maybe<Scalars['String']>
  municipalityNumber?: Maybe<Scalars['String']>
  propertyAddress?: Maybe<Scalars['String']>
  propertyId?: Maybe<Scalars['String']>
  propertyMunicipality?: Maybe<Scalars['String']>
}

export type HmsPropertyInfo = {
  __typename?: 'HmsPropertyInfo'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  appraisalUnits?: Maybe<Array<AppraisalUnit>>
  landCode?: Maybe<Scalars['Float']>
  municipalityCode?: Maybe<Scalars['Float']>
  municipalityName?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyLandValue?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
  sizeUnit?: Maybe<Scalars['String']>
  unitCode?: Maybe<Scalars['String']>
}

export type HmsPropertyInfoInput = {
  stadfangNr: Scalars['Float']
}

export type HmsPropertyInfos = {
  __typename?: 'HmsPropertyInfos'
  propertyInfos: Array<HmsPropertyInfo>
}

export type HmsSearchAddress = {
  __typename?: 'HmsSearchAddress'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  landCode?: Maybe<Scalars['Float']>
  municipalityCode?: Maybe<Scalars['Float']>
  municipalityName?: Maybe<Scalars['String']>
  numOfConnectedProperties?: Maybe<Scalars['Float']>
  postalCode?: Maybe<Scalars['Float']>
  streetName?: Maybe<Scalars['String']>
  streetNumber?: Maybe<Scalars['Float']>
}

export type HmsSearchInput = {
  partialStadfang: Scalars['String']
}

export type Homestay = {
  __typename?: 'Homestay'
  address?: Maybe<Scalars['String']>
  apartmentId?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  guests?: Maybe<Scalars['Float']>
  manager?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  propertyId?: Maybe<Scalars['String']>
  registrationNumber?: Maybe<Scalars['String']>
  rooms?: Maybe<Scalars['Float']>
  year?: Maybe<Scalars['Float']>
}

export type HousingBenefitCalculationModel = {
  __typename?: 'HousingBenefitCalculationModel'
  estimatedHousingBenefits?: Maybe<Scalars['Float']>
  maximumHousingBenefits?: Maybe<Scalars['Float']>
  reductionsDueToAssets?: Maybe<Scalars['Float']>
  reductionsDueToHousingCosts?: Maybe<Scalars['Float']>
  reductionsDueToIncome?: Maybe<Scalars['Float']>
}

export type HousingBenefitCalculatorCalculationInput = {
  housingCostsPerMonth: Scalars['Float']
  numberOfHouseholdMembers: Scalars['Float']
  totalAssets: Scalars['Float']
  totalMonthlyIncome: Scalars['Float']
}

export type HousingBenefitCalculatorSpecificSupportCalculationInput = {
  housingCostsPerMonth: Scalars['Float']
  numberOfHouseholdMembers: Scalars['Float']
}

export type HousingBenefitsPageInfo = {
  __typename?: 'HousingBenefitsPageInfo'
  hasNextPage?: Maybe<Scalars['Boolean']>
  hasPreviousPage?: Maybe<Scalars['Boolean']>
}

export type HousingBenefitsPayment = {
  __typename?: 'HousingBenefitsPayment'
  address?: Maybe<Scalars['String']>
  bankAccountMerged?: Maybe<Scalars['String']>
  benefit?: Maybe<Scalars['Int']>
  calculationType?: Maybe<CalculationType>
  dateCalculation?: Maybe<Scalars['DateTime']>
  dateTransfer?: Maybe<Scalars['DateTime']>
  month?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  noDays?: Maybe<Scalars['Int']>
  nr?: Maybe<Scalars['Int']>
  paidOfDebt?: Maybe<Scalars['Int']>
  paymentActual?: Maybe<Scalars['Int']>
  paymentBeforeDebt?: Maybe<Scalars['Int']>
  paymentOrigin?: Maybe<Scalars['Int']>
  reductionAssets?: Maybe<Scalars['Int']>
  reductionHousingCost?: Maybe<Scalars['Int']>
  reductionIncome?: Maybe<Scalars['Int']>
  remainDebt?: Maybe<Scalars['Int']>
  totalIncome?: Maybe<Scalars['Int']>
  transactionType?: Maybe<TransactionType>
}

export type HousingBenefitsPayments = {
  __typename?: 'HousingBenefitsPayments'
  data: Array<HousingBenefitsPayment>
  pageInfo: HousingBenefitsPageInfo
  totalCount: Scalars['Float']
}

export type HousingBenefitsPaymentsInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
  month?: InputMaybe<Scalars['String']>
  pageNumber?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  paymentOrigin?: InputMaybe<Scalars['Int']>
  /** False display's all. True display payments only */
  payments?: InputMaybe<Scalars['Boolean']>
}

export type Html = {
  __typename?: 'Html'
  document: Scalars['JSON']
  id: Scalars['ID']
  typename: Scalars['String']
}

export type IcelandicGovernmentInstitutionVacanciesInput = {
  institution?: InputMaybe<Scalars['String']>
  language?: InputMaybe<VacanciesGetLanguageEnum>
}

export type IcelandicGovernmentInstitutionVacanciesResponse = {
  __typename?: 'IcelandicGovernmentInstitutionVacanciesResponse'
  fetchErrorOccurred?: Maybe<Scalars['Boolean']>
  vacancies: Array<IcelandicGovernmentInstitutionVacancyListItem>
}

export type IcelandicGovernmentInstitutionVacancy = {
  __typename?: 'IcelandicGovernmentInstitutionVacancy'
  applicationDeadlineFrom?: Maybe<Scalars['String']>
  applicationDeadlineTo?: Maybe<Scalars['String']>
  applicationHref?: Maybe<Scalars['String']>
  contacts?: Maybe<Array<IcelandicGovernmentInstitutionVacancyContact>>
  description?: Maybe<Scalars['JSON']>
  fieldOfWork?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  institutionName?: Maybe<Scalars['String']>
  institutionReferenceIdentifier?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['JSON']>
  jobPercentage?: Maybe<Scalars['String']>
  locations?: Maybe<Array<IcelandicGovernmentInstitutionVacancyLocation>>
  logoUrl?: Maybe<Scalars['String']>
  plainTextIntro?: Maybe<Scalars['String']>
  qualificationRequirements?: Maybe<Scalars['JSON']>
  salaryTerms?: Maybe<Scalars['JSON']>
  tasksAndResponsibilities?: Maybe<Scalars['JSON']>
  title?: Maybe<Scalars['String']>
}

export type IcelandicGovernmentInstitutionVacancyByIdInput = {
  id: Scalars['String']
  language?: InputMaybe<VacanciesVacancyIdGetLanguageEnum>
}

export type IcelandicGovernmentInstitutionVacancyByIdResponse = {
  __typename?: 'IcelandicGovernmentInstitutionVacancyByIdResponse'
  vacancy?: Maybe<IcelandicGovernmentInstitutionVacancy>
}

export type IcelandicGovernmentInstitutionVacancyContact = {
  __typename?: 'IcelandicGovernmentInstitutionVacancyContact'
  email?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
}

export type IcelandicGovernmentInstitutionVacancyListItem = {
  __typename?: 'IcelandicGovernmentInstitutionVacancyListItem'
  applicationDeadlineFrom?: Maybe<Scalars['String']>
  applicationDeadlineTo?: Maybe<Scalars['String']>
  fieldOfWork?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  institutionName?: Maybe<Scalars['String']>
  institutionReferenceIdentifier?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
  locations?: Maybe<Array<IcelandicGovernmentInstitutionVacancyLocation>>
  logoUrl?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type IcelandicGovernmentInstitutionVacancyLocation = {
  __typename?: 'IcelandicGovernmentInstitutionVacancyLocation'
  postalCode?: Maybe<Scalars['Float']>
  title?: Maybe<Scalars['String']>
}

export type IcelandicName = {
  __typename?: 'IcelandicName'
  created: Scalars['DateTime']
  description?: Maybe<Scalars['String']>
  icelandicName: Scalars['String']
  id: Scalars['Float']
  modified: Scalars['DateTime']
  status?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  url?: Maybe<Scalars['String']>
  verdict?: Maybe<Scalars['String']>
  visible?: Maybe<Scalars['Boolean']>
}

export type IconBullet = {
  __typename?: 'IconBullet'
  body: Scalars['String']
  icon: Image
  id: Scalars['ID']
  linkText?: Maybe<Scalars['String']>
  title: Scalars['String']
  url?: Maybe<Scalars['String']>
}

export type Identity = {
  address?: Maybe<IdentityAddress>
  familyName?: Maybe<Scalars['String']>
  givenName?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  type: IdentityType
}

export type IdentityAddress = {
  __typename?: 'IdentityAddress'
  city?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
}

export type IdentityCompany = Identity & {
  __typename?: 'IdentityCompany'
  address?: Maybe<IdentityAddress>
  familyName?: Maybe<Scalars['String']>
  givenName?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  type: IdentityType
}

export type IdentityData = {
  address: Address
  name: Scalars['String']
  nationalId: Scalars['String']
}

export type IdentityDocumentModel = {
  __typename?: 'IdentityDocumentModel'
  displayFirstName?: Maybe<Scalars['String']>
  displayLastName?: Maybe<Scalars['String']>
  expirationDate?: Maybe<Scalars['DateTime']>
  expiresWithinNoticeTime?: Maybe<Scalars['Boolean']>
  expiryStatus?: Maybe<Scalars['String']>
  issuingDate?: Maybe<Scalars['DateTime']>
  mrzFirstName?: Maybe<Scalars['String']>
  mrzLastName?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['String']>
  numberWithType?: Maybe<Scalars['String']>
  sex?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  subType?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  verboseType?: Maybe<Scalars['String']>
}

export type IdentityDocumentModelChild = {
  __typename?: 'IdentityDocumentModelChild'
  childName?: Maybe<Scalars['String']>
  childNationalId?: Maybe<Scalars['String']>
  passports?: Maybe<Array<IdentityDocumentModel>>
  secondParent?: Maybe<Scalars['String']>
  secondParentName?: Maybe<Scalars['String']>
}

export type IdentityInput = {
  nationalId: Scalars['String']
}

export type IdentityPerson = Identity & {
  __typename?: 'IdentityPerson'
  address?: Maybe<IdentityAddress>
  age: Scalars['Float']
  banMarking?: Maybe<NationalRegistryBanMarking>
  birthPlace?: Maybe<Scalars['String']>
  birthday: Scalars['DateTime']
  citizenship?: Maybe<NationalRegistryCitizenship>
  familyName?: Maybe<Scalars['String']>
  familyNr?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  fullName: Scalars['String']
  gender?: Maybe<NationalRegistryGender>
  givenName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  legalResidence?: Maybe<Scalars['String']>
  maritalStatus?: Maybe<NationalRegistryMaritalStatus>
  middleName?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  religion?: Maybe<Scalars['String']>
  spouse?: Maybe<NationalRegistrySpouse>
  type: IdentityType
}

export enum IdentityType {
  Company = 'Company',
  Person = 'Person',
}

export type Image = {
  __typename?: 'Image'
  contentType: Scalars['String']
  description?: Maybe<Scalars['String']>
  height: Scalars['Int']
  id: Scalars['ID']
  title: Scalars['String']
  url: Scalars['String']
  width: Scalars['Int']
}

export type InaoClientFinancialLimitInput = {
  clientType: Scalars['String']
  year: Scalars['String']
}

export type IntellectualPropertiesAnnualFee = {
  __typename?: 'IntellectualPropertiesAnnualFee'
  amount?: Maybe<Scalars['String']>
  id: Scalars['ID']
  paymentDate?: Maybe<Scalars['DateTime']>
  paymentDueDate?: Maybe<Scalars['DateTime']>
  payor?: Maybe<Scalars['String']>
  surcharge: Scalars['Boolean']
}

export type IntellectualPropertiesAnnualFeesInfo = {
  __typename?: 'IntellectualPropertiesAnnualFeesInfo'
  history?: Maybe<Array<IntellectualPropertiesAnnualFee>>
  nextPaymentDate?: Maybe<Scalars['DateTime']>
}

export type IntellectualPropertiesApplicationLifecycle = {
  __typename?: 'IntellectualPropertiesApplicationLifecycle'
  announcementDate?: Maybe<Scalars['DateTime']>
  applicationDate?: Maybe<Scalars['DateTime']>
  applicationDateAvailable?: Maybe<Scalars['DateTime']>
  applicationDatePublishedAsAvailable?: Maybe<Scalars['DateTime']>
  applicationDeadlineDate?: Maybe<Scalars['DateTime']>
  createDate?: Maybe<Scalars['DateTime']>
  expiryDate?: Maybe<Scalars['DateTime']>
  internationalRegistrationDate?: Maybe<Scalars['DateTime']>
  lastModified?: Maybe<Scalars['DateTime']>
  maxValidDate?: Maybe<Scalars['DateTime']>
  maxValidObjectionDate?: Maybe<Scalars['DateTime']>
  publishDate?: Maybe<Scalars['DateTime']>
  registrationDate?: Maybe<Scalars['DateTime']>
  renewalDate?: Maybe<Scalars['DateTime']>
  unregistrationDate?: Maybe<Scalars['DateTime']>
}

export type IntellectualPropertiesCategory = {
  __typename?: 'IntellectualPropertiesCategory'
  categoryDescription?: Maybe<Scalars['String']>
  categoryNumber?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesClassification = {
  __typename?: 'IntellectualPropertiesClassification'
  category: Scalars['String']
  creationDate?: Maybe<Scalars['DateTime']>
  publicationDate?: Maybe<Scalars['DateTime']>
  sequence?: Maybe<Scalars['Float']>
  type?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesCountry = {
  __typename?: 'IntellectualPropertiesCountry'
  code?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesDesign = IntellectualProperty & {
  __typename?: 'IntellectualPropertiesDesign'
  agent?: Maybe<IntellectualPropertiesPerson>
  applicationNumber?: Maybe<Scalars['String']>
  canRenew?: Maybe<Scalars['Boolean']>
  classification?: Maybe<Array<IntellectualPropertiesClassification>>
  classifications?: Maybe<Array<IntellectualPropertiesClassification>>
  designers?: Maybe<Array<IntellectualPropertiesPerson>>
  id: Scalars['String']
  lifecycle: IntellectualPropertiesApplicationLifecycle
  owners?: Maybe<Array<IntellectualPropertiesPerson>>
  specification?: Maybe<IntellectualPropertiesSpecification>
  status?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesDesignImagesInput = {
  designId: Scalars['String']
  designNumber: Scalars['String']
  imageNumber: Scalars['String']
  size?: InputMaybe<Scalars['String']>
}

export type IntellectualPropertiesEpApplicationLifecycle = {
  __typename?: 'IntellectualPropertiesEPApplicationLifecycle'
  applicationDate?: Maybe<Scalars['DateTime']>
  provisionDatePublishedInGazette?: Maybe<Scalars['DateTime']>
  publishDate?: Maybe<Scalars['DateTime']>
  translationSubmissionDate?: Maybe<Scalars['DateTime']>
}

export type IntellectualPropertiesImage = {
  __typename?: 'IntellectualPropertiesImage'
  designNumber?: Maybe<Scalars['Int']>
  image?: Maybe<Scalars['String']>
  imageNumber?: Maybe<Scalars['Int']>
}

export type IntellectualPropertiesImageList = {
  __typename?: 'IntellectualPropertiesImageList'
  count: Scalars['Int']
  images: Array<IntellectualPropertiesImage>
}

export type IntellectualPropertiesInput = {
  key: Scalars['String']
}

export type IntellectualPropertiesMarketingAuthorization = {
  __typename?: 'IntellectualPropertiesMarketingAuthorization'
  foreignAuthorizationDate?: Maybe<Scalars['DateTime']>
  foreignAuthorizationNumber?: Maybe<Scalars['String']>
  icelandicAuthorizationDate?: Maybe<Scalars['DateTime']>
  icelandicAuthorizationNumber?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesMedia = {
  __typename?: 'IntellectualPropertiesMedia'
  mediaPath?: Maybe<Scalars['String']>
  mediaType?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesPct = {
  __typename?: 'IntellectualPropertiesPCT'
  date?: Maybe<Scalars['DateTime']>
  number?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesPatent = {
  agent?: Maybe<IntellectualPropertiesPerson>
  annualFeesInfo?: Maybe<IntellectualPropertiesAnnualFeesInfo>
  applicationNumber?: Maybe<Scalars['String']>
  canRenew?: Maybe<Scalars['Boolean']>
  classifications?: Maybe<Array<IntellectualPropertiesClassification>>
  designers?: Maybe<Array<IntellectualPropertiesPerson>>
  id: Scalars['String']
  inventors?: Maybe<Array<IntellectualPropertiesPerson>>
  lifecycle?: Maybe<IntellectualPropertiesApplicationLifecycle>
  name: Scalars['String']
  nameInOrgLanguage?: Maybe<Scalars['String']>
  owners?: Maybe<Array<IntellectualPropertiesPerson>>
  priorities?: Maybe<Array<IntellectualPropertiesPriority>>
  specification?: Maybe<IntellectualPropertiesSpecification>
  status?: Maybe<Scalars['String']>
  statusDate?: Maybe<Scalars['DateTime']>
  statusText?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesPatentEp = IntellectualPropertiesPatent &
  IntellectualProperty & {
    __typename?: 'IntellectualPropertiesPatentEP'
    agent?: Maybe<IntellectualPropertiesPerson>
    alive?: Maybe<Scalars['Boolean']>
    annualFeesInfo?: Maybe<IntellectualPropertiesAnnualFeesInfo>
    applicationNumber?: Maybe<Scalars['String']>
    canRenew?: Maybe<Scalars['Boolean']>
    classificationType?: Maybe<Scalars['String']>
    classifications?: Maybe<Array<IntellectualPropertiesClassification>>
    designers?: Maybe<Array<IntellectualPropertiesPerson>>
    epApplicationNumber?: Maybe<Scalars['String']>
    epLifecycle?: Maybe<IntellectualPropertiesEpApplicationLifecycle>
    epoStatus?: Maybe<Scalars['String']>
    /** Possible IP application error state */
    error?: Maybe<Scalars['String']>
    id: Scalars['String']
    inventors?: Maybe<Array<IntellectualPropertiesPerson>>
    language?: Maybe<Scalars['String']>
    lifecycle?: Maybe<IntellectualPropertiesApplicationLifecycle>
    name: Scalars['String']
    nameInIcelandic?: Maybe<Scalars['String']>
    nameInOrgLanguage?: Maybe<Scalars['String']>
    owners?: Maybe<Array<IntellectualPropertiesPerson>>
    pct?: Maybe<IntellectualPropertiesPct>
    priorities?: Maybe<Array<IntellectualPropertiesPriority>>
    registrationNumber?: Maybe<Scalars['String']>
    spcNumbers?: Maybe<Array<Scalars['String']>>
    specification?: Maybe<IntellectualPropertiesSpecification>
    status?: Maybe<Scalars['String']>
    statusDate?: Maybe<Scalars['DateTime']>
    statusText?: Maybe<Scalars['String']>
  }

export type IntellectualPropertiesPatentIs = IntellectualPropertiesPatent &
  IntellectualProperty & {
    __typename?: 'IntellectualPropertiesPatentIS'
    agent?: Maybe<IntellectualPropertiesPerson>
    alive?: Maybe<Scalars['Boolean']>
    annualFeesInfo?: Maybe<IntellectualPropertiesAnnualFeesInfo>
    applicationNumber?: Maybe<Scalars['String']>
    canRenew?: Maybe<Scalars['Boolean']>
    classifications?: Maybe<Array<IntellectualPropertiesClassification>>
    designers?: Maybe<Array<IntellectualPropertiesPerson>>
    /** Possible IP application error state */
    error?: Maybe<Scalars['String']>
    id: Scalars['String']
    inventors?: Maybe<Array<IntellectualPropertiesPerson>>
    lifecycle?: Maybe<IntellectualPropertiesApplicationLifecycle>
    name: Scalars['String']
    nameInOrgLanguage?: Maybe<Scalars['String']>
    owners?: Maybe<Array<IntellectualPropertiesPerson>>
    pct?: Maybe<IntellectualPropertiesPct>
    priorities?: Maybe<Array<IntellectualPropertiesPriority>>
    registrationNumber?: Maybe<Scalars['String']>
    spcNumbers?: Maybe<Array<Scalars['String']>>
    specification?: Maybe<IntellectualPropertiesSpecification>
    status?: Maybe<Scalars['String']>
    statusDate?: Maybe<Scalars['DateTime']>
    statusText?: Maybe<Scalars['String']>
  }

export type IntellectualPropertiesPerson = {
  __typename?: 'IntellectualPropertiesPerson'
  address?: Maybe<Scalars['String']>
  addressFull?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  country?: Maybe<IntellectualPropertiesCountry>
  county?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['String']>
  isForeign?: Maybe<Scalars['Boolean']>
  mobilePhone?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  telephone?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesPriority = {
  __typename?: 'IntellectualPropertiesPriority'
  applicationDate?: Maybe<Scalars['DateTime']>
  countryCode?: Maybe<Scalars['String']>
  countryName?: Maybe<Scalars['String']>
  creationDate?: Maybe<Scalars['DateTime']>
  number?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesResponse = {
  __typename?: 'IntellectualPropertiesResponse'
  items?: Maybe<Array<IntellectualProperty>>
  totalCount: Scalars['Int']
}

export type IntellectualPropertiesSpc = IntellectualPropertiesPatent &
  IntellectualProperty & {
    __typename?: 'IntellectualPropertiesSPC'
    agent?: Maybe<IntellectualPropertiesPerson>
    annualFeesInfo?: Maybe<IntellectualPropertiesAnnualFeesInfo>
    /** Parent patent number */
    applicationNumber?: Maybe<Scalars['String']>
    canRenew?: Maybe<Scalars['Boolean']>
    classifications?: Maybe<Array<IntellectualPropertiesClassification>>
    designers?: Maybe<Array<IntellectualPropertiesPerson>>
    grantPublishedInGazetteDate?: Maybe<Scalars['DateTime']>
    id: Scalars['String']
    inventors?: Maybe<Array<IntellectualPropertiesPerson>>
    lifecycle?: Maybe<IntellectualPropertiesApplicationLifecycle>
    marketingAuthorization?: Maybe<IntellectualPropertiesMarketingAuthorization>
    medicine?: Maybe<Scalars['String']>
    medicineForChildren?: Maybe<Scalars['Boolean']>
    message?: Maybe<Scalars['String']>
    name: Scalars['String']
    nameInOrgLanguage?: Maybe<Scalars['String']>
    number: Scalars['String']
    owners?: Maybe<Array<IntellectualPropertiesPerson>>
    priorities?: Maybe<Array<IntellectualPropertiesPriority>>
    publishedInGazetteDate?: Maybe<Scalars['DateTime']>
    specification?: Maybe<IntellectualPropertiesSpecification>
    status?: Maybe<Scalars['String']>
    statusDate?: Maybe<Scalars['DateTime']>
    statusText?: Maybe<Scalars['String']>
  }

export type IntellectualPropertiesSpecification = {
  __typename?: 'IntellectualPropertiesSpecification'
  description?: Maybe<Scalars['String']>
  designIsDecoration?: Maybe<Scalars['String']>
  designShouldBeProtectedInColors?: Maybe<Scalars['String']>
  number?: Maybe<Scalars['String']>
  specificationCount?: Maybe<Scalars['String']>
  specificationText?: Maybe<Scalars['String']>
}

export type IntellectualPropertiesTrademark = IntellectualProperty & {
  __typename?: 'IntellectualPropertiesTrademark'
  agent?: Maybe<IntellectualPropertiesPerson>
  applicationNumber?: Maybe<Scalars['String']>
  canRenew?: Maybe<Scalars['Boolean']>
  classifications?: Maybe<Array<IntellectualPropertiesClassification>>
  deleted?: Maybe<Scalars['Boolean']>
  designers?: Maybe<Array<IntellectualPropertiesPerson>>
  id: Scalars['String']
  imageCategories?: Maybe<Scalars['String']>
  isColorMark?: Maybe<Scalars['Boolean']>
  lifecycle: IntellectualPropertiesApplicationLifecycle
  markAgent?: Maybe<IntellectualPropertiesPerson>
  markCategories?: Maybe<Array<IntellectualPropertiesCategory>>
  markOwners?: Maybe<Array<IntellectualPropertiesPerson>>
  media?: Maybe<IntellectualPropertiesMedia>
  owners?: Maybe<Array<IntellectualPropertiesPerson>>
  registrationNumber?: Maybe<Scalars['String']>
  specification?: Maybe<IntellectualPropertiesSpecification>
  status?: Maybe<Scalars['String']>
  subType?: Maybe<TrademarkSubType>
  text?: Maybe<Scalars['String']>
  type?: Maybe<TrademarkType>
  typeReadable?: Maybe<Scalars['String']>
}

export type IntellectualProperty = {
  agent?: Maybe<IntellectualPropertiesPerson>
  applicationNumber?: Maybe<Scalars['String']>
  canRenew?: Maybe<Scalars['Boolean']>
  classifications?: Maybe<Array<IntellectualPropertiesClassification>>
  designers?: Maybe<Array<IntellectualPropertiesPerson>>
  id: Scalars['String']
  lifecycle?: Maybe<IntellectualPropertiesApplicationLifecycle>
  owners?: Maybe<Array<IntellectualPropertiesPerson>>
  specification?: Maybe<IntellectualPropertiesSpecification>
  status?: Maybe<Scalars['String']>
}

export type IntroLinkImage = {
  __typename?: 'IntroLinkImage'
  id: Scalars['ID']
  image?: Maybe<Image>
  intro?: Maybe<Html>
  introHtml?: Maybe<Html>
  leftImage: Scalars['Boolean']
  link?: Maybe<ReferenceLink>
  linkTitle: Scalars['String']
  openLinkInNewTab: Scalars['Boolean']
  title: Scalars['String']
}

export type IsHealthInsuredInput = {
  date?: InputMaybe<Scalars['DateTime']>
}

export type Items =
  | AnchorPage
  | Article
  | LifeEventPage
  | Link
  | Manual
  | ManualChapterItem
  | News
  | OrganizationPage
  | OrganizationSubpage
  | ProjectPage
  | SubArticle
  | SupportQna

export type JourneymanLicence = {
  __typename?: 'JourneymanLicence'
  dateOfPublication?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  profession?: Maybe<Scalars['String']>
}

export type JourneymanLicencesResponse = {
  __typename?: 'JourneymanLicencesResponse'
  licences: Array<JourneymanLicence>
}

export type LandModel = {
  __typename?: 'LandModel'
  area?: Maybe<Scalars['String']>
  areaUnit?: Maybe<Scalars['String']>
  landAppraisal?: Maybe<Scalars['Float']>
  landNumber?: Maybe<Scalars['String']>
  registeredOwners?: Maybe<PropertyOwnersModel>
  useDisplay?: Maybe<Scalars['String']>
}

export type LatestEventsSlice = {
  __typename?: 'LatestEventsSlice'
  events: Array<Event>
  id: Scalars['ID']
  title: Scalars['String']
}

export type LatestGenericListItems = {
  __typename?: 'LatestGenericListItems'
  genericList?: Maybe<GenericList>
  id: Scalars['ID']
  itemResponse?: Maybe<GenericListItemResponse>
  seeMoreLinkText: Scalars['String']
  seeMorePage?: Maybe<Page>
  title: Scalars['String']
}

export type LatestNewsSlice = {
  __typename?: 'LatestNewsSlice'
  id: Scalars['ID']
  news: Array<News>
  readMoreLink?: Maybe<Link>
  readMoreText: Scalars['String']
  tag: Scalars['String']
  title: Scalars['String']
}

export type LawAndOrderAction = {
  __typename?: 'LawAndOrderAction'
  data?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
  type?: Maybe<LawAndOrderActionTypeEnum>
}

export enum LawAndOrderActionTypeEnum {
  File = 'file',
  Inbox = 'inbox',
  Url = 'url',
}

export type LawAndOrderCourtCase = {
  __typename?: 'LawAndOrderCourtCase'
  actions?: Maybe<Array<LawAndOrderAction>>
  data?: Maybe<LawAndOrderCourtCaseData>
  texts?: Maybe<LawAndOrderCourtCaseText>
}

export type LawAndOrderCourtCaseData = {
  __typename?: 'LawAndOrderCourtCaseData'
  caseNumberTitle?: Maybe<Scalars['String']>
  groups?: Maybe<Array<LawAndOrderGroup>>
  hasBeenServed?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type LawAndOrderCourtCaseInput = {
  id: Scalars['String']
}

export enum LawAndOrderCourtCaseStateTagColorEnum {
  Blue = 'blue',
  Blueberry = 'blueberry',
  Dark = 'dark',
  DarkerBlue = 'darkerBlue',
  Disabled = 'disabled',
  Mint = 'mint',
  Purple = 'purple',
  Red = 'red',
  Rose = 'rose',
  Warn = 'warn',
  White = 'white',
  Yellow = 'yellow',
}

export type LawAndOrderCourtCaseText = {
  __typename?: 'LawAndOrderCourtCaseText'
  footnote?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
}

export type LawAndOrderCourtCases = {
  __typename?: 'LawAndOrderCourtCases'
  cases?: Maybe<Array<LawAndOrderCourtCasesCase>>
}

export type LawAndOrderCourtCasesCase = {
  __typename?: 'LawAndOrderCourtCasesCase'
  caseNumberTitle?: Maybe<Scalars['String']>
  id: Scalars['ID']
  state?: Maybe<LawAndOrderCourtCasesState>
  type?: Maybe<Scalars['String']>
}

export type LawAndOrderCourtCasesState = {
  __typename?: 'LawAndOrderCourtCasesState'
  color?: Maybe<LawAndOrderCourtCaseStateTagColorEnum>
  label?: Maybe<Scalars['String']>
}

export type LawAndOrderDefenseChoice = {
  __typename?: 'LawAndOrderDefenseChoice'
  caseId: Scalars['String']
  choice?: Maybe<LawAndOrderDefenseChoice>
  lawyersNationalId?: Maybe<Scalars['String']>
}

export enum LawAndOrderDefenseChoiceEnum {
  Choose = 'CHOOSE',
  Delay = 'DELAY',
  Delegate = 'DELEGATE',
  Waive = 'WAIVE',
}

export type LawAndOrderDefenseChoiceInput = {
  caseId: Scalars['ID']
  choice: LawAndOrderDefenseChoiceEnum
  lawyersNationalId?: InputMaybe<Scalars['String']>
}

export type LawAndOrderGroup = {
  __typename?: 'LawAndOrderGroup'
  items?: Maybe<Array<LawAndOrderSubpoenaItem>>
  label?: Maybe<Scalars['String']>
}

export type LawAndOrderLawyer = {
  __typename?: 'LawAndOrderLawyer'
  nationalId?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type LawAndOrderLawyerChoices = {
  __typename?: 'LawAndOrderLawyerChoices'
  id?: Maybe<Scalars['String']>
  label?: Maybe<Scalars['String']>
}

export type LawAndOrderLawyers = {
  __typename?: 'LawAndOrderLawyers'
  choices?: Maybe<Array<LawAndOrderLawyerChoices>>
  lawyers?: Maybe<Array<LawAndOrderLawyer>>
}

export type LawAndOrderSubpoena = {
  __typename?: 'LawAndOrderSubpoena'
  actions?: Maybe<Array<LawAndOrderAction>>
  data?: Maybe<LawAndOrderSubpoenaData>
  texts?: Maybe<LawAndOrderSubpoenaTexts>
}

export type LawAndOrderSubpoenaData = {
  __typename?: 'LawAndOrderSubpoenaData'
  canEditDefenderChoice?: Maybe<Scalars['Boolean']>
  chosenDefender?: Maybe<Scalars['String']>
  courtContactInfo?: Maybe<Scalars['String']>
  defaultChoice: LawAndOrderDefenseChoiceEnum
  defenderChoice?: Maybe<LawAndOrderDefenseChoiceEnum>
  groups?: Maybe<Array<LawAndOrderGroup>>
  hasBeenServed?: Maybe<Scalars['Boolean']>
  hasChosen?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
}

export type LawAndOrderSubpoenaInput = {
  id: Scalars['String']
}

export type LawAndOrderSubpoenaItem = {
  __typename?: 'LawAndOrderSubpoenaItem'
  action?: Maybe<LawAndOrderAction>
  label?: Maybe<Scalars['String']>
  link?: Maybe<Scalars['String']>
  value?: Maybe<Scalars['String']>
}

export type LawAndOrderSubpoenaTexts = {
  __typename?: 'LawAndOrderSubpoenaTexts'
  confirmation?: Maybe<Scalars['String']>
  deadline?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  information?: Maybe<Scalars['String']>
}

export type Lawyer = {
  __typename?: 'Lawyer'
  licenceType?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type LicenseDriverLicenseData = {
  __typename?: 'LicenseDriverLicenseData'
  name: Scalars['String']
  nationalId: Scalars['String']
  picture?: Maybe<Scalars['String']>
}

export type LifeEventPage = {
  __typename?: 'LifeEventPage'
  category?: Maybe<ArticleCategory>
  content: Array<Slice>
  featured: Array<Featured>
  featuredImage?: Maybe<Image>
  id: Scalars['ID']
  image?: Maybe<Image>
  intro?: Maybe<Scalars['String']>
  organizations: Array<Organization>
  relatedLifeEvents: Array<LifeEventPage>
  seeMoreText?: Maybe<Scalars['String']>
  shortIntro?: Maybe<Scalars['String']>
  shortTitle?: Maybe<Scalars['String']>
  slug: Scalars['String']
  thumbnail?: Maybe<Image>
  tinyThumbnail?: Maybe<Image>
  title: Scalars['String']
}

export type Link = {
  __typename?: 'Link'
  date: Scalars['String']
  id: Scalars['ID']
  intro?: Maybe<Scalars['String']>
  labels?: Maybe<Array<Scalars['String']>>
  text: Scalars['String']
  url: Scalars['String']
}

export type LinkCard = {
  __typename?: 'LinkCard'
  body: Scalars['String']
  id: Scalars['ID']
  linkText?: Maybe<Scalars['String']>
  linkUrl: Scalars['String']
  title: Scalars['String']
}

export type LinkCardSection = {
  __typename?: 'LinkCardSection'
  cards: Array<LinkCard>
  id: Scalars['ID']
  title: Scalars['String']
}

export type LinkGroup = {
  __typename?: 'LinkGroup'
  childrenLinks: Array<Link>
  id: Scalars['ID']
  name: Scalars['String']
  primaryLink?: Maybe<Link>
}

export type LinkList = {
  __typename?: 'LinkList'
  links: Array<Link>
  title: Scalars['String']
}

/** Lists have different statuses to indicate actions that can be preformed on them. */
export enum ListStatus {
  /** List is active and open for digital signatures */
  Active = 'Active',
  /** Collection has been marked as processed and endtime on lists can be extended. */
  Extendable = 'Extendable',
  /** List is being reviewed by processing admin. Signatures can be uploaded on list. Comparison between lists and removal of signatures possible. */
  InReview = 'InReview',
  /** List is not active. */
  Inactive = 'Inactive',
  /** List has been reviewed by admin. This is a state that can be toggled to InReview. Comparison between lists and removal of signatures possible. */
  Reviewed = 'Reviewed',
}

export type LogoListSlice = {
  __typename?: 'LogoListSlice'
  body: Scalars['String']
  id: Scalars['ID']
  images: Array<Image>
  title: Scalars['String']
}

export type MachineDetails = {
  __typename?: 'MachineDetails'
  category?: Maybe<Scalars['String']>
  disabled?: Maybe<Scalars['Boolean']>
  id: Scalars['String']
  ownerNumber?: Maybe<Scalars['String']>
  paymentRequiredForOwnerChange?: Maybe<Scalars['Boolean']>
  plate?: Maybe<Scalars['String']>
  regNumber?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  subType?: Maybe<Scalars['String']>
  supervisorName?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

/** The status of a malware scan */
export enum MalwareScanStatus {
  Safe = 'SAFE',
  Unknown = 'UNKNOWN',
  Unsafe = 'UNSAFE',
}

export type Manual = {
  __typename?: 'Manual'
  category?: Maybe<ArticleCategory>
  chapters: Array<ManualChapter>
  description?: Maybe<Array<Slice>>
  group?: Maybe<ArticleGroup>
  id: Scalars['ID']
  importance?: Maybe<Scalars['Float']>
  info?: Maybe<Array<Slice>>
  organization?: Maybe<Organization>
  otherCategories?: Maybe<Array<ArticleCategory>>
  otherGroups?: Maybe<Array<ArticleGroup>>
  otherSubgroups?: Maybe<Array<ArticleSubgroup>>
  slug: Scalars['String']
  subgroup?: Maybe<ArticleSubgroup>
  title: Scalars['String']
}

export type ManualChapter = {
  __typename?: 'ManualChapter'
  changelog?: Maybe<ManualChapterChangelog>
  chapterItems: Array<ManualChapterItem>
  description?: Maybe<Array<Slice>>
  id: Scalars['ID']
  intro?: Maybe<Scalars['String']>
  slug: Scalars['String']
  title: Scalars['String']
}

export type ManualChapterChangelog = {
  __typename?: 'ManualChapterChangelog'
  items: Array<ManualChapterChangelogItem>
}

export type ManualChapterChangelogItem = {
  __typename?: 'ManualChapterChangelogItem'
  dateOfChange: Scalars['String']
  textualDescription: Scalars['String']
}

export type ManualChapterItem = {
  __typename?: 'ManualChapterItem'
  content?: Maybe<Array<Slice>>
  id: Scalars['ID']
  manual: ManualPageData
  manualChapter: ManualPageData
  title: Scalars['String']
}

export type ManualPageData = {
  __typename?: 'ManualPageData'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type ManyPropertyDetail = {
  __typename?: 'ManyPropertyDetail'
  propertyNumber?: Maybe<Scalars['String']>
  propertyType?: Maybe<Scalars['String']>
  realEstate?: Maybe<Array<RealEstateDetail>>
  ship?: Maybe<ShipDetail>
  vehicle?: Maybe<VehicleDetail>
}

export type MarkNotificationReadResponse = {
  __typename?: 'MarkNotificationReadResponse'
  data: Notification
}

export type MasterLicence = {
  __typename?: 'MasterLicence'
  dateOfPublication?: Maybe<Scalars['DateTime']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  office?: Maybe<Scalars['String']>
  profession?: Maybe<Scalars['String']>
}

export type MasterLicencesResponse = {
  __typename?: 'MasterLicencesResponse'
  licences: Array<MasterLicence>
}

export type MedicineDispensationsAtcInput = {
  atcCode: Scalars['String']
}

export type MedicinePrescriptionDocumentsInput = {
  id: Scalars['String']
}

export type Menu = {
  __typename?: 'Menu'
  id: Scalars['ID']
  links: Array<Link>
  menuLinks: Array<MenuLinkWithChildren>
  title: Scalars['String']
}

export type MenuLink = {
  __typename?: 'MenuLink'
  link: ReferenceLink
  title: Scalars['String']
}

export type MenuLinkWithChildren = {
  __typename?: 'MenuLinkWithChildren'
  childLinks: Array<MenuLink>
  link?: Maybe<ReferenceLink>
  title: Scalars['String']
}

export type MetadataInput = {
  field: EndorsementMetadataDtoFieldEnum
}

export type MortgageCertificateValidationModel = {
  __typename?: 'MortgageCertificateValidationModel'
  exists: Scalars['Boolean']
  hasKMarking: Scalars['Boolean']
  propertyNumber: Scalars['String']
}

export type MultipleStatistics = {
  __typename?: 'MultipleStatistics'
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  link?: Maybe<Link>
  statistics: Array<Statistics>
  title: Scalars['String']
}

export type MunicipalitiesFinancialAidAmountModel = {
  __typename?: 'MunicipalitiesFinancialAidAmountModel'
  aidAmount: Scalars['Float']
  applicationId: Scalars['String']
  childrenAidAmount?: Maybe<Scalars['Float']>
  deductionFactors?: Maybe<
    Array<MunicipalitiesFinancialAidDeductionFactorsModel>
  >
  finalAmount: Scalars['Float']
  income?: Maybe<Scalars['Float']>
  personalTaxCredit: Scalars['Float']
  spousePersonalTaxCredit?: Maybe<Scalars['Float']>
  tax: Scalars['Float']
}

export type MunicipalitiesFinancialAidApplicationChildren = {
  __typename?: 'MunicipalitiesFinancialAidApplicationChildren'
  applicationId: Scalars['String']
  id: Scalars['ID']
  name: Scalars['String']
  nationalId: Scalars['String']
  school?: Maybe<Scalars['String']>
}

export type MunicipalitiesFinancialAidApplicationEventModel = {
  __typename?: 'MunicipalitiesFinancialAidApplicationEventModel'
  applicationId: Scalars['String']
  comment?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  eventType: Scalars['String']
  id: Scalars['ID']
  staffName?: Maybe<Scalars['String']>
  staffNationalId?: Maybe<Scalars['String']>
}

export type MunicipalitiesFinancialAidApplicationFileModel = {
  __typename?: 'MunicipalitiesFinancialAidApplicationFileModel'
  applicationId: Scalars['String']
  created: Scalars['DateTime']
  id: Scalars['ID']
  key: Scalars['String']
  name: Scalars['String']
  size: Scalars['Float']
  type: Scalars['String']
}

export type MunicipalitiesFinancialAidApplicationFilesInput = {
  files: Array<ApplicationFileInput>
}

export type MunicipalitiesFinancialAidApplicationInput = {
  id: Scalars['String']
}

export type MunicipalitiesFinancialAidApplicationModel = {
  __typename?: 'MunicipalitiesFinancialAidApplicationModel'
  accountNumber?: Maybe<Scalars['String']>
  amount?: Maybe<MunicipalitiesFinancialAidAmountModel>
  applicationEvents?: Maybe<
    Array<MunicipalitiesFinancialAidApplicationEventModel>
  >
  applicationSystemId?: Maybe<Scalars['String']>
  bankNumber?: Maybe<Scalars['String']>
  children?: Maybe<Array<MunicipalitiesFinancialAidApplicationChildren>>
  city?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  directTaxPayments: Array<DirectTaxPaymentModel>
  email: Scalars['String']
  employment: Scalars['String']
  employmentCustom?: Maybe<Scalars['String']>
  familyStatus: Scalars['String']
  files?: Maybe<Array<MunicipalitiesFinancialAidApplicationFileModel>>
  formComment?: Maybe<Scalars['String']>
  hasIncome: Scalars['Boolean']
  homeCircumstances: Scalars['String']
  homeCircumstancesCustom?: Maybe<Scalars['String']>
  id: Scalars['ID']
  interview?: Maybe<Scalars['Boolean']>
  ledger?: Maybe<Scalars['String']>
  modified: Scalars['DateTime']
  municipalityCode?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['String']
  phoneNumber?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  rejection?: Maybe<Scalars['String']>
  spouseEmail?: Maybe<Scalars['String']>
  spouseFormComment?: Maybe<Scalars['String']>
  spouseName?: Maybe<Scalars['String']>
  spouseNationalId?: Maybe<Scalars['String']>
  spousePhoneNumber?: Maybe<Scalars['String']>
  state: Scalars['String']
  streetName?: Maybe<Scalars['String']>
  student: Scalars['Boolean']
  studentCustom?: Maybe<Scalars['String']>
  usePersonalTaxCredit: Scalars['Boolean']
}

export type MunicipalitiesFinancialAidCreateFilesModel = {
  __typename?: 'MunicipalitiesFinancialAidCreateFilesModel'
  files: Array<MunicipalitiesFinancialAidApplicationFileModel>
  success: Scalars['Boolean']
}

export type MunicipalitiesFinancialAidCreateSignedUrlInput = {
  fileName: Scalars['String']
  folder: Scalars['String']
}

export type MunicipalitiesFinancialAidDeductionFactorsModel = {
  __typename?: 'MunicipalitiesFinancialAidDeductionFactorsModel'
  amount: Scalars['Float']
  amountId: Scalars['String']
  description: Scalars['String']
}

export type MunicipalitiesFinancialAidGetSignedUrlInput = {
  id: Scalars['String']
}

export type MunicipalitiesFinancialAidSignedUrlModel = {
  __typename?: 'MunicipalitiesFinancialAidSignedUrlModel'
  key: Scalars['String']
  url: Scalars['String']
}

export type MunicipalitiesFinancialAidUpdateApplicationInput = {
  comment?: InputMaybe<Scalars['String']>
  event: Scalars['String']
  id: Scalars['String']
  state: Scalars['String']
}

export type Mutation = {
  __typename?: 'Mutation'
  OJOIAPostApplication: Scalars['Boolean']
  OJOIAPostComment: OfficialJournalOfIcelandApplicationPostCommentResponse
  UserProfileAdminUpdateProfile: UserProfileAdminProfile
  addAttachment?: Maybe<Application>
  addUserProfileDeviceToken: UserDeviceToken
  assignApplication?: Maybe<Application>
  authCreateDelegation: AuthCustomDelegation
  authDeleteAdminDelegation: Scalars['Boolean']
  authDeletePasskey: Scalars['Boolean']
  authPasskeyVerifyRegistration: AuthPasskeyRegistrationVerification
  confirmAirDiscountSchemeInvoice: Array<AirDiscountSchemeFlightLeg>
  consultationPortalDeleteSubscriptionType?: Maybe<Scalars['Boolean']>
  consultationPortalPostAdvice?: Maybe<Scalars['Boolean']>
  consultationPortalPostSubscriptionType?: Maybe<Scalars['Boolean']>
  consultationPortalPostSubscriptions?: Maybe<Scalars['Boolean']>
  consultationPortalPostUserEmail?: Maybe<Scalars['Boolean']>
  contactUs: CommunicationResponse
  contactUsZendeskTicket: CommunicationResponse
  createAdministrativeContact?: Maybe<Contact>
  createAirDiscountSchemeExplicitDiscountCode?: Maybe<
    Array<AirDiscountSchemeDiscount>
  >
  createAirDiscountSchemeSuperExplicitDiscountCode?: Maybe<
    Array<AirDiscountSchemeDiscount>
  >
  createApplication?: Maybe<Application>
  createAuthAdminClient: Array<AuthAdminCreateClientResponse>
  createAuthAdminScope: Array<AuthAdminCreateScopeResponse>
  createAuthDelegation: AuthDelegation
  createAuthLoginRestriction: AuthLoginRestriction
  createDraftRegulation: Scalars['JSON']
  createDraftRegulationCancel: DraftRegulationCancelModel
  createDraftRegulationChange: DraftRegulationChangeModel
  createEmailVerification?: Maybe<Response>
  createFormSystemApplicant: FormSystemApplicant
  createFormSystemApplication: Scalars['Boolean']
  createFormSystemCertification: FormSystemFormCertificationTypeDto
  createFormSystemField: FormSystemField
  createFormSystemForm: FormSystemFormResponse
  createFormSystemListItem: FormSystemListItem
  createFormSystemOrganization: FormSystemOrganization
  createFormSystemOrganizationPermission: FormSystemOrganizationPermissionDto
  createFormSystemScreen: FormSystemScreen
  createFormSystemSection: FormSystemSection
  createHelpdesk?: Maybe<Helpdesk>
  createIcelandicName: IcelandicName
  createMunicipalitiesFinancialAidApplicationFiles: MunicipalitiesFinancialAidCreateFilesModel
  createMunicipalitiesFinancialAidSignedUrl: MunicipalitiesFinancialAidSignedUrlModel
  createProfile?: Maybe<UserProfile>
  createProvider: ClientCredentials
  createSmsVerification?: Maybe<Response>
  createTechnicalContact?: Maybe<Contact>
  createTestProvider: ClientCredentials
  createUploadUrl: PresignedPost
  deleteApplication?: Maybe<Application>
  deleteAttachment?: Maybe<Application>
  deleteAuthAdminClient: Scalars['Boolean']
  deleteAuthDelegation: Scalars['Boolean']
  deleteDraftRegulation: DeleteDraftRegulationModel
  deleteDraftRegulationCancel: DeleteDraftRegulationModel
  deleteDraftRegulationChange: DeleteDraftRegulationModel
  deleteFormSystemApplicant?: Maybe<Scalars['Boolean']>
  deleteFormSystemCertification?: Maybe<Scalars['Boolean']>
  deleteFormSystemField?: Maybe<Scalars['Boolean']>
  deleteFormSystemForm?: Maybe<Scalars['Boolean']>
  deleteFormSystemListItem?: Maybe<Scalars['Boolean']>
  deleteFormSystemOrganizationPermission?: Maybe<Scalars['Boolean']>
  deleteFormSystemScreen?: Maybe<Scalars['Boolean']>
  deleteFormSystemSection?: Maybe<Scalars['Boolean']>
  deleteIcelandicNameById: DeleteNameResponse
  deleteIslykillValue?: Maybe<UserProfile>
  deleteUserProfileDeviceToken: DeleteTokenResponse
  documentProviderPostProvidedCategory: DocumentProviderCategory
  documentProviderPostProvidedType: DocumentProviderType
  documentProviderPutProvidedCategory: DocumentProviderCategory
  documentProviderPutProvidedType: DocumentProviderType
  documentsV2MarkAllAsRead?: Maybe<DocumentV2MarkAllMailAsRead>
  drivingLicenseBookAllowPracticeDriving: DrivingLicenseBookSuccess
  drivingLicenseBookCreateDrivingSchoolTestResult: DrivingLicenceTestResultId
  drivingLicenseBookCreatePracticalDrivingLesson: PracticalDrivingLesson
  drivingLicenseBookDeletePracticalDrivingLesson: DrivingLicenseBookSuccess
  drivingLicenseBookUpdatePracticalDrivingLesson: DrivingLicenseBookSuccess
  emailSignupSubscription: EmailSignupResponse
  endorsementSystemCloseEndorsementList: EndorsementList
  endorsementSystemCreateEndorsementList: EndorsementList
  endorsementSystemEndorseList: Endorsement
  endorsementSystemExportList: ExportUrlResponse
  endorsementSystemLockEndorsementList: EndorsementList
  endorsementSystemOpenEndorsementList: EndorsementList
  endorsementSystemUnendorseList: Scalars['Boolean']
  endorsementSystemUnlockEndorsementList: EndorsementList
  endorsementSystemUpdateEndorsementList: EndorsementList
  endorsementSystemsendPdfEmail: SendPdfEmailResponse
  fetchEducationSignedLicenseUrl?: Maybe<EducationSignedLicense>
  formSystemTranslation: FormSystemTranslation
  generatePkPass: GenericPkPass
  generatePkPassQrCode: GenericPkPassQrCode
  genericForm: CommunicationResponse
  healthDirectorateOrganDonationUpdateDonorStatus?: Maybe<Scalars['Boolean']>
  healthDirectoratePrescriptionRenewal?: Maybe<HealthDirectoratePrescriptions>
  lawAndOrderDefenseChoicePost?: Maybe<LawAndOrderDefenseChoice>
  markAllNotificationsRead?: Maybe<NotificationsMarkAllAsReadResponse>
  markAllNotificationsSeen?: Maybe<NotificationsMarkAllAsSeenResponse>
  markNotificationAsRead?: Maybe<MarkNotificationReadResponse>
  officialJournalOfIcelandApplicationAddAttachment: OfficialJournalOfIcelandApplicationAddApplicationAttachmentResponse
  officialJournalOfIcelandApplicationDeleteAttachment: OfficialJournalOfIcelandApplicationAddApplicationAttachmentResponse
  officialJournalOfIcelandApplicationGetPresignedUrl: OfficialJournalOfIcelandApplicationGetPresignedUrlResponse
  patchAuthAdminClient: Array<AuthAdminClientEnvironment>
  patchAuthAdminScope: Array<AuthAdminScopeEnvironment>
  patchAuthConsent: Scalars['Boolean']
  patchAuthDelegation: AuthDelegation
  paymentsChargeCard: PaymentsChargeCardResponse
  paymentsCreateInvoice: PaymentsCreateInvoiceResponse
  paymentsVerificationCallback: PaymentsCardVerificationResponse
  paymentsVerifyCard: PaymentsVerifyCardResponse
  /** @deprecated Up for removal */
  postBulkMailAction?: Maybe<BulkMailAction>
  /** @deprecated Up for removal */
  postMailAction?: Maybe<ActionMailBody>
  postMailActionV2?: Maybe<DocumentMailAction>
  /** @deprecated Up for removal */
  postPaperMailInfo?: Maybe<PaperMailBody>
  publishAuthAdminClient: AuthAdminClientEnvironment
  publishAuthAdminScope: AuthAdminScopeEnvironment
  regulationCreatePresignedPost: Scalars['JSON']
  removeAuthLoginRestriction: Scalars['Boolean']
  revokeAuthAdminClientSecrets: Scalars['Boolean']
  rightsPortalDrugsCalculator: RightsPortalDrugCalculatorResponse
  rightsPortalRegisterDentist: RightsPortalDentistRegisterResponse
  rightsPortalRegisterHealthCenter: RightsPortalHealthCenterRegisterResponse
  rotateAuthAdminClientSecret: AuthAdminClientSecret
  runEndpointTests: Array<TestResult>
  serviceWebForms: CommunicationResponse
  signatureCollectionAddAreas: SignatureCollectionSuccess
  signatureCollectionAdminBulkCompareSignaturesAllLists: Array<SignatureCollectionSignature>
  signatureCollectionAdminBulkUploadSignatures: SignatureCollectionBulk
  signatureCollectionAdminCompareList: Array<SignatureCollectionSignature>
  signatureCollectionAdminCreate: SignatureCollectionSlug
  signatureCollectionAdminExtendDeadline: SignatureCollectionSuccess
  signatureCollectionAdminProcess: SignatureCollectionSuccess
  signatureCollectionAdminRemoveCandidate: SignatureCollectionSuccess
  signatureCollectionAdminRemoveList: SignatureCollectionSuccess
  signatureCollectionAdminToggleListReview: SignatureCollectionSuccess
  signatureCollectionAdminUnsign: SignatureCollectionSuccess
  signatureCollectionAdminUpdatePaperSignaturePageNumber: SignatureCollectionSuccess
  signatureCollectionAdminUploadPaperSignature: SignatureCollectionSuccess
  signatureCollectionCancel: SignatureCollectionSuccess
  signatureCollectionLockList: SignatureCollectionSuccess
  signatureCollectionUnsign: SignatureCollectionSuccess
  signatureCollectionUpdatePaperSignaturePageNumber: SignatureCollectionSuccess
  signatureCollectionUploadPaperSignature: SignatureCollectionSuccess
  submitApplication?: Maybe<Application>
  submitFormSystemApplication: Scalars['Boolean']
  submitFormSystemScreen: Scalars['Boolean']
  tellUsAStory: CommunicationResponse
  updateAdministrativeContact: Contact
  updateApplication?: Maybe<Application>
  updateApplicationExternalData?: Maybe<Application>
  /** @deprecated Use patchAuthDelegation instead for increased consistency. */
  updateAuthDelegation: AuthDelegation
  updateCurrentEmployer: UpdateCurrentEmployerResponse
  updateDraftRegulationById: Scalars['JSON']
  updateDraftRegulationCancel: DraftRegulationCancelModel
  updateDraftRegulationChange: DraftRegulationChangeModel
  updateEndpoint: AudienceAndScope
  updateFormSystemApplicant?: Maybe<Scalars['Boolean']>
  updateFormSystemApplicationDependencies: Scalars['Boolean']
  updateFormSystemField?: Maybe<Scalars['Boolean']>
  updateFormSystemFieldsDisplayOrder?: Maybe<Scalars['Boolean']>
  updateFormSystemForm?: Maybe<FormSystemUpdateFormResponse>
  updateFormSystemListItem?: Maybe<Scalars['Boolean']>
  updateFormSystemListItemsDisplayOrder?: Maybe<Scalars['Boolean']>
  updateFormSystemScreen?: Maybe<FormSystemScreen>
  updateFormSystemScreensDisplayOrder?: Maybe<Scalars['Boolean']>
  updateFormSystemSection?: Maybe<FormSystemSection>
  updateFormSystemSectionsDisplayOrder?: Maybe<Scalars['Boolean']>
  updateHelpdesk: Helpdesk
  updateIcelandicNameById: IcelandicName
  updateMunicipalitiesFinancialAidApplication?: Maybe<MunicipalitiesFinancialAidApplicationModel>
  updateOrganisation: Organisation
  updateProfile?: Maybe<UserProfile>
  updateTechnicalContact: Contact
  updateTestEndpoint: AudienceAndScope
  userProfileConfirmNudge: Scalars['Boolean']
  userProfileUpdateActorProfile: UserProfileActorProfile
  vehicleBulkMileagePost?: Maybe<VehiclesBulkMileageReadingResponse>
  vehicleMileagePost?: Maybe<VehicleMileageDetail>
  vehicleMileagePostV2?: Maybe<VehicleMileagePostResponse>
  vehicleMileagePut?: Maybe<VehicleMileagePutModel>
  vehicleMileagePutV2?: Maybe<VehicleMileagePutResponse>
  verifyLicenseBarcode: VerifyLicenseBarcodeResult
  /** @deprecated Should use verifyLicenseBarcode instead of verifyPkPass */
  verifyPkPass: GenericPkPassVerification
  watsonAssistantChatSubmitFeedback: WatsonAssistantChatSubmitFeedbackResponse
}

export type MutationOjoiaPostApplicationArgs = {
  input: OjoiaIdInput
}

export type MutationOjoiaPostCommentArgs = {
  input: OjoiaPostCommentInput
}

export type MutationUserProfileAdminUpdateProfileArgs = {
  input: UpdateUserProfileInput
  nationalId: Scalars['String']
}

export type MutationAddAttachmentArgs = {
  input: AddAttachmentInput
}

export type MutationAddUserProfileDeviceTokenArgs = {
  input: UserDeviceTokenInput
}

export type MutationAssignApplicationArgs = {
  input: AssignApplicationInput
}

export type MutationAuthCreateDelegationArgs = {
  input: CreateDelegationInput
}

export type MutationAuthDeleteAdminDelegationArgs = {
  id: Scalars['String']
}

export type MutationAuthPasskeyVerifyRegistrationArgs = {
  input: AuthPasskeyRegistrationObject
}

export type MutationConfirmAirDiscountSchemeInvoiceArgs = {
  input: AirDiscountSchemeConfirmInvoiceInput
}

export type MutationConsultationPortalDeleteSubscriptionTypeArgs = {
  input: ConsultationPortalCaseInput
}

export type MutationConsultationPortalPostAdviceArgs = {
  input: ConsultationPortalPostAdviceInput
}

export type MutationConsultationPortalPostSubscriptionTypeArgs = {
  input: ConsultationPortalPostCaseSubscriptionTypeInput
}

export type MutationConsultationPortalPostSubscriptionsArgs = {
  input: ConsultationPortalUserSubscriptionsCommandInput
}

export type MutationConsultationPortalPostUserEmailArgs = {
  input: ConsultationPortalPostEmailCommandInput
}

export type MutationContactUsArgs = {
  input: ContactUsInput
}

export type MutationContactUsZendeskTicketArgs = {
  input: ContactUsInput
}

export type MutationCreateAdministrativeContactArgs = {
  input: CreateContactInput
  organisationId: Scalars['String']
}

export type MutationCreateAirDiscountSchemeExplicitDiscountCodeArgs = {
  input: AirDiscountSchemeCreateExplicitDiscountCodeInput
}

export type MutationCreateAirDiscountSchemeSuperExplicitDiscountCodeArgs = {
  input: AirDiscountSchemeCreateExplicitDiscountCodeInput
}

export type MutationCreateApplicationArgs = {
  input: CreateApplicationInput
  locale?: InputMaybe<Scalars['String']>
}

export type MutationCreateAuthAdminClientArgs = {
  input: CreateAuthAdminClientInput
}

export type MutationCreateAuthAdminScopeArgs = {
  input: CreateScopeInput
}

export type MutationCreateAuthDelegationArgs = {
  input: CreateAuthDelegationInput
}

export type MutationCreateAuthLoginRestrictionArgs = {
  input: CreateAuthLoginRestrictionInput
}

export type MutationCreateDraftRegulationArgs = {
  input: CreateDraftRegulationInput
}

export type MutationCreateDraftRegulationCancelArgs = {
  input: CreateDraftRegulationCancelInput
}

export type MutationCreateDraftRegulationChangeArgs = {
  input: CreateDraftRegulationChangeInput
}

export type MutationCreateEmailVerificationArgs = {
  input: CreateEmailVerificationInput
}

export type MutationCreateFormSystemApplicantArgs = {
  input: CreateFormSystemApplicantInput
}

export type MutationCreateFormSystemApplicationArgs = {
  input: CreateFormSystemApplicationInput
}

export type MutationCreateFormSystemCertificationArgs = {
  input: CreateFormSystemCertificationInput
}

export type MutationCreateFormSystemFieldArgs = {
  input: FormSystemCreateFieldInput
}

export type MutationCreateFormSystemFormArgs = {
  input: FormSystemCreateFormInput
}

export type MutationCreateFormSystemListItemArgs = {
  input: FormSystemCreateListItemInput
}

export type MutationCreateFormSystemOrganizationArgs = {
  input: FormSystemGetOrganizationInput
}

export type MutationCreateFormSystemOrganizationPermissionArgs = {
  input: FormSystemUpdateOrganizationPermissionInput
}

export type MutationCreateFormSystemScreenArgs = {
  input: FormSystemCreateScreenInput
}

export type MutationCreateFormSystemSectionArgs = {
  input: FormSystemCreateSectionInput
}

export type MutationCreateHelpdeskArgs = {
  input: CreateHelpdeskInput
  organisationId: Scalars['String']
}

export type MutationCreateIcelandicNameArgs = {
  input: CreateIcelandicNameInput
}

export type MutationCreateMunicipalitiesFinancialAidApplicationFilesArgs = {
  input: MunicipalitiesFinancialAidApplicationFilesInput
}

export type MutationCreateMunicipalitiesFinancialAidSignedUrlArgs = {
  input: MunicipalitiesFinancialAidCreateSignedUrlInput
}

export type MutationCreateProfileArgs = {
  input: CreateUserProfileInput
}

export type MutationCreateProviderArgs = {
  input: CreateProviderInput
}

export type MutationCreateSmsVerificationArgs = {
  input: CreateSmsVerificationInput
}

export type MutationCreateTechnicalContactArgs = {
  input: CreateContactInput
  organisationId: Scalars['String']
}

export type MutationCreateTestProviderArgs = {
  input: CreateProviderInput
}

export type MutationCreateUploadUrlArgs = {
  filename: Scalars['String']
}

export type MutationDeleteApplicationArgs = {
  input: DeleteApplicationInput
}

export type MutationDeleteAttachmentArgs = {
  input: DeleteAttachmentInput
}

export type MutationDeleteAuthAdminClientArgs = {
  input: AuthAdminDeleteClientInput
}

export type MutationDeleteAuthDelegationArgs = {
  input: DeleteAuthDelegationInput
}

export type MutationDeleteDraftRegulationArgs = {
  input: DeleteDraftRegulationInput
}

export type MutationDeleteDraftRegulationCancelArgs = {
  input: DeleteDraftRegulationCancelInput
}

export type MutationDeleteDraftRegulationChangeArgs = {
  input: DeleteDraftRegulationChangeInput
}

export type MutationDeleteFormSystemApplicantArgs = {
  input: DeleteFormSystemApplicantInput
}

export type MutationDeleteFormSystemCertificationArgs = {
  input: DeleteFormSystemCertificationInput
}

export type MutationDeleteFormSystemFieldArgs = {
  input: FormSystemDeleteFieldInput
}

export type MutationDeleteFormSystemFormArgs = {
  input: FormSystemDeleteFormInput
}

export type MutationDeleteFormSystemListItemArgs = {
  input: FormSystemDeleteListItemInput
}

export type MutationDeleteFormSystemOrganizationPermissionArgs = {
  input: FormSystemUpdateOrganizationPermissionInput
}

export type MutationDeleteFormSystemScreenArgs = {
  input: FormSystemDeleteScreenInput
}

export type MutationDeleteFormSystemSectionArgs = {
  input: FormSystemDeleteSectionInput
}

export type MutationDeleteIcelandicNameByIdArgs = {
  input: DeleteIcelandicNameByIdInput
}

export type MutationDeleteIslykillValueArgs = {
  input: DeleteIslykillValueInput
}

export type MutationDeleteUserProfileDeviceTokenArgs = {
  input: UserDeviceTokenInput
}

export type MutationDocumentProviderPostProvidedCategoryArgs = {
  input: DocumentProviderCategoriesAndTypesPostInput
}

export type MutationDocumentProviderPostProvidedTypeArgs = {
  input: DocumentProviderCategoriesAndTypesPostInput
}

export type MutationDocumentProviderPutProvidedCategoryArgs = {
  input: DocumentProviderCategoriesAndTypesPutInput
}

export type MutationDocumentProviderPutProvidedTypeArgs = {
  input: DocumentProviderCategoriesAndTypesPutInput
}

export type MutationDrivingLicenseBookAllowPracticeDrivingArgs = {
  input: DrivingLicenseBookStudentInput
}

export type MutationDrivingLicenseBookCreateDrivingSchoolTestResultArgs = {
  input: CreateDrivingSchoolTestResultInput
}

export type MutationDrivingLicenseBookCreatePracticalDrivingLessonArgs = {
  input: CreatePracticalDrivingLessonInput
}

export type MutationDrivingLicenseBookDeletePracticalDrivingLessonArgs = {
  input: DeletePracticalDrivingLessonInput
}

export type MutationDrivingLicenseBookUpdatePracticalDrivingLessonArgs = {
  input: UpdatePracticalDrivingLessonInput
}

export type MutationEmailSignupSubscriptionArgs = {
  input: EmailSignupInput
}

export type MutationEndorsementSystemCloseEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemCreateEndorsementListArgs = {
  input: CreateEndorsementListDto
}

export type MutationEndorsementSystemEndorseListArgs = {
  input: CreateEndorsementInput
}

export type MutationEndorsementSystemExportListArgs = {
  input: ExportEndorsementListInput
}

export type MutationEndorsementSystemLockEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemOpenEndorsementListArgs = {
  input: OpenListInput
}

export type MutationEndorsementSystemUnendorseListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemUnlockEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type MutationEndorsementSystemUpdateEndorsementListArgs = {
  input: UpdateEndorsementListInput
}

export type MutationEndorsementSystemsendPdfEmailArgs = {
  input: SendPdfEmailInput
}

export type MutationFetchEducationSignedLicenseUrlArgs = {
  input: FetchEducationSignedLicenseUrlInput
}

export type MutationFormSystemTranslationArgs = {
  input: FormSystemTranslationInput
}

export type MutationGeneratePkPassArgs = {
  input: GeneratePkPassInput
}

export type MutationGeneratePkPassQrCodeArgs = {
  input: GeneratePkPassInput
}

export type MutationGenericFormArgs = {
  input: GenericFormInput
}

export type MutationHealthDirectorateOrganDonationUpdateDonorStatusArgs = {
  input: HealthDirectorateOrganDonorInput
  locale?: InputMaybe<Scalars['String']>
}

export type MutationHealthDirectoratePrescriptionRenewalArgs = {
  input: HealthDirectorateRenewalInput
}

export type MutationLawAndOrderDefenseChoicePostArgs = {
  input: LawAndOrderDefenseChoiceInput
  locale?: InputMaybe<Scalars['String']>
}

export type MutationMarkNotificationAsReadArgs = {
  id: Scalars['Float']
  locale?: InputMaybe<Scalars['String']>
}

export type MutationOfficialJournalOfIcelandApplicationAddAttachmentArgs = {
  input: OfficialJournalOfIcelandApplicationAddApplicationAttachmentInput
}

export type MutationOfficialJournalOfIcelandApplicationDeleteAttachmentArgs = {
  input: OfficialJournalOfIcelandApplicationDeleteApplicationAttachmentInput
}

export type MutationOfficialJournalOfIcelandApplicationGetPresignedUrlArgs = {
  input: OfficialJournalOfIcelandApplicationGetPresignedUrlInput
}

export type MutationPatchAuthAdminClientArgs = {
  input: AuthAdminPatchClientInput
}

export type MutationPatchAuthAdminScopeArgs = {
  input: AuthAdminPatchScopeInput
}

export type MutationPatchAuthConsentArgs = {
  input: PatchAuthConsentInput
}

export type MutationPatchAuthDelegationArgs = {
  input: PatchAuthDelegationInput
}

export type MutationPaymentsChargeCardArgs = {
  input: PaymentsChargeCardInput
}

export type MutationPaymentsCreateInvoiceArgs = {
  input: PaymentsCreateInvoiceInput
}

export type MutationPaymentsVerificationCallbackArgs = {
  input: PaymentsCardVerificationCallbackInput
}

export type MutationPaymentsVerifyCardArgs = {
  input: PaymentsVerifyCardInput
}

export type MutationPostBulkMailActionArgs = {
  input: PostBulkMailActionResolverInput
}

export type MutationPostMailActionArgs = {
  input: PostMailActionResolverInput
}

export type MutationPostMailActionV2Args = {
  input: DocumentsV2MailActionInput
}

export type MutationPostPaperMailInfoArgs = {
  input: PostRequestPaperInput
}

export type MutationPublishAuthAdminClientArgs = {
  input: AuthAdminPublishClientInput
}

export type MutationPublishAuthAdminScopeArgs = {
  input: AuthAdminPublishScopeInput
}

export type MutationRegulationCreatePresignedPostArgs = {
  input: CreateRegulationPresignedPostInput
}

export type MutationRevokeAuthAdminClientSecretsArgs = {
  input: AuthAdminRevokeSecretsInput
}

export type MutationRightsPortalDrugsCalculatorArgs = {
  input: RightsPortalDrugCalculatorInput
}

export type MutationRightsPortalRegisterDentistArgs = {
  input: RightsPortalDentistRegisterInput
}

export type MutationRightsPortalRegisterHealthCenterArgs = {
  input: RightsPortalHealthCenterRegisterInput
}

export type MutationRotateAuthAdminClientSecretArgs = {
  input: AuthAdminRotateSecretInput
}

export type MutationRunEndpointTestsArgs = {
  input: RunEndpointTestsInput
}

export type MutationServiceWebFormsArgs = {
  input: ServiceWebFormsInput
}

export type MutationSignatureCollectionAddAreasArgs = {
  input: SignatureCollectionAddListsInput
}

export type MutationSignatureCollectionAdminBulkCompareSignaturesAllListsArgs = {
  input: SignatureCollectionNationalIdsInput
}

export type MutationSignatureCollectionAdminBulkUploadSignaturesArgs = {
  input: SignatureCollectionListBulkUploadInput
}

export type MutationSignatureCollectionAdminCompareListArgs = {
  input: SignatureCollectionListNationalIdsInput
}

export type MutationSignatureCollectionAdminCreateArgs = {
  input: SignatureCollectionListInput
}

export type MutationSignatureCollectionAdminExtendDeadlineArgs = {
  input: SignatureCollectionExtendDeadlineInput
}

export type MutationSignatureCollectionAdminProcessArgs = {
  input: SignatureCollectionIdInput
}

export type MutationSignatureCollectionAdminRemoveCandidateArgs = {
  input: SignatureCollectionCandidateIdInput
}

export type MutationSignatureCollectionAdminRemoveListArgs = {
  input: SignatureCollectionListIdInput
}

export type MutationSignatureCollectionAdminToggleListReviewArgs = {
  input: SignatureCollectionListIdInput
}

export type MutationSignatureCollectionAdminUnsignArgs = {
  input: SignatureCollectionSignatureIdInput
}

export type MutationSignatureCollectionAdminUpdatePaperSignaturePageNumberArgs = {
  input: SignatureCollectionSignatureUpdateInput
}

export type MutationSignatureCollectionAdminUploadPaperSignatureArgs = {
  input: SignatureCollectionUploadPaperSignatureInput
}

export type MutationSignatureCollectionCancelArgs = {
  input: SignatureCollectionCancelListsInput
}

export type MutationSignatureCollectionLockListArgs = {
  input: SignatureCollectionListIdInput
}

export type MutationSignatureCollectionUnsignArgs = {
  input: SignatureCollectionListIdWithTypeInput
}

export type MutationSignatureCollectionUpdatePaperSignaturePageNumberArgs = {
  input: SignatureCollectionSignatureUpdateInput
}

export type MutationSignatureCollectionUploadPaperSignatureArgs = {
  input: SignatureCollectionUploadPaperSignatureInput
}

export type MutationSubmitApplicationArgs = {
  input: SubmitApplicationInput
}

export type MutationSubmitFormSystemApplicationArgs = {
  input: FormSystemApplicationInput
}

export type MutationSubmitFormSystemScreenArgs = {
  input: SubmitFormSystemScreenInput
}

export type MutationTellUsAStoryArgs = {
  input: TellUsAStoryInput
}

export type MutationUpdateAdministrativeContactArgs = {
  administrativeContactId: Scalars['String']
  contact: UpdateContactInput
  organisationId: Scalars['String']
}

export type MutationUpdateApplicationArgs = {
  input: UpdateApplicationInput
  locale?: InputMaybe<Scalars['String']>
}

export type MutationUpdateApplicationExternalDataArgs = {
  input: UpdateApplicationExternalDataInput
  locale?: InputMaybe<Scalars['String']>
}

export type MutationUpdateAuthDelegationArgs = {
  input: UpdateAuthDelegationInput
}

export type MutationUpdateCurrentEmployerArgs = {
  input: UpdateCurrentEmployerInput
}

export type MutationUpdateDraftRegulationByIdArgs = {
  input: EditDraftRegulationInput
}

export type MutationUpdateDraftRegulationCancelArgs = {
  input: UpdateDraftRegulationCancelInput
}

export type MutationUpdateDraftRegulationChangeArgs = {
  input: UpdateDraftRegulationChangeInput
}

export type MutationUpdateEndpointArgs = {
  input: UpdateEndpointInput
}

export type MutationUpdateFormSystemApplicantArgs = {
  input: UpdateFormSystemApplicantInput
}

export type MutationUpdateFormSystemApplicationDependenciesArgs = {
  input: UpdateFormSystemApplicationDependenciesInput
}

export type MutationUpdateFormSystemFieldArgs = {
  input: FormSystemUpdateFieldInput
}

export type MutationUpdateFormSystemFieldsDisplayOrderArgs = {
  input: FormSystemUpdateFieldsDisplayOrderInput
}

export type MutationUpdateFormSystemFormArgs = {
  input: FormSystemUpdateFormInput
}

export type MutationUpdateFormSystemListItemArgs = {
  input: FormSystemUpdateListItemInput
}

export type MutationUpdateFormSystemListItemsDisplayOrderArgs = {
  input: FormSystemUpdateListItemsDisplayOrderInput
}

export type MutationUpdateFormSystemScreenArgs = {
  input: FormSystemUpdateScreenInput
}

export type MutationUpdateFormSystemScreensDisplayOrderArgs = {
  input: FormSystemUpdateScreensDisplayOrderInput
}

export type MutationUpdateFormSystemSectionArgs = {
  input: FormSystemUpdateSectionInput
}

export type MutationUpdateFormSystemSectionsDisplayOrderArgs = {
  input: FormSystemUpdateSectionsDisplayOrderInput
}

export type MutationUpdateHelpdeskArgs = {
  helpdesk: UpdateHelpdeskInput
  helpdeskId: Scalars['String']
  organisationId: Scalars['String']
}

export type MutationUpdateIcelandicNameByIdArgs = {
  input: UpdateIcelandicNameInput
}

export type MutationUpdateMunicipalitiesFinancialAidApplicationArgs = {
  input: MunicipalitiesFinancialAidUpdateApplicationInput
}

export type MutationUpdateOrganisationArgs = {
  id: Scalars['String']
  input: UpdateOrganisationInput
}

export type MutationUpdateProfileArgs = {
  input: UpdateUserProfileInput
}

export type MutationUpdateTechnicalContactArgs = {
  contact: UpdateContactInput
  organisationId: Scalars['String']
  technicalContactId: Scalars['String']
}

export type MutationUpdateTestEndpointArgs = {
  input: UpdateEndpointInput
}

export type MutationUserProfileUpdateActorProfileArgs = {
  input: UserProfileUpdateActorProfileInput
}

export type MutationVehicleBulkMileagePostArgs = {
  input: PostVehicleBulkMileageInput
}

export type MutationVehicleMileagePostArgs = {
  input: PostVehicleMileageInput
}

export type MutationVehicleMileagePostV2Args = {
  input: PostVehicleMileageInput
}

export type MutationVehicleMileagePutArgs = {
  input: PutVehicleMileageInput
}

export type MutationVehicleMileagePutV2Args = {
  input: PutVehicleMileageInput
}

export type MutationVerifyLicenseBarcodeArgs = {
  input: VerifyLicenseBarcodeInput
}

export type MutationVerifyPkPassArgs = {
  input: VerifyPkPassInput
}

export type MutationWatsonAssistantChatSubmitFeedbackArgs = {
  input: WatsonAssistantChatSubmitFeedbackInput
}

export type MyPlateOwnershipChecksByRegno = {
  __typename?: 'MyPlateOwnershipChecksByRegno'
  validationErrorMessages?: Maybe<Array<VehicleValidationErrorMessage>>
}

export type Namespace = {
  __typename?: 'Namespace'
  fields: Scalars['String']
  namespace: Scalars['String']
}

export type NationalRegistryAddress = {
  __typename?: 'NationalRegistryAddress'
  apartment?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  code?: Maybe<Scalars['ID']>
  lastUpdated?: Maybe<Scalars['String']>
  municipalityText?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
}

export type NationalRegistryBanMarking = {
  __typename?: 'NationalRegistryBanMarking'
  banMarked: Scalars['Boolean']
  startDate?: Maybe<Scalars['String']>
}

export type NationalRegistryBirthplace = {
  __typename?: 'NationalRegistryBirthplace'
  dateOfBirth?: Maybe<Scalars['DateTime']>
  location?: Maybe<Scalars['String']>
  municipalityCode?: Maybe<Scalars['String']>
  municipalityText?: Maybe<Scalars['String']>
}

export type NationalRegistryChild = {
  __typename?: 'NationalRegistryChild'
  birthday?: Maybe<Scalars['String']>
  birthplace?: Maybe<Scalars['String']>
  custody1?: Maybe<Scalars['String']>
  custody2?: Maybe<Scalars['String']>
  custodyText1?: Maybe<Scalars['String']>
  custodyText2?: Maybe<Scalars['String']>
  displayName?: Maybe<Scalars['String']>
  /** Deprecated */
  fate?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  fullName: Scalars['String']
  gender?: Maybe<Scalars['String']>
  genderDisplay?: Maybe<Scalars['String']>
  homeAddress?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  legalResidence?: Maybe<Scalars['String']>
  middleName?: Maybe<Scalars['String']>
  municipality?: Maybe<Scalars['String']>
  nameCustody1?: Maybe<Scalars['String']>
  nameCustody2?: Maybe<Scalars['String']>
  nameParent1?: Maybe<Scalars['String']>
  nameParent2?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
  nationality?: Maybe<Scalars['String']>
  parent1?: Maybe<Scalars['String']>
  parent2?: Maybe<Scalars['String']>
  postal?: Maybe<Scalars['String']>
  religion?: Maybe<Scalars['String']>
  surname?: Maybe<Scalars['String']>
}

export type NationalRegistryChildCustody = {
  __typename?: 'NationalRegistryChildCustody'
  details?: Maybe<NationalRegistryPerson>
  fullName?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
}

export type NationalRegistryCitizenship = {
  __typename?: 'NationalRegistryCitizenship'
  code: Scalars['ID']
  name: Scalars['String']
}

export type NationalRegistryCustodian = {
  __typename?: 'NationalRegistryCustodian'
  code?: Maybe<Scalars['String']>
  /** Deprecated */
  fate?: Maybe<Scalars['String']>
  /** @deprecated This might return the display name instead of true full name. Use name object instead. */
  fullName?: Maybe<Scalars['String']>
  livesWithChild?: Maybe<Scalars['Boolean']>
  nationalId: Scalars['ID']
  text?: Maybe<Scalars['String']>
}

export enum NationalRegistryGender {
  Female = 'FEMALE',
  FemaleMinor = 'FEMALE_MINOR',
  Male = 'MALE',
  MaleMinor = 'MALE_MINOR',
  Transgender = 'TRANSGENDER',
  TransgenderMinor = 'TRANSGENDER_MINOR',
  Unknown = 'UNKNOWN',
}

export type NationalRegistryHousing = {
  __typename?: 'NationalRegistryHousing'
  address?: Maybe<NationalRegistryAddress>
  domicileId: Scalars['ID']
  domicileIdLast1stOfDecember?: Maybe<Scalars['String']>
  domicileIdPreviousIcelandResidence?: Maybe<Scalars['String']>
  domicileInhabitants?: Maybe<Array<NationalRegistryPersonBase>>
  residence?: Maybe<NationalRegistryAddress>
}

export enum NationalRegistryMaritalStatus {
  Divorced = 'DIVORCED',
  ForeignResidenceMarriedToUnregisteredPerson = 'FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON',
  IcelandicResidenceMarriedToUnregisteredPerson = 'ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON',
  Married = 'MARRIED',
  MarriedLivingSeparately = 'MARRIED_LIVING_SEPARATELY',
  MarriedToForeignLawPerson = 'MARRIED_TO_FOREIGN_LAW_PERSON',
  Separated = 'SEPARATED',
  Unknown = 'UNKNOWN',
  Unmarried = 'UNMARRIED',
  Widowed = 'WIDOWED',
}

export type NationalRegistryName = {
  __typename?: 'NationalRegistryName'
  displayName?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  fullName?: Maybe<Scalars['String']>
  lastName?: Maybe<Scalars['String']>
  middleName?: Maybe<Scalars['String']>
}

export enum NationalRegistryNationalIdType {
  Deceased = 'DECEASED',
  NationalRegistryNationalId = 'NATIONAL_REGISTRY_NATIONAL_ID',
  SystemNationalId = 'SYSTEM_NATIONAL_ID',
  Unknown = 'UNKNOWN',
}

export type NationalRegistryPerson = {
  __typename?: 'NationalRegistryPerson'
  /** @deprecated Moving into the Housing object property */
  address?: Maybe<NationalRegistryAddress>
  /** @deprecated Up for removal. Easily calculated with the nationalId property */
  age?: Maybe<Scalars['Float']>
  /** @deprecated Renaming to expectionFromDirectMarketing */
  banMarking?: Maybe<NationalRegistryBanMarking>
  /** Unique string. Can be used for URLs. */
  baseId?: Maybe<Scalars['String']>
  biologicalChildren?: Maybe<Array<NationalRegistryChildCustody>>
  birthParents?: Maybe<Array<NationalRegistryPersonBase>>
  /** @deprecated Moving to the Birthplace object property containing more information */
  birthPlace?: Maybe<Scalars['String']>
  /** @deprecated Up for removal. Easily calculated with the nationalId property */
  birthday?: Maybe<Scalars['DateTime']>
  birthplace?: Maybe<NationalRegistryBirthplace>
  childCustody?: Maybe<Array<NationalRegistryChildCustody>>
  citizenship?: Maybe<NationalRegistryCitizenship>
  custodians?: Maybe<Array<NationalRegistryCustodian>>
  exceptionFromDirectMarketing?: Maybe<Scalars['Boolean']>
  /** @deprecated Moving to housing -> domicileId since the familyNr naming is outdated */
  familyNr?: Maybe<Scalars['String']>
  /** Deprecated */
  fate?: Maybe<Scalars['String']>
  /** @deprecated Moving to name object property */
  firstName?: Maybe<Scalars['String']>
  /** @deprecated This might return the display name instead of true full name. Use name object instead. */
  fullName?: Maybe<Scalars['String']>
  gender?: Maybe<NationalRegistryGender>
  housing?: Maybe<NationalRegistryHousing>
  /** @deprecated Moving to name object property */
  lastName?: Maybe<Scalars['String']>
  /** @deprecated Moving to the housing object property as a couple of object properties */
  legalResidence?: Maybe<Scalars['String']>
  maritalStatus?: Maybe<NationalRegistryMaritalStatus>
  /** @deprecated Moving to name object property */
  middleName?: Maybe<Scalars['String']>
  name?: Maybe<NationalRegistryName>
  nationalId: Scalars['ID']
  nationalIdType?: Maybe<NationalRegistryNationalIdType>
  religion?: Maybe<Scalars['String']>
  spouse?: Maybe<NationalRegistrySpouse>
}

export type NationalRegistryPersonBiologicalChildrenArgs = {
  childNationalId?: InputMaybe<Scalars['String']>
}

export type NationalRegistryPersonChildCustodyArgs = {
  childNationalId?: InputMaybe<Scalars['String']>
}

export type NationalRegistryPersonBase = {
  __typename?: 'NationalRegistryPersonBase'
  /** Deprecated */
  fate?: Maybe<Scalars['String']>
  /** @deprecated This might return the display name instead of true full name. Use name object instead. */
  fullName?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
}

export type NationalRegistryReligion = {
  __typename?: 'NationalRegistryReligion'
  code?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type NationalRegistryResidence = {
  __typename?: 'NationalRegistryResidence'
  address: NationalRegistryXRoadAddress
  country?: Maybe<Scalars['String']>
  dateOfChange?: Maybe<Scalars['DateTime']>
  houseIdentificationCode?: Maybe<Scalars['String']>
  realEstateNumber?: Maybe<Scalars['String']>
}

export type NationalRegistrySpouse = {
  __typename?: 'NationalRegistrySpouse'
  cohabitant?: Maybe<Scalars['String']>
  cohabitationWithSpouse?: Maybe<Scalars['Boolean']>
  /** Deprecated */
  fate?: Maybe<Scalars['String']>
  /** @deprecated This might return the display name instead of true full name. Use name object instead. */
  fullName?: Maybe<Scalars['String']>
  maritalStatus?: Maybe<Scalars['String']>
  /** @deprecated Renaming to fullName */
  name?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
}

export type NationalRegistryUser = {
  __typename?: 'NationalRegistryUser'
  address?: Maybe<NationalRegistryAddress>
  age: Scalars['Float']
  banMarking?: Maybe<NationalRegistryBanMarking>
  birthPlace?: Maybe<Scalars['String']>
  birthday: Scalars['DateTime']
  citizenship?: Maybe<NationalRegistryCitizenship>
  familyNr?: Maybe<Scalars['String']>
  firstName?: Maybe<Scalars['String']>
  fullName: Scalars['String']
  gender?: Maybe<NationalRegistryGender>
  lastName?: Maybe<Scalars['String']>
  legalResidence?: Maybe<Scalars['String']>
  maritalStatus?: Maybe<NationalRegistryMaritalStatus>
  middleName?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
  religion?: Maybe<Scalars['String']>
  spouse?: Maybe<NationalRegistrySpouse>
}

export type NationalRegistryXRoadAddress = {
  __typename?: 'NationalRegistryXRoadAddress'
  city?: Maybe<Scalars['String']>
  municipalityCode?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetName: Scalars['String']
}

export type NationalRegistryXRoadBirthplace = {
  __typename?: 'NationalRegistryXRoadBirthplace'
  dateOfBirth: Scalars['DateTime']
  location?: Maybe<Scalars['String']>
  municipalityCode?: Maybe<Scalars['String']>
}

export type NationalRegistryXRoadChildGuardianship = {
  __typename?: 'NationalRegistryXRoadChildGuardianship'
  childNationalId: Scalars['ID']
  legalDomicileParent?: Maybe<Array<Scalars['String']>>
  residenceParent?: Maybe<Array<Scalars['String']>>
}

export type NationalRegistryXRoadChildGuardianshipInput = {
  childNationalId: Scalars['String']
}

export type NationalRegistryXRoadCitizenship = {
  __typename?: 'NationalRegistryXRoadCitizenship'
  code: Scalars['String']
  name?: Maybe<Scalars['String']>
}

export type NationalRegistryXRoadPerson = {
  __typename?: 'NationalRegistryXRoadPerson'
  address?: Maybe<NationalRegistryXRoadAddress>
  birthplace?: Maybe<NationalRegistryXRoadBirthplace>
  children?: Maybe<Array<NationalRegistryXRoadPerson>>
  citizenship?: Maybe<NationalRegistryXRoadCitizenship>
  fullName: Scalars['String']
  genderCode: Scalars['String']
  livesWithApplicant?: Maybe<Scalars['Boolean']>
  livesWithBothParents?: Maybe<Scalars['Boolean']>
  nationalId: Scalars['ID']
  otherParent?: Maybe<NationalRegistryXRoadPerson>
  residenceHistory?: Maybe<Array<NationalRegistryResidence>>
  spouse?: Maybe<NationalRegistryXRoadSpouse>
}

export type NationalRegistryXRoadSpouse = {
  __typename?: 'NationalRegistryXRoadSpouse'
  maritalStatus?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['ID']>
}

export type News = {
  __typename?: 'News'
  content?: Maybe<Array<Slice>>
  date: Scalars['String']
  featuredImage?: Maybe<Image>
  fullWidthImageInContent?: Maybe<Scalars['Boolean']>
  genericTags: Array<GenericTag>
  id: Scalars['ID']
  image?: Maybe<Image>
  initialPublishDate?: Maybe<Scalars['String']>
  intro?: Maybe<Scalars['String']>
  organization?: Maybe<Organization>
  signLanguageVideo?: Maybe<EmbeddedVideo>
  slug: Scalars['String']
  subtitle: Scalars['String']
  title: Scalars['String']
}

export type NewsList = {
  __typename?: 'NewsList'
  items: Array<News>
  total: Scalars['Int']
}

export type NextInspection = {
  __typename?: 'NextInspection'
  nextInspectionDate?: Maybe<Scalars['DateTime']>
  nextInspectionDateIfPassedInspectionToday?: Maybe<Scalars['DateTime']>
}

export type Notification = {
  __typename?: 'Notification'
  id: Scalars['Int']
  message: NotificationMessage
  metadata: NotificationMetadata
  notificationId: Scalars['ID']
  recipient: NotificationRecipient
  sender: NotificationSender
}

export type NotificationLink = {
  __typename?: 'NotificationLink'
  url?: Maybe<Scalars['String']>
}

export type NotificationMessage = {
  __typename?: 'NotificationMessage'
  body: Scalars['String']
  dataCopy?: Maybe<Scalars['String']>
  /** Displays the {dataCopy} by default, will display {body} as fallback */
  displayBody: Scalars['String']
  link: NotificationLink
  title: Scalars['String']
}

export type NotificationMetadata = {
  __typename?: 'NotificationMetadata'
  created?: Maybe<Scalars['DateTime']>
  read?: Maybe<Scalars['Boolean']>
  seen?: Maybe<Scalars['Boolean']>
  sent: Scalars['DateTime']
  updated?: Maybe<Scalars['DateTime']>
}

export type NotificationRecipient = {
  __typename?: 'NotificationRecipient'
  nationalId?: Maybe<Scalars['String']>
}

export type NotificationResponse = {
  __typename?: 'NotificationResponse'
  data: Notification
}

export type NotificationSender = {
  __typename?: 'NotificationSender'
  id?: Maybe<Scalars['String']>
  logoUrl?: Maybe<Scalars['String']>
}

export type Notifications = {
  __typename?: 'Notifications'
  data: Array<Notification>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
  unreadCount?: Maybe<Scalars['Int']>
  unseenCount?: Maybe<Scalars['Int']>
}

export type NotificationsInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Int']>
}

export type NotificationsMarkAllAsReadResponse = {
  __typename?: 'NotificationsMarkAllAsReadResponse'
  success: Scalars['Boolean']
}

export type NotificationsMarkAllAsSeenResponse = {
  __typename?: 'NotificationsMarkAllAsSeenResponse'
  success: Scalars['Boolean']
}

export type NumberBullet = {
  __typename?: 'NumberBullet'
  body: Scalars['String']
  id: Scalars['ID']
  title: Scalars['String']
}

export type NumberBulletGroup = {
  __typename?: 'NumberBulletGroup'
  bullets: Array<NumberBullet>
  defaultVisible: Scalars['Int']
  id: Scalars['ID']
}

export type OjoiaApplicationCaseResponse = {
  __typename?: 'OJOIAApplicationCaseResponse'
  categories: Array<Scalars['String']>
  communicationStatus: Scalars['String']
  department: Scalars['String']
  html: Scalars['String']
  status: Scalars['String']
  type: Scalars['String']
}

export type OjoiaComment = {
  __typename?: 'OJOIAComment'
  action: OjoiCommentActionEnum
  age: Scalars['String']
  comment?: Maybe<Scalars['String']>
  creator: Scalars['String']
  direction: OjoiCommentDirection
  id: Scalars['ID']
  receiver?: Maybe<Scalars['String']>
}

export type OjoiaGetCommentsInput = {
  id: Scalars['ID']
}

export type OjoiaGetCommentsResponse = {
  __typename?: 'OJOIAGetCommentsResponse'
  comments: Array<OjoiaComment>
}

export type OjoiaGetPdfResponse = {
  __typename?: 'OJOIAGetPdfResponse'
  pdf: Scalars['String']
}

/** Input dto that represents the id of the application */
export type OjoiaIdInput = {
  id: Scalars['ID']
  showDate?: InputMaybe<Scalars['Boolean']>
}

export type OjoiaPostCommentInput = {
  comment: Scalars['String']
  id: Scalars['ID']
}

export enum OjoiCommentActionEnum {
  Application = 'APPLICATION',
  External = 'EXTERNAL',
}

export enum OjoiCommentDirection {
  Received = 'RECEIVED',
  Sent = 'SENT',
}

export type OccupationalLicense = {
  __typename?: 'OccupationalLicense'
  dateOfBirth?: Maybe<Scalars['DateTime']>
  genericFields?: Maybe<Array<OccupationalLicensesGenericField>>
  issuer?: Maybe<Scalars['String']>
  issuerTitle?: Maybe<Scalars['String']>
  legalEntityId?: Maybe<Scalars['String']>
  licenseHolderName?: Maybe<Scalars['String']>
  licenseHolderNationalId?: Maybe<Scalars['String']>
  licenseId: Scalars['String']
  licenseNumber?: Maybe<Scalars['String']>
  permit?: Maybe<Scalars['String']>
  profession?: Maybe<Scalars['String']>
  status: OccupationalLicenseStatus
  title?: Maybe<Scalars['String']>
  type: OccupationalLicenseLicenseType
  validFrom: Scalars['DateTime']
}

export enum OccupationalLicenseStatus {
  Invalid = 'INVALID',
  InProgress = 'IN_PROGRESS',
  Limited = 'LIMITED',
  Revoked = 'REVOKED',
  Unknown = 'UNKNOWN',
  Valid = 'VALID',
  Waived = 'WAIVED',
}

export type OccupationalLicensesError = {
  __typename?: 'OccupationalLicensesError'
  /** The error, raw */
  error?: Maybe<Scalars['String']>
  type: OccupationalLicenseLicenseType
}

export type OccupationalLicensesGenericField = {
  __typename?: 'OccupationalLicensesGenericField'
  title: Scalars['String']
  value: Scalars['String']
}

export type OccupationalLicensesLicenseInput = {
  id: Scalars['String']
  locale: Scalars['String']
}

export type OccupationalLicensesLicenseResponse = {
  __typename?: 'OccupationalLicensesLicenseResponse'
  actions?: Maybe<Array<OccupationalLicensesLink>>
  footerText?: Maybe<Scalars['String']>
  headerText?: Maybe<Scalars['String']>
  license: OccupationalLicense
}

export type OccupationalLicensesLicenseResult =
  | OccupationalLicense
  | OccupationalLicensesError

export type OccupationalLicensesLicenses = {
  __typename?: 'OccupationalLicensesLicenses'
  licenses: Array<OccupationalLicensesLicenseResult>
}

export type OccupationalLicensesLink = {
  __typename?: 'OccupationalLicensesLink'
  text: Scalars['String']
  type: OccupationalLicensesLinkType
  url: Scalars['String']
}

export enum OccupationalLicensesLinkType {
  Document = 'DOCUMENT',
  File = 'FILE',
  Link = 'LINK',
}

export type OfficialJournalOfIcelandAdvert = {
  __typename?: 'OfficialJournalOfIcelandAdvert'
  categories: Array<OfficialJournalOfIcelandAdvertEntity>
  corrections?: Maybe<Array<OfficialJournalOfIcelandAdvertCorrections>>
  createdDate: Scalars['String']
  department: OfficialJournalOfIcelandAdvertEntity
  document: OfficialJournalOfIcelandAdvertDocument
  id: Scalars['ID']
  involvedParty: OfficialJournalOfIcelandAdvertEntity
  publicationDate: Scalars['String']
  publicationNumber: OfficialJournalOfIcelandAdvertPublicationNumber
  signatureDate: Scalars['String']
  status: OfficialJournalOfIcelandAdvertStatus
  subject: Scalars['String']
  title: Scalars['String']
  type: OfficialJournalOfIcelandAdvertType
  updatedDate: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertCategory = {
  __typename?: 'OfficialJournalOfIcelandAdvertCategory'
  department?: Maybe<OfficialJournalOfIcelandAdvertEntity>
  id: Scalars['ID']
  mainCategory?: Maybe<OfficialJournalOfIcelandAdvertMainCategory>
  slug: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertCorrections = {
  __typename?: 'OfficialJournalOfIcelandAdvertCorrections'
  advertId: Scalars['String']
  createdDate: Scalars['String']
  description: Scalars['String']
  documentPdfUrl?: Maybe<Scalars['String']>
  id: Scalars['ID']
  isLegacy?: Maybe<Scalars['Boolean']>
  legacyDate?: Maybe<Scalars['String']>
  title: Scalars['String']
  updatedDate: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertDocument = {
  __typename?: 'OfficialJournalOfIcelandAdvertDocument'
  html: Scalars['String']
  isLegacy: Scalars['Boolean']
  pdfUrl?: Maybe<Scalars['String']>
}

export type OfficialJournalOfIcelandAdvertEntity = {
  __typename?: 'OfficialJournalOfIcelandAdvertEntity'
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertMainCategory = {
  __typename?: 'OfficialJournalOfIcelandAdvertMainCategory'
  categories: Array<OfficialJournalOfIcelandAdvertCategory>
  departmentId: Scalars['String']
  description: Scalars['String']
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertPublicationNumber = {
  __typename?: 'OfficialJournalOfIcelandAdvertPublicationNumber'
  full: Scalars['String']
  number: Scalars['Int']
  year: Scalars['Int']
}

export type OfficialJournalOfIcelandAdvertResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertResponse'
  advert: OfficialJournalOfIcelandAdvert
}

export type OfficialJournalOfIcelandAdvertSimilar = {
  __typename?: 'OfficialJournalOfIcelandAdvertSimilar'
  categories: Array<OfficialJournalOfIcelandAdvertEntity>
  department: OfficialJournalOfIcelandAdvertEntity
  id: Scalars['ID']
  involvedParty: OfficialJournalOfIcelandAdvertEntity
  publicationDate: Scalars['String']
  publicationNumber: OfficialJournalOfIcelandAdvertPublicationNumber
  subject: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertSimilarParams = {
  id: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertSimilarResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertSimilarResponse'
  adverts: Array<OfficialJournalOfIcelandAdvertSimilar>
}

export type OfficialJournalOfIcelandAdvertSingleParams = {
  id: Scalars['String']
}

export enum OfficialJournalOfIcelandAdvertStatus {
  Afturkllu = 'Afturkllu',
  Bi = 'Bi',
  Drg = 'Drg',
  EldriAuglsing = 'EldriAuglsing',
  Hafna = 'Hafna',
  Innsend = 'Innsend',
  Tgefin = 'Tgefin',
  TilbinTilTgfu = 'TilbinTilTgfu',
  Vinnslu = 'Vinnslu',
  Virk = 'Virk',
}

export type OfficialJournalOfIcelandAdvertTemplateInput = {
  type: OfficialJournalOfIcelandApplicationAdvertTemplateTypeEnum
}

export type OfficialJournalOfIcelandAdvertType = {
  __typename?: 'OfficialJournalOfIcelandAdvertType'
  department?: Maybe<OfficialJournalOfIcelandAdvertEntity>
  id: Scalars['ID']
  slug: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandAdvertsCategoryResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsCategoryResponse'
  categories: Array<OfficialJournalOfIcelandAdvertCategory>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandAdvertsDepartmentResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsDepartmentResponse'
  department: OfficialJournalOfIcelandAdvertEntity
}

export type OfficialJournalOfIcelandAdvertsDepartmentsResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsDepartmentsResponse'
  departments: Array<OfficialJournalOfIcelandAdvertEntity>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandAdvertsInput = {
  category?: InputMaybe<Array<Scalars['String']>>
  dateFrom?: InputMaybe<Scalars['String']>
  dateTo?: InputMaybe<Scalars['String']>
  department?: InputMaybe<Array<Scalars['String']>>
  involvedParty?: InputMaybe<Array<Scalars['String']>>
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  search?: InputMaybe<Scalars['String']>
  type?: InputMaybe<Array<Scalars['String']>>
}

export type OfficialJournalOfIcelandAdvertsInstitutionsResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsInstitutionsResponse'
  institutions: Array<OfficialJournalOfIcelandAdvertEntity>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandAdvertsMainCategoriesResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsMainCategoriesResponse'
  mainCategories: Array<OfficialJournalOfIcelandAdvertMainCategory>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandAdvertsMainType = {
  __typename?: 'OfficialJournalOfIcelandAdvertsMainType'
  department: OfficialJournalOfIcelandAdvertEntity
  id: Scalars['String']
  slug: Scalars['String']
  title: Scalars['String']
  types: Array<OfficialJournalOfIcelandAdvertType>
}

export type OfficialJournalOfIcelandAdvertsResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsResponse'
  adverts: Array<OfficialJournalOfIcelandAdvert>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandAdvertsTypeResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsTypeResponse'
  type: OfficialJournalOfIcelandAdvertType
}

export type OfficialJournalOfIcelandAdvertsTypesResponse = {
  __typename?: 'OfficialJournalOfIcelandAdvertsTypesResponse'
  paging: OfficialJournalOfIcelandPaging
  types: Array<OfficialJournalOfIcelandAdvertType>
}

export type OfficialJournalOfIcelandApplicationAddApplicationAttachmentInput = {
  applicationId: Scalars['String']
  attachmentType: Scalars['String']
  fileExtension: Scalars['String']
  fileFormat: Scalars['String']
  fileLocation: Scalars['String']
  fileName: Scalars['String']
  fileSize: Scalars['Int']
  originalFileName: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationAddApplicationAttachmentResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationAddApplicationAttachmentResponse'
  success: Scalars['Boolean']
}

export type OfficialJournalOfIcelandApplicationDeleteApplicationAttachmentInput = {
  applicationId: Scalars['String']
  key: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetApplicationAttachmentInput = {
  applicationId: Scalars['String']
  attachmentType: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetApplicationAttachmentResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetApplicationAttachmentResponse'
  fileExtension: Scalars['String']
  fileFormat: Scalars['String']
  fileLocation: Scalars['String']
  fileName: Scalars['String']
  fileSize: Scalars['Int']
  id: Scalars['String']
  originalFileName: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetApplicationAttachments = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetApplicationAttachments'
  attachments: Array<OfficialJournalOfIcelandApplicationGetApplicationAttachmentResponse>
}

export type OfficialJournalOfIcelandApplicationGetMyUserInfoResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetMyUserInfoResponse'
  /** The email of the user */
  email: Scalars['String']
  /** The first name of the user */
  firstName: Scalars['String']
  /** The last name of the user */
  lastName: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetPdfUrlResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetPdfUrlResponse'
  url: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetPresignedUrlInput = {
  applicationId: Scalars['String']
  attachmentType: Scalars['String']
  fileName: Scalars['String']
  fileType: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetPresignedUrlResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetPresignedUrlResponse'
  cdn?: Maybe<Scalars['String']>
  key?: Maybe<Scalars['String']>
  url: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationGetPriceResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetPriceResponse'
  price: Scalars['Int']
}

export type OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse'
  involvedParties: Array<OfficialJournalOfIcelandApplicationGetUserInvolvedParty>
}

export type OfficialJournalOfIcelandApplicationGetUserInvolvedParty = {
  __typename?: 'OfficialJournalOfIcelandApplicationGetUserInvolvedParty'
  /** The id of the involved party */
  id: Scalars['String']
  /** The slug of the involved party */
  slug: Scalars['String']
  /** The title of the involved party */
  title: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationInvolvedPartySignature = {
  __typename?: 'OfficialJournalOfIcelandApplicationInvolvedPartySignature'
  additionalSignature?: Maybe<Scalars['String']>
  chairman?: Maybe<OfficialJournalOfIcelandApplicationSignatureMember>
  institution: Scalars['String']
  members: Array<OfficialJournalOfIcelandApplicationSignatureMember>
  signatureDate: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse'
  records: Array<OfficialJournalOfIcelandApplicationInvolvedPartySignature>
  type: OfficialJournalOfIcelandApplicationSignatureType
}

export type OfficialJournalOfIcelandApplicationInvolvedPartySignaturesInput = {
  involvedPartyId: Scalars['String']
}

export type OfficialJournalOfIcelandApplicationPostCommentResponse = {
  __typename?: 'OfficialJournalOfIcelandApplicationPostCommentResponse'
  success: Scalars['Boolean']
}

export type OfficialJournalOfIcelandApplicationSignatureMember = {
  __typename?: 'OfficialJournalOfIcelandApplicationSignatureMember'
  above?: Maybe<Scalars['String']>
  after?: Maybe<Scalars['String']>
  before?: Maybe<Scalars['String']>
  below?: Maybe<Scalars['String']>
  name: Scalars['String']
}

export enum OfficialJournalOfIcelandApplicationSignatureType {
  Committee = 'Committee',
  Regular = 'Regular',
}

export type OfficialJournalOfIcelandCaseInProgress = {
  __typename?: 'OfficialJournalOfIcelandCaseInProgress'
  createdAt: Scalars['String']
  fastTrack: Scalars['Boolean']
  id: Scalars['ID']
  involvedParty: Scalars['String']
  requestedPublicationDate: Scalars['String']
  status: Scalars['String']
  title: Scalars['String']
}

export type OfficialJournalOfIcelandCasesInProgressResponse = {
  __typename?: 'OfficialJournalOfIcelandCasesInProgressResponse'
  cases: Array<OfficialJournalOfIcelandCaseInProgress>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandMainTypesInput = {
  department?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
}

export type OfficialJournalOfIcelandMainTypesResponse = {
  __typename?: 'OfficialJournalOfIcelandMainTypesResponse'
  mainTypes: Array<OfficialJournalOfIcelandAdvertsMainType>
  paging: OfficialJournalOfIcelandPaging
}

export type OfficialJournalOfIcelandPaging = {
  __typename?: 'OfficialJournalOfIcelandPaging'
  hasNextPage?: Maybe<Scalars['Boolean']>
  hasPreviousPage?: Maybe<Scalars['Boolean']>
  nextPage?: Maybe<Scalars['Float']>
  page: Scalars['Float']
  pageSize: Scalars['Float']
  previousPage?: Maybe<Scalars['Float']>
  totalItems: Scalars['Float']
  totalPages: Scalars['Float']
}

export type OfficialJournalOfIcelandQueryInput = {
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  search?: InputMaybe<Scalars['String']>
}

export type OfficialJournalOfIcelandTypesInput = {
  department?: InputMaybe<Scalars['String']>
  page?: InputMaybe<Scalars['Int']>
  pageSize?: InputMaybe<Scalars['Int']>
  search?: InputMaybe<Scalars['String']>
}

export type OneColumnText = {
  __typename?: 'OneColumnText'
  content?: Maybe<Array<Slice>>
  dividerOnTop?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  link?: Maybe<Link>
  showTitle?: Maybe<Scalars['Boolean']>
  title: Scalars['String']
}

export type OpenApi = {
  __typename?: 'OpenApi'
  spec: Scalars['String']
}

export type OpenDataPage = {
  __typename?: 'OpenDataPage'
  chartSectionTitle: Scalars['String']
  externalLinkCardSelection: LinkCardSection
  externalLinkSectionDescription: Scalars['String']
  externalLinkSectionImage?: Maybe<Image>
  externalLinkSectionTitle: Scalars['String']
  graphCards: Array<GraphCard>
  id: Scalars['ID']
  link: Scalars['String']
  linkTitle: Scalars['String']
  pageDescription: Scalars['String']
  pageHeaderGraph: GraphCard
  pageTitle: Scalars['String']
  statisticsCardsSection: Array<StatisticsCard>
}

export type OpenDataSubpage = {
  __typename?: 'OpenDataSubpage'
  fundDescription: Scalars['String']
  fundTitle: Scalars['String']
  graphCards: Array<GraphCard>
  id: Scalars['ID']
  organizationLogo?: Maybe<Image>
  pageTitle: Scalars['String']
  statisticsCards: Array<StatisticsCard>
}

export type OpenListInput = {
  changeEndorsmentListClosedDateDto: ChangeEndorsmentListClosedDateDto
  listId: Scalars['String']
}

export type OperatingLicense = {
  __typename?: 'OperatingLicense'
  alcoholWeekdayLicense?: Maybe<Scalars['String']>
  alcoholWeekdayOutdoorLicense?: Maybe<Scalars['String']>
  alcoholWeekendLicense?: Maybe<Scalars['String']>
  alcoholWeekendOutdoorLicense?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Float']>
  issuedBy?: Maybe<Scalars['String']>
  licenseHolder?: Maybe<Scalars['String']>
  licenseNumber?: Maybe<Scalars['String']>
  licenseResponsible?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  maximumNumberOfGuests?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  numberOfDiningGuests?: Maybe<Scalars['Float']>
  outdoorLicense?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  restaurantType?: Maybe<Scalars['String']>
  street?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  type2?: Maybe<Scalars['String']>
  validFrom?: Maybe<Scalars['DateTime']>
  validTo?: Maybe<Scalars['DateTime']>
}

export type OperatingLicensesCsv = {
  __typename?: 'OperatingLicensesCSV'
  value?: Maybe<Scalars['String']>
}

export enum OperatorAnonymityStatus {
  All = 'ALL',
  Some = 'SOME',
  Unknown = 'UNKNOWN',
}

export type OperatorChangeAnswers = {
  mainOperator?: InputMaybe<OperatorChangeAnswersMainOperator>
  oldOperators?: InputMaybe<Array<OperatorChangeAnswersOperators>>
  operators?: InputMaybe<Array<OperatorChangeAnswersOperators>>
  owner: OperatorChangeAnswersUser
  pickVehicle: OperatorChangeAnswersPickVehicle
  vehicleMileage: OperatorChangeAnswersVehicleMileage
}

export type OperatorChangeAnswersMainOperator = {
  nationalId: Scalars['String']
}

export type OperatorChangeAnswersOperators = {
  nationalId: Scalars['String']
  wasRemoved?: InputMaybe<Scalars['String']>
}

export type OperatorChangeAnswersPickVehicle = {
  plate: Scalars['String']
}

export type OperatorChangeAnswersPlateDelivery = {
  deliveryMethodIsDeliveryStation?: InputMaybe<Scalars['String']>
  deliveryStationTypeCode?: InputMaybe<Scalars['String']>
  includeRushFee?: InputMaybe<Array<Scalars['String']>>
}

export type OperatorChangeAnswersUser = {
  nationalId: Scalars['String']
}

export type OperatorChangeAnswersVehicleMileage = {
  value?: InputMaybe<Scalars['String']>
}

export type OperatorChangeValidation = {
  __typename?: 'OperatorChangeValidation'
  errorMessages?: Maybe<Array<OperatorChangeValidationMessage>>
  hasError: Scalars['Boolean']
}

export type OperatorChangeValidationMessage = {
  __typename?: 'OperatorChangeValidationMessage'
  defaultMessage?: Maybe<Scalars['String']>
  errorNo?: Maybe<Scalars['String']>
}

export enum Order {
  Asc = 'ASC',
  Desc = 'DESC',
}

export type Organisation = {
  __typename?: 'Organisation'
  address?: Maybe<Scalars['String']>
  administrativeContact?: Maybe<Contact>
  created: Scalars['DateTime']
  email?: Maybe<Scalars['String']>
  helpdesk?: Maybe<Helpdesk>
  id: Scalars['String']
  modified: Scalars['DateTime']
  name: Scalars['String']
  nationalId: Scalars['String']
  phoneNumber?: Maybe<Scalars['String']>
  providers?: Maybe<Array<Provider>>
  technicalContact?: Maybe<Contact>
}

export type Organization = {
  __typename?: 'Organization'
  description?: Maybe<Scalars['String']>
  email: Scalars['String']
  footerConfig?: Maybe<Scalars['JSON']>
  footerItems: Array<FooterItem>
  hasALandingPage?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  link?: Maybe<Scalars['String']>
  logo?: Maybe<Image>
  namespace?: Maybe<Namespace>
  newsBottomSlices?: Maybe<Array<EmailSignup>>
  phone: Scalars['String']
  publishedMaterialSearchFilterGenericTags: Array<GenericTag>
  referenceIdentifier?: Maybe<Scalars['String']>
  serviceWebEnabled?: Maybe<Scalars['Boolean']>
  serviceWebFeaturedImage?: Maybe<Image>
  serviceWebPopularQuestionCount?: Maybe<Scalars['Float']>
  serviceWebTitle?: Maybe<Scalars['String']>
  shortTitle: Scalars['String']
  showsUpOnTheOrganizationsPage?: Maybe<Scalars['Boolean']>
  slug: Scalars['String']
  tag: Array<OrganizationTag>
  title: Scalars['String']
  trackingDomain?: Maybe<Scalars['String']>
}

export type OrganizationFund = {
  __typename?: 'OrganizationFund'
  featuredImage?: Maybe<Image>
  id: Scalars['ID']
  link?: Maybe<ReferenceLink>
  parentOrganization: Organization
  title: Scalars['String']
}

export enum OrganizationModelTypeEnum {
  ChildCare = 'ChildCare',
  Municipality = 'Municipality',
  National = 'National',
  PrivateOwner = 'PrivateOwner',
  School = 'School',
}

export type OrganizationPage = {
  __typename?: 'OrganizationPage'
  alertBanner?: Maybe<AlertBanner>
  bottomSlices: Array<Slice>
  canBeFoundInSearchResults?: Maybe<Scalars['Boolean']>
  defaultHeaderImage?: Maybe<Image>
  description: Scalars['String']
  externalLinks?: Maybe<Array<Link>>
  featuredImage?: Maybe<Image>
  id: Scalars['ID']
  menuLinks: Array<LinkGroup>
  organization?: Maybe<Organization>
  secondaryMenu?: Maybe<LinkGroup>
  secondaryNewsTags?: Maybe<Array<GenericTag>>
  showPastEventsOption?: Maybe<Scalars['Boolean']>
  sidebarCards?: Maybe<Array<Slice>>
  slices: Array<Slice>
  slug: Scalars['String']
  theme: Scalars['String']
  themeProperties: OrganizationTheme
  title: Scalars['String']
  topLevelNavigation?: Maybe<OrganizationPageTopLevelNavigation>
}

export type OrganizationPageStandaloneSitemap = {
  __typename?: 'OrganizationPageStandaloneSitemap'
  childLinks: Array<OrganizationPageStandaloneSitemapLink>
}

export type OrganizationPageStandaloneSitemapLevel2 = {
  __typename?: 'OrganizationPageStandaloneSitemapLevel2'
  childCategories: Array<OrganizationPageStandaloneSitemapLevel2Category>
  label: Scalars['String']
}

export type OrganizationPageStandaloneSitemapLevel2Category = {
  __typename?: 'OrganizationPageStandaloneSitemapLevel2Category'
  childLinks: Array<OrganizationPageStandaloneSitemapLevel2Link>
  href?: Maybe<Scalars['String']>
  label: Scalars['String']
}

export type OrganizationPageStandaloneSitemapLevel2Link = {
  __typename?: 'OrganizationPageStandaloneSitemapLevel2Link'
  href: Scalars['String']
  label: Scalars['String']
}

export type OrganizationPageStandaloneSitemapLink = {
  __typename?: 'OrganizationPageStandaloneSitemapLink'
  description?: Maybe<Scalars['String']>
  href: Scalars['String']
  label: Scalars['String']
}

export type OrganizationPageTopLevelNavigation = {
  __typename?: 'OrganizationPageTopLevelNavigation'
  links: Array<OrganizationPageTopLevelNavigationLink>
}

export type OrganizationPageTopLevelNavigationLink = {
  __typename?: 'OrganizationPageTopLevelNavigationLink'
  href: Scalars['String']
  label: Scalars['String']
}

export type OrganizationParentSubpage = {
  __typename?: 'OrganizationParentSubpage'
  childLinks: Array<OrganizationSubpageLink>
  id: Scalars['ID']
  shortTitle?: Maybe<Scalars['String']>
  title: Scalars['String']
}

export type OrganizationParentSubpageList = {
  __typename?: 'OrganizationParentSubpageList'
  id: Scalars['ID']
  pageLinkVariant: OrganizationParentSubpageListVariant
  pageLinks: Array<OrganizationParentSubpageListPageLink>
  seeMoreLink?: Maybe<Link>
  title: Scalars['String']
}

export type OrganizationParentSubpageListPageLink = {
  __typename?: 'OrganizationParentSubpageListPageLink'
  href: Scalars['String']
  id: Scalars['ID']
  label: Scalars['String']
  pageLinkIntro: Scalars['String']
  thumbnailImageHref?: Maybe<Scalars['String']>
  tinyThumbnailImageHref?: Maybe<Scalars['String']>
}

export enum OrganizationParentSubpageListVariant {
  ProfileCardWithTitleAbove = 'ProfileCardWithTitleAbove',
  ServiceCard = 'ServiceCard',
}

export type OrganizationSubpage = {
  __typename?: 'OrganizationSubpage'
  bottomSlices?: Maybe<Array<Slice>>
  description?: Maybe<Array<Slice>>
  featuredImage?: Maybe<Image>
  id: Scalars['ID']
  intro?: Maybe<Scalars['String']>
  links?: Maybe<Array<Link>>
  organizationPage: OrganizationPage
  shortTitle?: Maybe<Scalars['String']>
  showTableOfContents: Scalars['Boolean']
  signLanguageVideo?: Maybe<EmbeddedVideo>
  sliceCustomRenderer?: Maybe<Scalars['String']>
  sliceExtraText?: Maybe<Scalars['String']>
  slices?: Maybe<Array<Slice>>
  slug: Scalars['String']
  title: Scalars['String']
  url: Array<Scalars['String']>
}

export type OrganizationSubpageLink = {
  __typename?: 'OrganizationSubpageLink'
  href: Scalars['String']
  id?: Maybe<Scalars['String']>
  label: Scalars['String']
}

export type OrganizationTag = {
  __typename?: 'OrganizationTag'
  id: Scalars['ID']
  title: Scalars['String']
}

export type OrganizationTags = {
  __typename?: 'OrganizationTags'
  items: Array<OrganizationTag>
}

export type OrganizationTheme = {
  __typename?: 'OrganizationTheme'
  backgroundColor?: Maybe<Scalars['String']>
  fullWidth?: Maybe<Scalars['Boolean']>
  gradientEndColor: Scalars['String']
  gradientStartColor: Scalars['String']
  imageIsFullHeight?: Maybe<Scalars['Boolean']>
  imageObjectFit?: Maybe<Scalars['String']>
  imageObjectPosition?: Maybe<Scalars['String']>
  imagePadding?: Maybe<Scalars['String']>
  mobileBackgroundColor?: Maybe<Scalars['String']>
  textColor?: Maybe<Scalars['String']>
  titleSectionPaddingLeft?: Maybe<Scalars['Int']>
  useGradientColor?: Maybe<Scalars['Boolean']>
}

export type Organizations = {
  __typename?: 'Organizations'
  items: Array<Organization>
}

export type OverviewLinks = {
  __typename?: 'OverviewLinks'
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  link?: Maybe<Link>
  linkData?: Maybe<OverviewLinksLinkData>
  overviewLinks: Array<IntroLinkImage>
  titleAbove?: Maybe<Scalars['String']>
}

export type OverviewLinksLinkData = {
  __typename?: 'OverviewLinksLinkData'
  categoryCardItems: Array<OverviewLinksLinkDataCategoryCardItem>
  variant: OverviewLinksLinkDataVariant
}

export type OverviewLinksLinkDataCategoryCardItem = {
  __typename?: 'OverviewLinksLinkDataCategoryCardItem'
  description: Scalars['String']
  href: Scalars['String']
  title: Scalars['String']
}

export enum OverviewLinksLinkDataVariant {
  CategoryCard = 'CategoryCard',
  IntroLinkImage = 'IntroLinkImage',
}

export type OwnerChangeAnswers = {
  buyer: OwnerChangeAnswersUser
  buyerCoOwnerAndOperator?: InputMaybe<Array<OwnerChangeAnswersBuyerOrCoOwner>>
  buyerMainOperator?: InputMaybe<OwnerChangeAnswersMainOperator>
  insurance?: InputMaybe<OwnerChangeAnswersInsurance>
  pickVehicle: OwnerChangeAnswersPickVehicle
  seller: OwnerChangeAnswersUser
  vehicle: OwnerChangeAnswersVehicle
  vehicleMileage: OwnerChangeAnswersVehicleMileage
}

export type OwnerChangeAnswersBuyerOrCoOwner = {
  email: Scalars['String']
  nationalId: Scalars['String']
  type: Scalars['String']
  wasRemoved?: InputMaybe<Scalars['String']>
}

export type OwnerChangeAnswersInsurance = {
  value: Scalars['String']
}

export type OwnerChangeAnswersMainOperator = {
  nationalId: Scalars['String']
}

export type OwnerChangeAnswersPickVehicle = {
  plate: Scalars['String']
}

export type OwnerChangeAnswersUser = {
  email: Scalars['String']
  nationalId: Scalars['String']
}

export type OwnerChangeAnswersVehicle = {
  date: Scalars['String']
  salePrice?: InputMaybe<Scalars['String']>
}

export type OwnerChangeAnswersVehicleMileage = {
  value?: InputMaybe<Scalars['String']>
}

export type OwnerChangeValidation = {
  __typename?: 'OwnerChangeValidation'
  errorMessages?: Maybe<Array<OwnerChangeValidationMessage>>
  hasError: Scalars['Boolean']
}

export type OwnerChangeValidationMessage = {
  __typename?: 'OwnerChangeValidationMessage'
  defaultMessage?: Maybe<Scalars['String']>
  errorNo?: Maybe<Scalars['String']>
}

export type Page =
  | AnchorPage
  | Article
  | ArticleCategory
  | LifeEventPage
  | News
  | OrganizationPage
  | OrganizationSubpage
  | ProjectPage
  | SubArticle

export type PageInfo = {
  __typename?: 'PageInfo'
  nextCursor?: Maybe<Scalars['String']>
}

export type PageInfoDto = {
  __typename?: 'PageInfoDto'
  endCursor?: Maybe<Scalars['String']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage?: Maybe<Scalars['Boolean']>
  startCursor?: Maybe<Scalars['String']>
}

export type PageInfoResponse = {
  __typename?: 'PageInfoResponse'
  endCursor?: Maybe<Scalars['String']>
  hasNextPage: Scalars['Boolean']
  hasPreviousPage: Scalars['Boolean']
  startCursor?: Maybe<Scalars['String']>
}

export type PaginatedEndorsementInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
  listId: Scalars['String']
}

export type PaginatedEndorsementListInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
  tags: Array<EndorsementListControllerFindByTagsTagsEnum>
}

export type PaginatedEndorsementListResponse = {
  __typename?: 'PaginatedEndorsementListResponse'
  data: Array<EndorsementList>
  pageInfo: PageInfoResponse
  totalCount: Scalars['Float']
}

export type PaginatedEndorsementResponse = {
  __typename?: 'PaginatedEndorsementResponse'
  data: Array<Endorsement>
  pageInfo: PageInfoResponse
  totalCount: Scalars['Float']
}

export type PaginatedOperatingLicenses = {
  __typename?: 'PaginatedOperatingLicenses'
  paginationInfo: PaginationInfo
  results: Array<OperatingLicense>
  searchQuery?: Maybe<Scalars['String']>
}

export type PaginationInfo = {
  __typename?: 'PaginationInfo'
  currentPage?: Maybe<Scalars['Float']>
  hasNext?: Maybe<Scalars['Boolean']>
  hasPrevious?: Maybe<Scalars['Boolean']>
  pageNumber?: Maybe<Scalars['Float']>
  pageSize?: Maybe<Scalars['Float']>
  totalCount?: Maybe<Scalars['Float']>
  totalPages?: Maybe<Scalars['Float']>
}

export type PagingData = {
  __typename?: 'PagingData'
  hasNextPage?: Maybe<Scalars['Boolean']>
  hasPreviousPage?: Maybe<Scalars['Boolean']>
  offset?: Maybe<Scalars['Float']>
  page?: Maybe<Scalars['Float']>
  pageSize?: Maybe<Scalars['Float']>
  total?: Maybe<Scalars['Float']>
  totalPages?: Maybe<Scalars['Float']>
}

export type PaperMailBody = {
  __typename?: 'PaperMailBody'
  nationalId: Scalars['String']
  wantsPaper: Scalars['Boolean']
}

export type ParentalLeave = {
  __typename?: 'ParentalLeave'
  adoptionDate?: Maybe<Scalars['String']>
  applicant: Scalars['String']
  applicationFundId?: Maybe<Scalars['String']>
  applicationId: Scalars['ID']
  attachments?: Maybe<Array<ParentalLeaveAttachment>>
  dateOfBirth?: Maybe<Scalars['String']>
  email: Scalars['String']
  employers: Array<ParentalLeaveEmployer>
  expectedDateOfBirth?: Maybe<Scalars['String']>
  language: Scalars['String']
  noOfChildren?: Maybe<Scalars['String']>
  otherParentId?: Maybe<Scalars['String']>
  paymentInfo: ParentalLeavePaymentInfo
  periods: Array<ParentalLeavePeriod>
  phoneNumber: Scalars['String']
  rightsCode?: Maybe<Scalars['String']>
  status: Scalars['String']
  testData?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type ParentalLeaveAttachment = {
  __typename?: 'ParentalLeaveAttachment'
  attachmentBytes: Scalars['String']
  attachmentType: Scalars['String']
}

export type ParentalLeaveEmployer = {
  __typename?: 'ParentalLeaveEmployer'
  email?: Maybe<Scalars['String']>
  nationalRegistryId: Scalars['String']
}

export type ParentalLeaveEntitlement = {
  __typename?: 'ParentalLeaveEntitlement'
  independentMonths: Scalars['Float']
  transferableMonths: Scalars['Float']
}

export type ParentalLeavePaymentInfo = {
  __typename?: 'ParentalLeavePaymentInfo'
  bankAccount: Scalars['String']
  pensionFund: ParentalLeavePensionFund
  personalAllowance: Scalars['Float']
  personalAllowanceFromSpouse: Scalars['Float']
  privatePensionFund: ParentalLeavePensionFund
  privatePensionFundRatio: Scalars['Float']
  union: ParentalLeaveUnion
}

export type ParentalLeavePaymentPlan = {
  __typename?: 'ParentalLeavePaymentPlan'
  estimatePayment: Scalars['Float']
  estimatedAmount: Scalars['Float']
  pensionAmount: Scalars['Float']
  period: ParentalLeavePeriod
  privatePensionAmount: Scalars['Float']
  taxAmount: Scalars['Float']
  unionAmount: Scalars['Float']
}

export type ParentalLeavePensionFund = {
  __typename?: 'ParentalLeavePensionFund'
  id: Scalars['String']
  name: Scalars['String']
}

export type ParentalLeavePeriod = {
  __typename?: 'ParentalLeavePeriod'
  approved: Scalars['Boolean']
  from: Scalars['String']
  paid: Scalars['Boolean']
  ratio: Scalars['String']
  rightsCodePeriod?: Maybe<Scalars['String']>
  to: Scalars['String']
}

export type ParentalLeavePeriodEndDate = {
  __typename?: 'ParentalLeavePeriodEndDate'
  periodEndDate: Scalars['Float']
}

export type ParentalLeavePeriodLength = {
  __typename?: 'ParentalLeavePeriodLength'
  periodLength: Scalars['Int']
}

export type ParentalLeaveUnion = {
  __typename?: 'ParentalLeaveUnion'
  id: Scalars['String']
  name: Scalars['String']
}

export type Passport = {
  __typename?: 'Passport'
  childPassports?: Maybe<Array<IdentityDocumentModelChild>>
  userPassport?: Maybe<IdentityDocumentModel>
}

export type PatchAuthConsentInput = {
  clientId: Scalars['String']
  consentedScope?: InputMaybe<Scalars['String']>
  rejectedScope?: InputMaybe<Scalars['String']>
}

export type PatchAuthDelegationInput = {
  delegationId: Scalars['String']
  deleteScopes?: InputMaybe<Array<Scalars['String']>>
  updateScopes?: InputMaybe<Array<AuthDelegationScopeInput>>
}

export type Payload = {
  __typename?: 'Payload'
  /** Data parsed into a standard format */
  data: Array<GenericLicenseDataField>
  metadata: GenericUserLicenseMetadata
  /** Raw JSON data */
  rawData?: Maybe<Scalars['JSON']>
}

export type PaymentCatalogInput = {
  performingOrganizationID?: InputMaybe<Scalars['String']>
}

export type PaymentCatalogItem = {
  __typename?: 'PaymentCatalogItem'
  chargeItemCode: Scalars['String']
  chargeItemName: Scalars['String']
  chargeType: Scalars['String']
  performingOrgID: Scalars['String']
  priceAmount: Scalars['Float']
}

export type PaymentCatalogResponse = {
  __typename?: 'PaymentCatalogResponse'
  items: Array<PaymentCatalogItem>
}

export type PaymentSchedule = {
  __typename?: 'PaymentSchedule'
  approvalDate: Scalars['String']
  documentID?: Maybe<Scalars['String']>
  downloadServiceURL: Scalars['String']
  paymentCount: Scalars['String']
  scheduleName: Scalars['String']
  scheduleNumber: Scalars['String']
  scheduleStatus: Scalars['String']
  scheduleType: Scalars['String']
  totalAmount: Scalars['Float']
  unpaidAmount: Scalars['Float']
  unpaidCount: Scalars['String']
  unpaidWithInterest: Scalars['Float']
}

export type PaymentScheduleCharge = {
  __typename?: 'PaymentScheduleCharge'
  expenses: Scalars['Float']
  id: Scalars['String']
  intrest: Scalars['Float']
  name: Scalars['String']
  principal: Scalars['Float']
  total: Scalars['Float']
}

export type PaymentScheduleCompanyConditions = {
  __typename?: 'PaymentScheduleCompanyConditions'
  accommodationTaxReturns: Scalars['Boolean']
  citReturns: Scalars['Boolean']
  collectionActions: Scalars['Boolean']
  doNotOwe: Scalars['Boolean']
  financialStatement: Scalars['Boolean']
  maxDebt: Scalars['Boolean']
  maxDebtAmount: Scalars['Float']
  maxPayment: Scalars['Float']
  minPayment: Scalars['Float']
  nationalId: Scalars['ID']
  taxReturns: Scalars['Boolean']
  totalDebtAmount: Scalars['Float']
  vatReturns: Scalars['Boolean']
  withholdingTaxReturns: Scalars['Boolean']
}

export type PaymentScheduleConditions = {
  __typename?: 'PaymentScheduleConditions'
  accommodationTaxReturns: Scalars['Boolean']
  alimony: Scalars['Float']
  citReturns: Scalars['Boolean']
  collectionActions: Scalars['Boolean']
  disposableIncome: Scalars['Float']
  doNotOwe: Scalars['Boolean']
  maxDebt: Scalars['Boolean']
  maxDebtAmount: Scalars['Float']
  maxPayment: Scalars['Float']
  minPayment: Scalars['Float']
  minWagePayment: Scalars['Float']
  nationalId: Scalars['ID']
  oweTaxes: Scalars['Boolean']
  percent: Scalars['String']
  taxReturns: Scalars['Boolean']
  totalDebtAmount: Scalars['Float']
  vatReturns: Scalars['Boolean']
  wageReturns: Scalars['Boolean']
  withholdingTaxReturns: Scalars['Boolean']
}

export type PaymentScheduleData = {
  __typename?: 'PaymentScheduleData'
  nationalId: Scalars['String']
  paymentSchedules: Array<PaymentSchedule>
}

export type PaymentScheduleDebts = {
  __typename?: 'PaymentScheduleDebts'
  chargetypes: Array<PaymentScheduleCharge>
  explanation: Scalars['String']
  nationalId: Scalars['ID']
  organization: Scalars['String']
  paymentSchedule: Scalars['String']
  totalAmount: Scalars['Float']
  type: PaymentScheduleType
}

export type PaymentScheduleDetailData = {
  __typename?: 'PaymentScheduleDetailData'
  myDetailedSchedule: Array<DetailedSchedule>
}

export type PaymentScheduleDetailModel = {
  __typename?: 'PaymentScheduleDetailModel'
  myDetailedSchedules: PaymentScheduleDetailData
}

export type PaymentScheduleDistribution = {
  __typename?: 'PaymentScheduleDistribution'
  nationalId: Scalars['ID']
  payments: Array<PaymentSchedulePayment>
  scheduleType: PaymentScheduleType
}

export type PaymentScheduleEmployer = {
  __typename?: 'PaymentScheduleEmployer'
  name: Scalars['String']
  nationalId: Scalars['ID']
}

export type PaymentScheduleInitialSchedule = {
  __typename?: 'PaymentScheduleInitialSchedule'
  maxCountMonth: Scalars['Float']
  maxPayment: Scalars['Float']
  minCountMonth: Scalars['Float']
  minPayment: Scalars['Float']
  nationalId: Scalars['ID']
  scheduleType: PaymentScheduleType
}

export type PaymentScheduleModel = {
  __typename?: 'PaymentScheduleModel'
  myPaymentSchedule?: Maybe<PaymentScheduleData>
}

export type PaymentSchedulePayment = {
  __typename?: 'PaymentSchedulePayment'
  accumulated: Scalars['Float']
  dueDate: Scalars['DateTime']
  payment: Scalars['Float']
}

/** Possible types of schedules */
export enum PaymentScheduleType {
  FinesAndLegalCost = 'FinesAndLegalCost',
  OtherFees = 'OtherFees',
  OverpaidBenefits = 'OverpaidBenefits',
  Wagedection = 'Wagedection',
}

export type PaymentsCardInformation = {
  __typename?: 'PaymentsCardInformation'
  /** Card category */
  cardCategory: Scalars['String']
  /** Card product category */
  cardProductCategory: Scalars['String']
  /** Card scheme (for example Visa or MasterCard) */
  cardScheme: Scalars['String']
  /** Card usage description */
  cardUsage: Scalars['String']
  /** Issuing country of the card */
  issuingCountry: Scalars['String']
  /** Out-of-SCA scope status */
  outOfScaScope: Scalars['String']
}

export type PaymentsCardVerificationCallbackInput = {
  /** Signed JWT token containing the verification result */
  verificationToken: Scalars['String']
}

export type PaymentsCardVerificationField = {
  __typename?: 'PaymentsCardVerificationField'
  /** Field name */
  name: Scalars['String']
  /** Field value */
  value: Scalars['String']
}

export type PaymentsCardVerificationResponse = {
  __typename?: 'PaymentsCardVerificationResponse'
  /** Id of the payment flow that was verified */
  paymentFlowId: Scalars['String']
}

export type PaymentsChargeCardInput = {
  amount: Scalars['Float']
  cardNumber: Scalars['String']
  cvc: Scalars['String']
  expiryMonth: Scalars['Float']
  expiryYear: Scalars['Float']
  paymentFlowId: Scalars['String']
}

export type PaymentsChargeCardResponse = {
  __typename?: 'PaymentsChargeCardResponse'
  /** Was the payment successful? */
  isSuccess: Scalars['Boolean']
  /** The response code from the payment provider */
  responseCode: Scalars['String']
}

export type PaymentsCreateInvoiceInput = {
  paymentFlowId: Scalars['String']
}

export type PaymentsCreateInvoiceResponse = {
  __typename?: 'PaymentsCreateInvoiceResponse'
  /** Unique id for the event */
  correlationId: Scalars['String']
  /** Indicates if invoice creation was successful */
  isSuccess: Scalars['Boolean']
  /** Code of what went wrong */
  responseCode?: Maybe<Scalars['String']>
}

export enum PaymentsGetFlowPaymentStatus {
  InvoicePending = 'invoice_pending',
  Paid = 'paid',
  Unpaid = 'unpaid',
}

export type PaymentsGetPaymentFlowResponse = {
  __typename?: 'PaymentsGetPaymentFlowResponse'
  availablePaymentMethods: Array<Scalars['String']>
  existingInvoiceId?: Maybe<Scalars['String']>
  id: Scalars['ID']
  /** Arbitrary JSON data provided by the consuming service that will be returned on in callbacks (e.g. onSuccess, onUpdate). Example use case: the service that created the payment flow needs to pass some data that will be returned in the callback */
  metadata?: Maybe<Scalars['JSON']>
  organisationId: Scalars['String']
  payerName: Scalars['String']
  payerNationalId: Scalars['String']
  paymentStatus: PaymentsGetFlowPaymentStatus
  productPrice: Scalars['Float']
  productTitle: Scalars['String']
  redirectToReturnUrlOnSuccess?: Maybe<Scalars['Boolean']>
  returnUrl?: Maybe<Scalars['String']>
  updatedAt: Scalars['DateTime']
}

export type PaymentsGetVerificationStatus = {
  __typename?: 'PaymentsGetVerificationStatus'
  isVerified: Scalars['Boolean']
}

export type PaymentsVerifyCardInput = {
  amount: Scalars['Float']
  cardNumber: Scalars['String']
  expiryMonth: Scalars['Float']
  expiryYear: Scalars['Float']
  paymentFlowId: Scalars['String']
}

export type PaymentsVerifyCardResponse = {
  __typename?: 'PaymentsVerifyCardResponse'
  /** Additional fields */
  additionalFields: Array<PaymentsCardVerificationField>
  /** Card information */
  cardInformation: PaymentsCardInformation
  /** Raw response from card verification */
  cardVerificationRawResponse: Scalars['String']
  /** Indicates if the verification was successful */
  isSuccess: Scalars['Boolean']
  /** Post URL for verification */
  postUrl: Scalars['String']
  /** Response code from the verification */
  responseCode: Scalars['String']
  /** Description of the response */
  responseDescription: Scalars['String']
  /** Response time of the verification */
  responseTime: Scalars['String']
  /** Script path for further actions */
  scriptPath: Scalars['String']
  /** Verification fields */
  verificationFields: Array<PaymentsCardVerificationField>
}

export type PendingAction = {
  __typename?: 'PendingAction'
  button?: Maybe<Scalars['String']>
  content?: Maybe<Scalars['String']>
  displayStatus?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type PensionFund = {
  __typename?: 'PensionFund'
  id: Scalars['String']
  name: Scalars['String']
}

export type Period = {
  approved: Scalars['Boolean']
  from: Scalars['String']
  paid: Scalars['Boolean']
  ratio: Scalars['String']
  to: Scalars['String']
}

export type PeriodItems = {
  __typename?: 'PeriodItems'
  courses?: Maybe<Array<CoursesModel>>
  diplomaId?: Maybe<Scalars['Float']>
  division?: Maybe<Scalars['String']>
  divisionShort?: Maybe<Scalars['String']>
  organisation?: Maybe<Scalars['String']>
  organisationShort?: Maybe<Scalars['String']>
  periodFrom?: Maybe<Scalars['String']>
  periodId?: Maybe<Scalars['Float']>
  periodName?: Maybe<Scalars['String']>
  periodShort?: Maybe<Scalars['String']>
  periodTo?: Maybe<Scalars['String']>
  studentId?: Maybe<Scalars['Float']>
}

export type PeriodsModel = {
  __typename?: 'PeriodsModel'
  items?: Maybe<Array<PeriodItems>>
}

export type PlateAvailability = {
  __typename?: 'PlateAvailability'
  available: Scalars['Boolean']
  regno: Scalars['String']
}

export type PlateAvailabilityInput = {
  regno: Scalars['String']
}

export type PlateOrderAnswers = {
  pickVehicle: PlateOrderAnswersPickVehicle
  plateDelivery: OperatorChangeAnswersPlateDelivery
  plateSize: PlateOrderAnswersPlateSize
}

export type PlateOrderAnswersPickVehicle = {
  plate: Scalars['String']
}

export type PlateOrderAnswersPlateSize = {
  frontPlateSize?: InputMaybe<Array<Scalars['String']>>
  rearPlateSize?: InputMaybe<Array<Scalars['String']>>
}

export type PlateOrderValidation = {
  __typename?: 'PlateOrderValidation'
  errorMessages?: Maybe<Array<PlateOrderValidationMessage>>
  hasError: Scalars['Boolean']
}

export type PlateOrderValidationMessage = {
  __typename?: 'PlateOrderValidationMessage'
  defaultMessage?: Maybe<Scalars['String']>
  errorNo?: Maybe<Scalars['String']>
}

export type PostBulkMailActionResolverInput = {
  action: Scalars['String']
  messageIds: Array<Scalars['String']>
  /** This status represents the nature of the request. True = adding item status. False = removing item status. */
  status: Scalars['Boolean']
}

export type PostMailActionResolverInput = {
  action: Scalars['String']
  messageId: Scalars['String']
}

export type PostRequestPaperInput = {
  wantsPaper: Scalars['Boolean']
}

export type PostVehicleBulkMileageInput = {
  mileageData: Array<PostVehicleBulkMileageSingleInput>
  /** Example: "ISLAND.IS" */
  originCode: Scalars['String']
}

export type PostVehicleBulkMileageSingleInput = {
  mileageNumber: Scalars['Float']
  vehicleId: Scalars['String']
}

export type PostVehicleMileageInput = {
  /** Deprecated. Use {mileageNumber} instead. Keeping in for backwards compatibility */
  mileage?: InputMaybe<Scalars['String']>
  mileageNumber?: InputMaybe<Scalars['Float']>
  /** Example: "ISLAND.IS" */
  originCode: Scalars['String']
  permno: Scalars['String']
}

export type PowerBiSlice = {
  __typename?: 'PowerBiSlice'
  id: Scalars['ID']
  owner?: Maybe<Scalars['String']>
  powerBiEmbedProps?: Maybe<Scalars['JSON']>
  powerBiEmbedPropsFromServer?: Maybe<GetPowerBiEmbedPropsFromServerResponse>
  reportId?: Maybe<Scalars['String']>
  title: Scalars['String']
  workspaceId?: Maybe<Scalars['String']>
}

export type PracticalDrivingLesson = {
  __typename?: 'PracticalDrivingLesson'
  bookId: Scalars['ID']
  comments: Scalars['String']
  createdOn: Scalars['String']
  id: Scalars['ID']
  licenseCategory: Scalars['String']
  minutes: Scalars['Float']
  studentName: Scalars['String']
  studentNationalId: Scalars['String']
  teacherName: Scalars['String']
  teacherNationalId: Scalars['String']
}

export type PracticalDrivingLessonsInput = {
  bookId: Scalars['String']
  id: Scalars['String']
}

export type PracticalExamCompanyValidationItem = {
  __typename?: 'PracticalExamCompanyValidationItem'
  mayPayReceiveInvoice?: Maybe<Scalars['Boolean']>
  nationalId?: Maybe<Scalars['String']>
}

export type PracticalExamInstructor = {
  __typename?: 'PracticalExamInstructor'
  categoriesMayTeach?: Maybe<Array<Scalars['String']>>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
}

export type PregnancyStatus = {
  __typename?: 'PregnancyStatus'
  expectedDateOfBirth: Scalars['String']
  hasActivePregnancy: Scalars['Boolean']
}

export type PresignedPost = {
  __typename?: 'PresignedPost'
  fields: Scalars['JSON']
  url: Scalars['String']
}

export type PresignedUrlResponse = {
  __typename?: 'PresignedUrlResponse'
  url: Scalars['String']
}

export enum PricingCategory {
  Free = 'FREE',
  Paid = 'PAID',
}

export type ProcessEntry = {
  __typename?: 'ProcessEntry'
  buttonText: Scalars['String']
  id: Scalars['ID']
  openLinkInModal?: Maybe<Scalars['Boolean']>
  processLink: Scalars['String']
  processTitle: Scalars['String']
}

export type ProfessionRight = {
  __typename?: 'ProfessionRight'
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  profession?: Maybe<Scalars['String']>
}

export type ProfessionRightsResponse = {
  __typename?: 'ProfessionRightsResponse'
  list: Array<ProfessionRight>
}

export type ProjectPage = {
  __typename?: 'ProjectPage'
  alertBanner?: Maybe<AlertBanner>
  backLink?: Maybe<Link>
  bottomSlices: Array<Slice>
  content?: Maybe<Array<Slice>>
  contentIsFullWidth?: Maybe<Scalars['Boolean']>
  defaultHeaderBackgroundColor: Scalars['String']
  defaultHeaderImage?: Maybe<Image>
  featuredDescription: Scalars['String']
  featuredImage?: Maybe<Image>
  footerConfig?: Maybe<Scalars['JSON']>
  footerItems?: Maybe<Array<FooterItem>>
  id: Scalars['ID']
  intro: Scalars['String']
  namespace?: Maybe<Namespace>
  newsTag?: Maybe<GenericTag>
  projectSubpages: Array<ProjectSubpage>
  secondarySidebar?: Maybe<LinkGroup>
  sidebar: Scalars['Boolean']
  sidebarLinks: Array<LinkGroup>
  slices: Array<Slice>
  slug: Scalars['String']
  stepper?: Maybe<Stepper>
  subtitle: Scalars['String']
  theme: Scalars['String']
  themeProperties?: Maybe<ProjectPageThemeProperties>
  title: Scalars['String']
}

export type ProjectPageThemeProperties = {
  __typename?: 'ProjectPageThemeProperties'
  backgroundColor?: Maybe<Scalars['String']>
  fullWidth?: Maybe<Scalars['Boolean']>
  gradientEndColor: Scalars['String']
  gradientStartColor: Scalars['String']
  imageIsFullHeight?: Maybe<Scalars['Boolean']>
  imageObjectFit?: Maybe<Scalars['String']>
  imageObjectPosition?: Maybe<Scalars['String']>
  imagePadding?: Maybe<Scalars['String']>
  mobileBackgroundColor?: Maybe<Scalars['String']>
  textColor?: Maybe<Scalars['String']>
  titleSectionPaddingLeft?: Maybe<Scalars['Int']>
  useGradientColor?: Maybe<Scalars['Boolean']>
}

export type ProjectSubpage = {
  __typename?: 'ProjectSubpage'
  bottomSlices?: Maybe<Array<Slice>>
  content?: Maybe<Array<Slice>>
  id: Scalars['ID']
  renderSlicesAsTabs: Scalars['Boolean']
  shortTitle?: Maybe<Scalars['String']>
  showTableOfContents: Scalars['Boolean']
  slices: Array<Slice>
  slug: Scalars['String']
  title: Scalars['String']
}

export type Properties = {
  propertyNumber: Scalars['String']
  propertyType: Scalars['String']
}

export type PropertyDetail = {
  __typename?: 'PropertyDetail'
  appraisal?: Maybe<Appraisal>
  defaultAddress?: Maybe<PropertyLocation>
  land?: Maybe<LandModel>
  propertyNumber?: Maybe<Scalars['String']>
  registeredOwners?: Maybe<PropertyOwnersModel>
  unitsOfUse?: Maybe<UnitsOfUseModel>
}

export type PropertyLocation = {
  __typename?: 'PropertyLocation'
  display?: Maybe<Scalars['String']>
  displayShort?: Maybe<Scalars['String']>
  locationNumber?: Maybe<Scalars['Float']>
  municipality?: Maybe<Scalars['String']>
  postNumber?: Maybe<Scalars['Float']>
  propertyNumber?: Maybe<Scalars['Float']>
}

export type PropertyOverview = {
  __typename?: 'PropertyOverview'
  paging?: Maybe<PagingData>
  properties?: Maybe<Array<SimpleProperties>>
}

export type PropertyOwner = {
  __typename?: 'PropertyOwner'
  grantDisplay?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  ownership?: Maybe<Scalars['Float']>
  purchaseDate?: Maybe<Scalars['DateTime']>
  ssn?: Maybe<Scalars['String']>
}

export type PropertyOwnersModel = {
  __typename?: 'PropertyOwnersModel'
  paging?: Maybe<PagingData>
  registeredOwners?: Maybe<Array<PropertyOwner>>
}

export type Provider = {
  __typename?: 'Provider'
  apiScope?: Maybe<Scalars['String']>
  created: Scalars['DateTime']
  endpoint?: Maybe<Scalars['String']>
  endpointType?: Maybe<Scalars['String']>
  id: Scalars['String']
  modified: Scalars['DateTime']
  organisationId?: Maybe<Scalars['String']>
  xroad?: Maybe<Scalars['Boolean']>
}

export type ProviderStatistics = {
  __typename?: 'ProviderStatistics'
  notifications: Scalars['Float']
  opened: Scalars['Float']
  published: Scalars['Float']
}

export type PutVehicleMileageInput = {
  internalId: Scalars['Float']
  /** Deprecated. Use {mileageNumber} instead. Keeping in for backwards compatibility */
  mileage?: InputMaybe<Scalars['String']>
  mileageNumber?: InputMaybe<Scalars['Float']>
  permno: Scalars['String']
}

export type Query = {
  __typename?: 'Query'
  HealthInsuranceAccidentStatus?: Maybe<AccidentNotificationStatus>
  OJOIAGetApplicationCase: OjoiaApplicationCaseResponse
  OJOIAGetComments: OjoiaGetCommentsResponse
  OJOIAGetPdf: OjoiaGetPdfResponse
  UserProfileAdminProfile?: Maybe<UserProfileAdminProfile>
  UserProfileAdminProfiles: UserProfileAdminProfilesResponse
  adminNotifications?: Maybe<AdminNotifications>
  administrationOfOccupationalSafetyAndHealthCourses: AdministrationofOccupationalSafetyandHealthCoursesResponseModel
  airDiscountSchemeDiscounts: Array<AirDiscountSchemeDiscount>
  airDiscountSchemeFlightLegs: Array<AirDiscountSchemeFlightLeg>
  airDiscountSchemeUserAndRelationsFlights: Array<AirDiscountSchemeFlightLeg>
  aircraftRegistryAllAircrafts: AircraftRegistryAllAircraftsResponse
  applicationApplication?: Maybe<Application>
  applicationApplications?: Maybe<Array<Application>>
  applicationApplicationsAdmin?: Maybe<Array<ApplicationAdmin>>
  applicationApplicationsAdminStatistics?: Maybe<Array<ApplicationStatistics>>
  applicationApplicationsInstitutionAdmin?: Maybe<ApplicationAdminPaginatedResponse>
  applicationPaymentStatus?: Maybe<ApplicationPayment>
  areIndividualsValid: Array<SeminarsIndividualValidationItem>
  assetsDetail?: Maybe<PropertyDetail>
  assetsOverview?: Maybe<PropertyOverview>
  assetsPropertyOwners?: Maybe<PropertyOwnersModel>
  assetsUnitsOfUse?: Maybe<UnitsOfUseModel>
  attachmentPresignedURL?: Maybe<PresignedUrlResponse>
  authActorDelegations: Array<AuthMergedDelegation>
  authAdminClient?: Maybe<AuthAdminClient>
  authAdminClients: AuthAdminClientsPayload
  authAdminDelegationAdmin: DelegationAdminCustomModel
  authAdminScope: AuthAdminScope
  authAdminScopes: AuthAdminScopesPayload
  authAdminTenant: AuthAdminTenant
  authAdminTenants: AuthAdminTenantsPayload
  /** @deprecated Should use authScopeTree instead. */
  authApiScopes: Array<AuthApiScope>
  authDelegation?: Maybe<AuthDelegation>
  authDelegationProviders: AuthDelegationProviderPayload
  authDelegations: Array<AuthDelegation>
  authDomains: Array<AuthDomain>
  authLoginRestriction: AuthLoginRestriction
  authPasskeyAuthenticationOptions: AuthPasskeyAuthenticationOptions
  authPasskeyRegistrationOptions: AuthPasskeyRegistrationOptions
  authScopeTree: Array<AuthScopeTreeNode>
  companyRegistryCompanies: RskCompanySearchItems
  companyRegistryCompany?: Maybe<RskCompany>
  consentsList: AuthConsentsPaginated
  consultationPortalAdviceByCaseId: Array<ConsultationPortalAdviceResult>
  consultationPortalAllTypes: ConsultationPortalAllTypesResult
  consultationPortalAllUserAdvices: ConsultationPortalUserAdviceAggregate
  consultationPortalCaseById: ConsultationPortalCaseResult
  consultationPortalDocument: Array<ConsultationPortalDocumentInfoResult>
  consultationPortalGetCases: ConsultationPortalCasesAggregateResult
  consultationPortalStatistics: ConsultationPortalStatisticsResult
  consultationPortalSubscriptionType: ConsultationPortalCaseSubscriptionResult
  consultationPortalUserEmail: ConsultationPortalUserEmailResult
  consultationPortalUserSubscriptions: ConsultationPortalUserSubscriptionsAggregate
  costOfLivingCalculator?: Maybe<CostOfLivingCalculatorResponseModel>
  digitalTachographTachoNetExists: CheckTachoNetExists
  documentPageNumber?: Maybe<DocumentPageNumber>
  documentProviderPaperMailList: DocumentProviderPaperMailResponse
  documentProviderProvidedCategories: Array<DocumentProviderCategory>
  documentProviderProvidedTypes: Array<DocumentProviderType>
  documentV2?: Maybe<DocumentV2>
  documentV2ConfirmActions?: Maybe<DocumentConfirmActions>
  documentV2PdfRenderer?: Maybe<DocumentPdfRenderer>
  documentsV2?: Maybe<DocumentsV2>
  drivingLicense?: Maybe<DrivingLicense>
  drivingLicenseApplicationEligibility: ApplicationEligibility
  drivingLicenseBookFindStudent: Array<DrivingLicenseBookStudent>
  drivingLicenseBookFindStudentForTeacher: Array<DrivingLicenseBookStudent>
  drivingLicenseBookPracticalDrivingLessons: Array<PracticalDrivingLesson>
  drivingLicenseBookSchoolForEmployee: DrivingLicenseBookSchool
  drivingLicenseBookSchoolTypes: Array<DrivingSchoolType>
  drivingLicenseBookStudent: DrivingLicenseBookStudentOverview
  drivingLicenseBookStudentForTeacher: DrivingLicenseBookStudentOverview
  drivingLicenseBookStudentsForTeacher: Array<DrivingLicenseBookStudentForTeacher>
  drivingLicenseBookUserBook?: Maybe<DrivingLicenseBookStudentOverview>
  drivingLicenseQualityPhoto: DrivingLicenseQualityPhoto
  drivingLicenseQualitySignature: DrivingLicenseQualitySignature
  drivingLicenseStudentAssessment?: Maybe<StudentAssessment>
  drivingLicenseStudentCanGetPracticePermit?: Maybe<StudentCanGetPracticePermit>
  drivingLicenseStudentInformation: StudentInformationResult
  drivingLicenseTeachersV4: Array<TeacherV4>
  drivingLicenseTeachingRights: HasTeachingRights
  educationExamFamilyOverviews: Array<EducationExamFamilyOverview>
  educationExamResult: EducationExamResult
  educationLicense: Array<EducationLicense>
  endorsementSystemFindEndorsementLists: PaginatedEndorsementListResponse
  endorsementSystemGetEndorsements?: Maybe<PaginatedEndorsementResponse>
  endorsementSystemGetGeneralPetitionEndorsements?: Maybe<PaginatedEndorsementResponse>
  endorsementSystemGetGeneralPetitionList: EndorsementList
  endorsementSystemGetGeneralPetitionLists: PaginatedEndorsementListResponse
  endorsementSystemGetSingleEndorsement: ExistsEndorsementResponse
  endorsementSystemGetSingleEndorsementList?: Maybe<EndorsementList>
  endorsementSystemUserEndorsementLists: PaginatedEndorsementListResponse
  endorsementSystemUserEndorsements: PaginatedEndorsementResponse
  energyFundVehicleDetailsWithGrant?: Maybe<EnergyFundVehicleDetailsWithGrant>
  energyFundVehicleGrant?: Maybe<EnergyFundVehicleGrant>
  financialStatementsInaoClientFinancialLimit?: Maybe<Scalars['Float']>
  financialStatementsInaoClientTypes?: Maybe<
    Array<FinancialStatementsInaoClientType>
  >
  financialStatementsInaoConfig: Array<FinancialStatementsInaoConfig>
  financialStatementsInaoCurrentUserClientType?: Maybe<FinancialStatementsInaoClientType>
  financialStatementsInaoElections?: Maybe<
    Array<FinancialStatementsInaoElection>
  >
  financialStatementsInaoTaxInfo: Array<FinancialStatementsInaoTaxInfo>
  fishingLicenseShips?: Maybe<Array<FishingLicenseShip>>
  fishingLicenses: Array<FishingLicenseLicense>
  fiskistofaGetQuotaTypesForCalendarYear: FiskistofaQuotaTypeResponse
  fiskistofaGetQuotaTypesForTimePeriod: FiskistofaQuotaTypeResponse
  fiskistofaGetShipStatusForCalendarYear: FiskistofaShipStatusInformationResponse
  fiskistofaGetShipStatusForTimePeriod: FiskistofaExtendedShipStatusInformationResponse
  fiskistofaGetShips: FiskistofaShipBasicInfoResponse
  fiskistofaGetSingleShip: FiskistofaSingleShipResponse
  fiskistofaUpdateShipQuotaStatusForTimePeriod: FiskistofaQuotaStatusResponse
  fiskistofaUpdateShipStatusForCalendarYear: FiskistofaShipStatusInformationResponse
  fiskistofaUpdateShipStatusForTimePeriod: FiskistofaExtendedShipStatusInformationUpdateResponse
  formSystemApplication: FormSystemApplication
  formSystemApplications: FormSystemApplicationResponse
  formSystemForm: FormSystemFormResponse
  formSystemForms: FormSystemFormResponse
  formSystemOrganization: FormSystemOrganization
  formSystemOrganizationAdmin: FormSystemOrganizationAdmin
  friggOptions?: Maybe<Array<EducationFriggKeyOptionModel>>
  friggSchoolsByMunicipality?: Maybe<Array<EducationFriggOrganizationModel>>
  genericLicense?: Maybe<GenericUserLicense>
  genericLicenseCollection: GenericLicenseCollection
  /** @deprecated Use genericLicenseCollection instead */
  genericLicenses: Array<GenericUserLicense>
  getAlcoholLicences: Array<AlcoholLicence>
  getAlertBanner?: Maybe<AlertBanner>
  getAllIcelandicNames: Array<IcelandicName>
  getAnchorPage?: Maybe<AnchorPage>
  getAnchorPages: Array<AnchorPage>
  getAnnualStatusDocument?: Maybe<FinanceDocumentModel>
  getApiCatalogue: ApiCatalogue
  getApiServiceById?: Maybe<Service>
  getApplicationInformation: ApplicationInformation
  getArticleCategories: Array<ArticleCategory>
  getArticles: Array<Article>
  getAssessmentYears: FinanceAssessmentYears
  getAuction: Auction
  getAuctions: Array<Auction>
  getBloodDonationRestrictionDetails?: Maybe<BloodDonationRestrictionDetails>
  getBloodDonationRestrictionGenericTags: BloodDonationRestrictionGenericTagList
  getBloodDonationRestrictions: BloodDonationRestrictionList
  getBrokers: Array<Broker>
  getBurningPermits: BurningPermitsResponse
  getCategoryPages?: Maybe<Array<CategoryPage>>
  getChargeItemSubjectsByYear: FinanceChargeItemSubjectsByYear
  getChargeTypePeriodSubject: FinanceChargeTypePeriodSubject
  getChargeTypesByYear?: Maybe<FinanceChargeTypesByYear>
  getChargeTypesDetailsByYear: FinanceChargeTypeDetails
  getContentSlug?: Maybe<ContentSlug>
  getCustomPage?: Maybe<CustomPage>
  getCustomSubpage?: Maybe<CustomPage>
  getCustomerChargeType?: Maybe<FinanceCustomerChargeType>
  getCustomerRecords?: Maybe<FinanceCustomerRecords>
  getCustomerTapControl?: Maybe<FinanceCustomerTapsControlModel>
  getDebtStatus: FinanceDebtStatusModel
  /** @deprecated Up for removal */
  getDocument?: Maybe<DocumentDetails>
  /** @deprecated Up for removal */
  getDocumentCategories?: Maybe<Array<DocumentCategory>>
  /** @deprecated Up for removal */
  getDocumentPageNumber: DocumentPageResponse
  /** @deprecated Up for removal */
  getDocumentSenders?: Maybe<Array<DocumentSender>>
  /** @deprecated Up for removal */
  getDocumentTypes?: Maybe<Array<DocumentType>>
  getDocumentsList: FinanceDocumentsListModel
  getDraftRegulation: Scalars['JSON']
  getDraftRegulationPdfDownload: DraftRegulationPdfDownloadModel
  getDraftRegulations: Scalars['JSON']
  getDraftRegulationsLawChapters: Scalars['JSON']
  getDraftRegulationsMinistries: Scalars['JSON']
  getErrorPage?: Maybe<ErrorPage>
  getEvents: EventList
  getExamineeEligibility: Array<ExamineeEligibility>
  getExamineeValidation: WorkMachineExamineeValidation
  getFeaturedSupportQNAs: Array<SupportQna>
  getFinanceDocument?: Maybe<FinanceDocumentModel>
  getFinanceStatus: Scalars['JSON']
  getFinanceStatusDetails?: Maybe<Scalars['JSON']>
  getFrontpage?: Maybe<Frontpage>
  getGenericListItemBySlug?: Maybe<GenericListItem>
  getGenericListItems?: Maybe<GenericListItemResponse>
  getGenericOverviewPage?: Maybe<GenericOverviewPage>
  getGenericPage?: Maybe<GenericPage>
  getGenericTagBySlug?: Maybe<GenericTag>
  getGenericTagsInTagGroups?: Maybe<Array<GenericTag>>
  getGrants: GrantList
  getGroupedMenu?: Maybe<GroupedMenu>
  getHomestays: Array<Homestay>
  getIcelandicNameById: IcelandicName
  getIcelandicNameByInitialLetter: Array<IcelandicName>
  getIcelandicNameBySearch: Array<IcelandicName>
  getIdentityDocument?: Maybe<Array<IdentityDocumentModel>>
  getIdentityDocumentChildren?: Maybe<Array<IdentityDocumentModelChild>>
  getJourneymanLicences: JourneymanLicencesResponse
  getLawyers: Array<Lawyer>
  getLifeEventPage?: Maybe<LifeEventPage>
  getLifeEventsForOverview: Array<LifeEventPage>
  getLifeEventsInCategory: Array<LifeEventPage>
  getMachineModels: Array<WorkMachinesModel>
  getMachineParentCategoryByTypeAndModel: Array<WorkMachinesCategory>
  getMachineSubCategories: Array<WorkMachinesSubCategory>
  getMasterLicences: MasterLicencesResponse
  getMenu?: Maybe<Menu>
  getNamespace?: Maybe<Namespace>
  getNews: NewsList
  getNewsDates: Array<Scalars['String']>
  getOpenApi: OpenApi
  getOpenDataPage: OpenDataPage
  getOpenDataSubpage: OpenDataSubpage
  getOperatingLicenses: PaginatedOperatingLicenses
  getOperatingLicensesCSV: OperatingLicensesCsv
  getOrganization?: Maybe<Organization>
  getOrganizationByNationalId?: Maybe<Organization>
  getOrganizationByTitle?: Maybe<Organization>
  getOrganizationPage?: Maybe<OrganizationPage>
  getOrganizationPageStandaloneSitemapLevel1?: Maybe<OrganizationPageStandaloneSitemap>
  getOrganizationPageStandaloneSitemapLevel2?: Maybe<OrganizationPageStandaloneSitemapLevel2>
  getOrganizationParentSubpage?: Maybe<OrganizationParentSubpage>
  getOrganizationSubpage?: Maybe<OrganizationSubpage>
  getOrganizationSubpageById?: Maybe<OrganizationSubpage>
  getOrganizationTags?: Maybe<OrganizationTags>
  getOrganizations: Organizations
  /** @deprecated Up for removal */
  getPaperMailInfo?: Maybe<PaperMailBody>
  getParentalLeaves?: Maybe<Array<ParentalLeave>>
  getParentalLeavesApplicationPaymentPlan?: Maybe<
    Array<ParentalLeavePaymentPlan>
  >
  getParentalLeavesEntitlements?: Maybe<ParentalLeaveEntitlement>
  getParentalLeavesEstimatedPaymentPlan?: Maybe<Array<ParentalLeavePaymentPlan>>
  getParentalLeavesPeriodEndDate: ParentalLeavePeriodEndDate
  getParentalLeavesPeriodLength: ParentalLeavePeriodLength
  getPassport: Passport
  getPaymentSchedule?: Maybe<PaymentScheduleModel>
  getPaymentScheduleById: PaymentScheduleDetailModel
  getPensionCalculation: SocialInsurancePensionCalculationResponse
  getPensionFunds?: Maybe<Array<PensionFund>>
  getPregnancyStatus?: Maybe<PregnancyStatus>
  getPrivatePensionFunds?: Maybe<Array<PensionFund>>
  getProfessionRights: ProfessionRightsResponse
  getProjectPage?: Maybe<ProjectPage>
  getProviderOrganisation: Organisation
  getProviderOrganisations: Array<Organisation>
  getPublicVehicleSearch?: Maybe<VehiclesPublicVehicleSearch>
  getPublishedMaterial: EnhancedAssetSearchResult
  getRealEstateAddress: Array<AssetName>
  getRealEstateAgents: Array<RealEstateAgent>
  getRegulation: Scalars['JSON']
  getRegulationFromApi: Scalars['JSON']
  getRegulationImpactsByName: Scalars['JSON']
  getRegulationOptionList: Scalars['JSON']
  getRegulations: Scalars['JSON']
  getRegulationsLawChapters: Scalars['JSON']
  getRegulationsMinistries: Scalars['JSON']
  getRegulationsOptionSearch: Scalars['JSON']
  getRegulationsSearch: Scalars['JSON']
  getRegulationsYears: Scalars['JSON']
  getReligiousOrganizations: ReligiousOrganizationsResponse
  getServicePortalAlertBanners?: Maybe<Array<AlertBanner>>
  getServiceWebPage?: Maybe<ServiceWebPage>
  getShippedRegulations: Array<DraftRegulationShippedModel>
  getSingleArticle?: Maybe<Article>
  getSingleEntryTitleById?: Maybe<EntryTitle>
  getSingleEvent?: Maybe<Event>
  getSingleGrant?: Maybe<Grant>
  getSingleManual?: Maybe<Manual>
  getSingleNews?: Maybe<News>
  getSingleSupportQNA?: Maybe<SupportQna>
  getStatisticsByKeys: StatisticsQueryResponse
  getStatisticsTotal: ProviderStatistics
  getSubpageHeader?: Maybe<SubpageHeader>
  getSupportCategories: Array<SupportCategory>
  getSupportCategoriesInOrganization: Array<SupportCategory>
  getSupportCategory?: Maybe<SupportCategory>
  getSupportQNAs: Array<SupportQna>
  getSupportQNAsInCategory: Array<SupportQna>
  getSyslumennAuctions: Array<SyslumennAuction>
  getSyslumennCertificateInfo: CertificateInfoResponse
  getSyslumennDistrictCommissionersAgencies: Array<DistrictCommissionerAgencies>
  getSyslumennElectronicIDStatus: Scalars['Boolean']
  getSyslumennEstateRelations: EstateRelations
  getTabSection?: Maybe<TabSection>
  getTeamMembers?: Maybe<TeamMemberResponse>
  getTechnicalInfoInputs: Array<WorkMachinesTechInfoItem>
  getTemporaryCalculations: SocialInsuranceTemporaryCalculation
  getTemporaryEventLicences: Array<TemporaryEventLicence>
  getTranslations?: Maybe<Scalars['JSON']>
  getTypeByRegistrationNumber: WorkMachinesMachineType
  getUnions?: Maybe<Array<Union>>
  getUrl?: Maybe<Url>
  getUserProfile?: Maybe<UserProfile>
  getUserProfileLocale?: Maybe<UserProfileLocale>
  getVehicleType: Array<AssetName>
  getWorkerMachineByRegno: MachineDetails
  getWorkerMachineDetails: MachineDetails
  getWorkerMachinePaymentRequired: Scalars['Boolean']
  hasDisabilityLicense: Scalars['Boolean']
  healthDirectorateMedicineDispensationsATC: HealthDirectorateMedicineDispensationsAtc
  healthDirectorateMedicineHistory: HealthDirectorateMedicineHistory
  healthDirectorateOrganDonation: HealthDirectorateOrganDonation
  healthDirectoratePrescriptionDocuments: HealthDirectoratePrescriptionDocuments
  healthDirectoratePrescriptions: HealthDirectoratePrescriptions
  healthDirectorateReferral: HealthDirectorateReferralDetail
  healthDirectorateReferrals: HealthDirectorateReferrals
  healthDirectorateVaccinations: HealthDirectorateVaccinations
  healthDirectorateWaitlist: HealthDirectorateWaitlistDetail
  healthDirectorateWaitlists: HealthDirectorateWaitlists
  healthInsuranceIsHealthInsured: Scalars['Boolean']
  hmsLoansHistory?: Maybe<Array<HmsLoansHistory>>
  hmsLoansHistoryPdf?: Maybe<HmsLoansHistoryPdf>
  hmsLoansPaymentHistory?: Maybe<Array<HmsLoansPaymentHistory>>
  hmsPropertyInfo?: Maybe<HmsPropertyInfos>
  hmsSearch?: Maybe<Addresses>
  housingBenefitCalculatorCalculation: HousingBenefitCalculationModel
  housingBenefitCalculatorSpecificSupportCalculation: HousingBenefitCalculationModel
  housingBenefitsPayments?: Maybe<HousingBenefitsPayments>
  icelandicGovernmentInstitutionVacancies: IcelandicGovernmentInstitutionVacanciesResponse
  icelandicGovernmentInstitutionVacancyById: IcelandicGovernmentInstitutionVacancyByIdResponse
  identity?: Maybe<Identity>
  innaDiplomas: DiplomaModel
  innaPeriods: PeriodsModel
  intellectualProperties?: Maybe<IntellectualPropertiesResponse>
  intellectualPropertiesDesign?: Maybe<IntellectualPropertiesDesign>
  intellectualPropertiesDesignImage?: Maybe<IntellectualPropertiesImage>
  intellectualPropertiesDesignImageList?: Maybe<IntellectualPropertiesImageList>
  intellectualPropertiesPatent?: Maybe<IntellectualPropertiesPatent>
  intellectualPropertiesTrademark?: Maybe<IntellectualPropertiesTrademark>
  intellectualPropertiesTrademarks?: Maybe<
    Array<IntellectualPropertiesTrademark>
  >
  isEmployerValid: Scalars['Boolean']
  lawAndOrderCourtCaseDetail?: Maybe<LawAndOrderCourtCase>
  lawAndOrderCourtCasesList?: Maybe<LawAndOrderCourtCases>
  lawAndOrderLawyers?: Maybe<LawAndOrderLawyers>
  lawAndOrderSubpoena?: Maybe<LawAndOrderSubpoena>
  learnerMentorEligibility: ApplicationEligibility
  legacyDrivingLicense?: Maybe<DrivingLicense>
  /** @deprecated Up for removal */
  listDocuments?: Maybe<Array<Document>>
  /** @deprecated Up for removal */
  listDocumentsV2?: Maybe<DocumentListResponse>
  malwareScanStatus: MalwareScanStatus
  municipalitiesFinancialAidApplication?: Maybe<MunicipalitiesFinancialAidApplicationModel>
  municipalitiesFinancialAidApplicationSignedUrl: MunicipalitiesFinancialAidSignedUrlModel
  myPlateOwnershipChecksByRegno?: Maybe<MyPlateOwnershipChecksByRegno>
  /** @deprecated Up for removal. Query children/childCustody for authenticated user instead */
  nationalRegistryChildren?: Maybe<Array<NationalRegistryChild>>
  nationalRegistryPerson?: Maybe<NationalRegistryPerson>
  nationalRegistryReligions?: Maybe<Array<NationalRegistryReligion>>
  /** @deprecated Moving to NationalRegistryPerson */
  nationalRegistryUser?: Maybe<NationalRegistryUser>
  nationalRegistryUserV2?: Maybe<NationalRegistryXRoadPerson>
  nationalRegistryUserV2ChildGuardianship?: Maybe<NationalRegistryXRoadChildGuardianship>
  occupationalLicense?: Maybe<OccupationalLicensesLicenseResponse>
  occupationalLicenses?: Maybe<OccupationalLicensesLicenses>
  officialJournalOfIcelandAdvert: OfficialJournalOfIcelandAdvertResponse
  officialJournalOfIcelandAdverts: OfficialJournalOfIcelandAdvertsResponse
  officialJournalOfIcelandAdvertsSimilar: OfficialJournalOfIcelandAdvertSimilarResponse
  officialJournalOfIcelandApplicationAdvertTemplate: OfficialJournalOfIcelandApplicationAdvertTemplateResponse
  officialJournalOfIcelandApplicationAdvertTemplateTypes: OfficialJournalOfIcelandApplicationAdvertTemplateTypesResponse
  officialJournalOfIcelandApplicationGetAttachments: OfficialJournalOfIcelandApplicationGetApplicationAttachments
  officialJournalOfIcelandApplicationGetMyUserInfo: OfficialJournalOfIcelandApplicationGetMyUserInfoResponse
  officialJournalOfIcelandApplicationGetPdfUrl: OfficialJournalOfIcelandApplicationGetPdfUrlResponse
  officialJournalOfIcelandApplicationGetPrice: OfficialJournalOfIcelandApplicationGetPriceResponse
  officialJournalOfIcelandApplicationGetUserInvolvedParties: OfficialJournalOfIcelandApplicationGetUserInvolvedPartiesResponse
  officialJournalOfIcelandApplicationInvolvedPartySignature: OfficialJournalOfIcelandApplicationInvolvedPartySignatureResponse
  officialJournalOfIcelandCasesInProgress: OfficialJournalOfIcelandCasesInProgressResponse
  officialJournalOfIcelandCategories: OfficialJournalOfIcelandAdvertsCategoryResponse
  officialJournalOfIcelandDepartment: OfficialJournalOfIcelandAdvertsDepartmentResponse
  officialJournalOfIcelandDepartments: OfficialJournalOfIcelandAdvertsDepartmentsResponse
  officialJournalOfIcelandInstitutions: OfficialJournalOfIcelandAdvertsInstitutionsResponse
  officialJournalOfIcelandMainCategories: OfficialJournalOfIcelandAdvertsMainCategoriesResponse
  officialJournalOfIcelandMainTypes: OfficialJournalOfIcelandMainTypesResponse
  officialJournalOfIcelandType: OfficialJournalOfIcelandAdvertsTypeResponse
  officialJournalOfIcelandTypes: OfficialJournalOfIcelandAdvertsTypesResponse
  paymentCatalog: PaymentCatalogResponse
  paymentScheduleCompanyConditions?: Maybe<PaymentScheduleCompanyConditions>
  paymentScheduleConditions?: Maybe<PaymentScheduleConditions>
  paymentScheduleDebts?: Maybe<Array<PaymentScheduleDebts>>
  paymentScheduleDistribution?: Maybe<PaymentScheduleDistribution>
  paymentScheduleEmployer?: Maybe<PaymentScheduleEmployer>
  paymentScheduleInitialSchedule?: Maybe<PaymentScheduleInitialSchedule>
  paymentsGetFlow: PaymentsGetPaymentFlowResponse
  paymentsGetVerificationStatus: PaymentsGetVerificationStatus
  plateAvailable: PlateAvailability
  practicalExamIsCompanyValid: PracticalExamCompanyValidationItem
  requestCorrectionOnMortgageCertificate: RequestCorrectionOnMortgageCertificateModel
  rightsPortalCopaymentBills: RightsPortalCopaymentBillResponse
  rightsPortalCopaymentPeriods: RightsPortalCopaymentPeriodResponse
  rightsPortalCopaymentStatus?: Maybe<RightsPortalCopaymentStatus>
  rightsPortalCurrentDentist?: Maybe<RightsPortalDentistStatus>
  rightsPortalDentistStatus?: Maybe<RightsPortalDentistStatus>
  rightsPortalDrugBillLines: Array<RightsPortalDrugBillLine>
  rightsPortalDrugBills: Array<RightsPortalDrugBill>
  rightsPortalDrugCertificates: Array<RightsPortalDrugCertificate>
  rightsPortalDrugPeriods: Array<RightsPortalDrugPeriod>
  rightsPortalDrugs: RightsPortalPaginatedDrug
  rightsPortalGetCertificateById: RightsPortalDrugCertificate
  rightsPortalHealthCenterDoctors?: Maybe<
    Array<RightsPortalHealthCenterDoctors>
  >
  rightsPortalHealthCenterRegistrationHistory?: Maybe<RightsPortalHealthCenterRegistrationHistory>
  rightsPortalInsuranceConfirmation?: Maybe<RightsPortalInsuranceConfirmation>
  rightsPortalInsuranceOverview?: Maybe<RightsPortalInsuranceOverview>
  rightsPortalPaginatedAidOrNutrition?: Maybe<RightsPortalPaginatedAidsOrNutrition>
  rightsPortalPaginatedDentists?: Maybe<RightsPortalPaginatedDentists>
  rightsPortalPaginatedHealthCenters?: Maybe<RightsPortalPaginatedHealthCenters>
  rightsPortalPaginatedTherapies?: Maybe<RightsPortalPaginatedTherapies>
  rightsPortalPaymentOverview: RightsPortalPaymentOverviewResponse
  rightsPortalPaymentOverviewDocument: RightsPortalPaymentOverviewDocumentResponse
  rightsPortalPaymentOverviewServiceTypes: RightsPortalPaymentOverviewServiceTypeResponse
  rightsPortalUserDentistRegistration?: Maybe<RightsPortalUserDentistRegistration>
  searchForAllProperties?: Maybe<ManyPropertyDetail>
  searchForProperty?: Maybe<PropertyDetail>
  searchResults: SearchResult
  secondarySchoolProgramsBySchoolId: Array<SecondarySchoolProgram>
  seminarsVerIsCompanyValid: SeminarsCompanyValidationItem
  sessionsList: SessionsPaginatedSessionResponse
  shipRegistryShipSearch: ShipRegistryShipSearch
  signatureCollectionAdminCanSignInfo: SignatureCollectionSuccess
  signatureCollectionAdminCandidateLookup: SignatureCollectionCandidateLookUp
  signatureCollectionAdminCurrent: SignatureCollection
  signatureCollectionAdminList: SignatureCollectionList
  signatureCollectionAdminListStatus: SignatureCollectionListStatus
  signatureCollectionAdminLists: Array<SignatureCollectionList>
  signatureCollectionAdminSignatures?: Maybe<
    Array<SignatureCollectionSignature>
  >
  signatureCollectionAllOpenLists: Array<SignatureCollectionListBase>
  signatureCollectionAreaSummaryReport: SignatureCollectionAreaSummaryReport
  signatureCollectionCanSignFromPaper: Scalars['Boolean']
  signatureCollectionCollectors: Array<SignatureCollectionCollector>
  signatureCollectionCurrent: Array<SignatureCollection>
  signatureCollectionIsOwner: SignatureCollectionSuccess
  signatureCollectionLatestForType: SignatureCollection
  signatureCollectionList: SignatureCollectionList
  signatureCollectionListOverview: SignatureCollectionListSummary
  signatureCollectionListsForOwner: Array<SignatureCollectionList>
  signatureCollectionListsForUser: Array<SignatureCollectionListBase>
  signatureCollectionSignatureLookup: Array<SignatureCollectionSignature>
  signatureCollectionSignatures?: Maybe<Array<SignatureCollectionSignature>>
  signatureCollectionSignedList?: Maybe<Array<SignatureCollectionSignedList>>
  signatureCollectionSignee: SignatureCollectionSignee
  socialInsuranceIncomePlan?: Maybe<SocialInsuranceIncomePlan>
  socialInsurancePaymentPlan?: Maybe<SocialInsurancePaymentPlan>
  socialInsurancePayments?: Maybe<SocialInsurancePayments>
  socialInsuranceRehabilitationPlan: SocialInsuranceMedicalDocumentsRehabilitationPlan
  socialInsuranceUnions: Array<SocialInsuranceGeneralUnion>
  syslumennGetRegistryPerson: RegistryPerson
  syslumennGetVehicle: VehicleRegistration
  universityCareersStudentTrack?: Maybe<UniversityCareersStudentTrack>
  universityCareersStudentTrackHistory: UniversityCareersStudentTrackHistory
  universityGatewayApplicationById: Array<UniversityGatewayApplication>
  universityGatewayProgram: UniversityGatewayProgramDetails
  universityGatewayProgramFilters: Array<UniversityGatewayProgramFilter>
  universityGatewayPrograms: UniversityGatewayProgramsPaginated
  universityGatewayUniversities: Array<UniversityGatewayUniversity>
  userFamilyExamResults: EducationUserFamilyCompulsorySchoolCareer
  userNotification?: Maybe<NotificationResponse>
  userNotifications?: Maybe<Notifications>
  userProfileActorProfiles: UserProfileActorProfileResponse
  validateInstructor: PracticalExamInstructor
  validateMortgageCertificate: Array<MortgageCertificateValidationModel>
  vehicleBasicInfoByPermno?: Maybe<BasicVehicleInformation>
  vehicleBulkMileageRegistrationJobHistory?: Maybe<VehiclesBulkMileageRegistrationJobHistory>
  vehicleBulkMileageRegistrationRequestOverview?: Maybe<VehiclesBulkMileageRegistrationRequestOverview>
  vehicleBulkMileageRegistrationRequestStatus?: Maybe<VehiclesBulkMileageRegistrationRequestStatus>
  vehicleCoOwnerChangeValidation?: Maybe<OwnerChangeValidation>
  vehicleMileageDetails?: Maybe<VehicleMileageOverview>
  vehicleOperatorChangeChecksByPermno?: Maybe<VehicleOperatorChangeChecksByPermno>
  vehicleOperatorChangeValidation?: Maybe<OperatorChangeValidation>
  vehicleOwnerChangeValidation?: Maybe<OwnerChangeValidation>
  vehicleOwnerchangeChecksByPermno?: Maybe<VehicleOwnerchangeChecksByPermno>
  vehiclePlateOrderChecksByPermno?: Maybe<VehiclePlateOrderChecksByPermno>
  vehiclePlateOrderValidation?: Maybe<PlateOrderValidation>
  vehiclesDetail?: Maybe<VehiclesDetail>
  /** @deprecated Too slow. Use VehiclesListV2 when possible. */
  vehiclesList?: Maybe<VehiclesList>
  vehiclesListV2?: Maybe<VehiclesListV2>
  vehiclesListV3?: Maybe<VehiclesCurrentListResponse>
  vehiclesMileageRegistrationHistory?: Maybe<VehiclesMileageRegistrationHistory>
  vehiclesSearch?: Maybe<VehiclesVehicleSearch>
  vehiclesSearchLimit?: Maybe<Scalars['Float']>
  watsonAssistantChatIdentityToken: WatsonAssistantChatIdentityTokenResponse
  webSearchAutocomplete: WebSearchAutocomplete
  webVerdictById?: Maybe<WebVerdictByIdResponse>
  webVerdictCaseCategories: WebVerdictCaseCategoriesResponse
  webVerdictCaseTypes: WebVerdictCaseTypesResponse
  webVerdictKeywords: WebVerdictKeywordsResponse
  webVerdicts: WebVerdictsResponse
  workMachine?: Maybe<WorkMachine>
  workMachinesCollectionDocument?: Maybe<WorkMachinesCollectionDocument>
  workMachinesPaginatedCollection?: Maybe<WorkMachinesPaginatedCollection>
}

export type QueryHealthInsuranceAccidentStatusArgs = {
  input: HealthInsuranceAccidentStatusInput
}

export type QueryOjoiaGetApplicationCaseArgs = {
  input: OjoiaIdInput
}

export type QueryOjoiaGetCommentsArgs = {
  input: OjoiaGetCommentsInput
}

export type QueryOjoiaGetPdfArgs = {
  input: OjoiaIdInput
}

export type QueryUserProfileAdminProfileArgs = {
  nationalId: Scalars['String']
}

export type QueryUserProfileAdminProfilesArgs = {
  query: Scalars['String']
}

export type QueryAdminNotificationsArgs = {
  input?: InputMaybe<NotificationsInput>
  locale?: InputMaybe<Scalars['String']>
  nationalId: Scalars['String']
}

export type QueryAirDiscountSchemeFlightLegsArgs = {
  input: AirDiscountSchemeFlightLegsInput
}

export type QueryAircraftRegistryAllAircraftsArgs = {
  input: AircraftRegistryAllAircraftsInput
}

export type QueryApplicationApplicationArgs = {
  input: ApplicationApplicationInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryApplicationApplicationsArgs = {
  input?: InputMaybe<ApplicationApplicationsInput>
  locale?: InputMaybe<Scalars['String']>
}

export type QueryApplicationApplicationsAdminArgs = {
  input: ApplicationApplicationsAdminInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryApplicationApplicationsAdminStatisticsArgs = {
  input: ApplicationApplicationsAdminStatisticsInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryApplicationApplicationsInstitutionAdminArgs = {
  input: ApplicationApplicationsInstitutionAdminInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryApplicationPaymentStatusArgs = {
  applicationId: Scalars['String']
  locale?: InputMaybe<Scalars['String']>
}

export type QueryAreIndividualsValidArgs = {
  courseID: Scalars['String']
  input: ValidateSeminarIndividualsInput
  nationalIdOfRegisterer?: InputMaybe<Scalars['String']>
}

export type QueryAssetsDetailArgs = {
  input: GetRealEstateInput
}

export type QueryAssetsOverviewArgs = {
  input: GetMultiPropertyInput
}

export type QueryAssetsPropertyOwnersArgs = {
  input: GetPagingTypes
}

export type QueryAssetsUnitsOfUseArgs = {
  input: GetPagingTypes
}

export type QueryAttachmentPresignedUrlArgs = {
  input: AttachmentPresignedUrlInput
}

export type QueryAuthActorDelegationsArgs = {
  input?: InputMaybe<AuthActorDelegationInput>
}

export type QueryAuthAdminClientArgs = {
  input: AuthAdminClientInput
}

export type QueryAuthAdminClientsArgs = {
  input: AuthAdminClientsInput
}

export type QueryAuthAdminDelegationAdminArgs = {
  nationalId: Scalars['String']
}

export type QueryAuthAdminScopeArgs = {
  input: ScopeInput
}

export type QueryAuthAdminScopesArgs = {
  input: ScopesInput
}

export type QueryAuthAdminTenantArgs = {
  id: Scalars['String']
}

export type QueryAuthApiScopesArgs = {
  input: AuthApiScopesInput
}

export type QueryAuthDelegationArgs = {
  input: AuthDelegationInput
}

export type QueryAuthDelegationsArgs = {
  input?: InputMaybe<AuthDelegationsInput>
}

export type QueryAuthDomainsArgs = {
  input: AuthDomainsInput
}

export type QueryAuthScopeTreeArgs = {
  input: AuthApiScopesInput
}

export type QueryCompanyRegistryCompaniesArgs = {
  input: RskCompanyInfoSearchInput
}

export type QueryCompanyRegistryCompanyArgs = {
  input?: InputMaybe<RskCompanyInfoInput>
}

export type QueryConsultationPortalAdviceByCaseIdArgs = {
  input: ConsultationPortalCaseInput
}

export type QueryConsultationPortalAllUserAdvicesArgs = {
  input: ConsultationPortalUserAdvicesInput
}

export type QueryConsultationPortalCaseByIdArgs = {
  input: ConsultationPortalCaseInput
}

export type QueryConsultationPortalDocumentArgs = {
  documentId: Scalars['String']
}

export type QueryConsultationPortalGetCasesArgs = {
  input: ConsultationPortalCasesInput
}

export type QueryConsultationPortalSubscriptionTypeArgs = {
  input: ConsultationPortalCaseInput
}

export type QueryDigitalTachographTachoNetExistsArgs = {
  input: CheckTachoNetInput
}

export type QueryDocumentPageNumberArgs = {
  input: DocumentInput
}

export type QueryDocumentProviderPaperMailListArgs = {
  input?: InputMaybe<DocumentProviderPaperMailInput>
}

export type QueryDocumentV2Args = {
  input: DocumentInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryDocumentV2ConfirmActionsArgs = {
  input: DocumentConfirmActionsInput
}

export type QueryDocumentV2PdfRendererArgs = {
  input: DocumentPdfRendererInput
}

export type QueryDocumentsV2Args = {
  input: DocumentsV2DocumentsInput
}

export type QueryDrivingLicenseApplicationEligibilityArgs = {
  input: ApplicationEligibilityInput
}

export type QueryDrivingLicenseBookFindStudentArgs = {
  input: DrivingLicenseBookStudentsInput
}

export type QueryDrivingLicenseBookFindStudentForTeacherArgs = {
  input: DrivingLicenseBookStudentsInput
}

export type QueryDrivingLicenseBookPracticalDrivingLessonsArgs = {
  input: PracticalDrivingLessonsInput
}

export type QueryDrivingLicenseBookStudentArgs = {
  input: DrivingLicenseBookStudentInput
}

export type QueryDrivingLicenseBookStudentForTeacherArgs = {
  input: DrivingLicenseBookStudentInput
}

export type QueryDrivingLicenseBookStudentsForTeacherArgs = {
  licenseCategory: Scalars['String']
}

export type QueryDrivingLicenseStudentCanGetPracticePermitArgs = {
  input: StudentCanGetPracticePermitInput
}

export type QueryDrivingLicenseStudentInformationArgs = {
  nationalId: Scalars['String']
}

export type QueryEducationExamResultArgs = {
  familyIndex: Scalars['Int']
}

export type QueryEndorsementSystemFindEndorsementListsArgs = {
  input: PaginatedEndorsementListInput
}

export type QueryEndorsementSystemGetEndorsementsArgs = {
  input: PaginatedEndorsementInput
}

export type QueryEndorsementSystemGetGeneralPetitionEndorsementsArgs = {
  input: PaginatedEndorsementInput
}

export type QueryEndorsementSystemGetGeneralPetitionListArgs = {
  input: FindEndorsementListInput
}

export type QueryEndorsementSystemGetGeneralPetitionListsArgs = {
  input: EndorsementPaginationInput
}

export type QueryEndorsementSystemGetSingleEndorsementArgs = {
  input: FindEndorsementListInput
}

export type QueryEndorsementSystemGetSingleEndorsementListArgs = {
  input: FindEndorsementListInput
}

export type QueryEndorsementSystemUserEndorsementListsArgs = {
  input: PaginatedEndorsementListInput
}

export type QueryEndorsementSystemUserEndorsementsArgs = {
  input: EndorsementPaginationInput
}

export type QueryEnergyFundVehicleDetailsWithGrantArgs = {
  permno: Scalars['String']
}

export type QueryEnergyFundVehicleGrantArgs = {
  vin: Scalars['String']
}

export type QueryFinancialStatementsInaoClientFinancialLimitArgs = {
  input: InaoClientFinancialLimitInput
}

export type QueryFinancialStatementsInaoTaxInfoArgs = {
  year: Scalars['String']
}

export type QueryFishingLicensesArgs = {
  registrationNumber: Scalars['Float']
}

export type QueryFiskistofaGetQuotaTypesForCalendarYearArgs = {
  input: FiskistofaGetQuotaTypesForCalendarYearInput
}

export type QueryFiskistofaGetQuotaTypesForTimePeriodArgs = {
  input: FiskistofaGetQuotaTypesForTimePeriodInput
}

export type QueryFiskistofaGetShipStatusForCalendarYearArgs = {
  input: FiskistofaGetShipStatusForCalendarYearInput
}

export type QueryFiskistofaGetShipStatusForTimePeriodArgs = {
  input: FiskistofaGetShipStatusForTimePeriodInput
}

export type QueryFiskistofaGetShipsArgs = {
  input: FiskistofaGetShipsInput
}

export type QueryFiskistofaGetSingleShipArgs = {
  input: FiskistofaGetSingleShipInput
}

export type QueryFiskistofaUpdateShipQuotaStatusForTimePeriodArgs = {
  input: FiskistofaUpdateShipQuotaStatusForTimePeriodInput
}

export type QueryFiskistofaUpdateShipStatusForCalendarYearArgs = {
  input: FiskistofaUpdateShipStatusForCalendarYearInput
}

export type QueryFiskistofaUpdateShipStatusForTimePeriodArgs = {
  input: FiskistofaUpdateShipStatusForTimePeriodInput
}

export type QueryFormSystemApplicationArgs = {
  input: FormSystemApplicationInput
}

export type QueryFormSystemApplicationsArgs = {
  input: FormSystemApplicationsInput
}

export type QueryFormSystemFormArgs = {
  input: FormSystemGetFormInput
}

export type QueryFormSystemFormsArgs = {
  input: FormSystemGetFormsInput
}

export type QueryFormSystemOrganizationArgs = {
  input: FormSystemGetOrganizationInput
}

export type QueryFormSystemOrganizationAdminArgs = {
  input: FormSystemGetOrganizationAdminInput
}

export type QueryFriggOptionsArgs = {
  input: EducationFriggOptionsListInput
}

export type QueryGenericLicenseArgs = {
  input: GetGenericLicenseInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryGenericLicenseCollectionArgs = {
  input: GetGenericLicensesInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryGenericLicensesArgs = {
  input?: InputMaybe<GetGenericLicensesInput>
  locale?: InputMaybe<Scalars['String']>
}

export type QueryGetAlertBannerArgs = {
  input: GetAlertBannerInput
}

export type QueryGetAnchorPageArgs = {
  input: GetAnchorPageInput
}

export type QueryGetAnchorPagesArgs = {
  input: GetAnchorPagesInput
}

export type QueryGetAnnualStatusDocumentArgs = {
  input: GetAnnualStatusDocumentInput
}

export type QueryGetApiCatalogueArgs = {
  input: GetApiCatalogueInput
}

export type QueryGetApiServiceByIdArgs = {
  input: GetApiServiceInput
}

export type QueryGetApplicationInformationArgs = {
  applicationId: Scalars['String']
  nationalId: Scalars['String']
}

export type QueryGetArticleCategoriesArgs = {
  input: GetArticleCategoriesInput
}

export type QueryGetArticlesArgs = {
  input: GetArticlesInput
}

export type QueryGetAuctionArgs = {
  input: GetAuctionInput
}

export type QueryGetAuctionsArgs = {
  input: GetAuctionsInput
}

export type QueryGetBloodDonationRestrictionDetailsArgs = {
  input: GetBloodDonationRestrictionDetailsInput
}

export type QueryGetBloodDonationRestrictionGenericTagsArgs = {
  input: GetBloodDonationRestrictionGenericTagsInput
}

export type QueryGetBloodDonationRestrictionsArgs = {
  input: GetBloodDonationRestrictionsInput
}

export type QueryGetCategoryPagesArgs = {
  input: GetCategoryPagesInput
}

export type QueryGetChargeItemSubjectsByYearArgs = {
  input: GetChargeItemSubjectsByYearInput
}

export type QueryGetChargeTypePeriodSubjectArgs = {
  input: GetChargeTypePeriodSubjectInput
}

export type QueryGetChargeTypesByYearArgs = {
  input: GetChargeTypesByYearInput
}

export type QueryGetChargeTypesDetailsByYearArgs = {
  input: GetChargeTypesDetailsByYearInput
}

export type QueryGetContentSlugArgs = {
  input: GetContentSlugInput
}

export type QueryGetCustomPageArgs = {
  input: GetCustomPageInput
}

export type QueryGetCustomSubpageArgs = {
  input: GetCustomSubpageInput
}

export type QueryGetCustomerRecordsArgs = {
  input: GetCustomerRecordsInput
}

export type QueryGetDocumentArgs = {
  input: GetDocumentInput
}

export type QueryGetDocumentPageNumberArgs = {
  input: GetDocumentPageInput
}

export type QueryGetDocumentsListArgs = {
  input: GetFinanceDocumentsListInput
}

export type QueryGetDraftRegulationArgs = {
  input: GetDraftRegulationInput
}

export type QueryGetDraftRegulationPdfDownloadArgs = {
  input: GetDraftRegulationPdfDownloadInput
}

export type QueryGetDraftRegulationsArgs = {
  input: GetDraftRegulationsInput
}

export type QueryGetErrorPageArgs = {
  input: GetErrorPageInput
}

export type QueryGetEventsArgs = {
  input: GetEventsInput
}

export type QueryGetExamineeEligibilityArgs = {
  input: ExamineeEligibilityInput
}

export type QueryGetExamineeValidationArgs = {
  input: ExamineeValidationInput
}

export type QueryGetFeaturedSupportQnAsArgs = {
  input: GetFeaturedSupportQnAsInput
}

export type QueryGetFinanceDocumentArgs = {
  input: GetFinanceDocumentInput
}

export type QueryGetFinanceStatusDetailsArgs = {
  input: GetFinancialOverviewInput
}

export type QueryGetFrontpageArgs = {
  input: GetFrontpageInput
}

export type QueryGetGenericListItemBySlugArgs = {
  input: GetGenericListItemBySlugInput
}

export type QueryGetGenericListItemsArgs = {
  input: GetGenericListItemsInput
}

export type QueryGetGenericOverviewPageArgs = {
  input: GetGenericOverviewPageInput
}

export type QueryGetGenericPageArgs = {
  input: GetGenericPageInput
}

export type QueryGetGenericTagBySlugArgs = {
  input: GetGenericTagBySlugInput
}

export type QueryGetGenericTagsInTagGroupsArgs = {
  input: GetGenericTagsInTagGroupsInput
}

export type QueryGetGrantsArgs = {
  input: GetGrantsInput
}

export type QueryGetGroupedMenuArgs = {
  input: GetSingleMenuInput
}

export type QueryGetHomestaysArgs = {
  input: GetHomestaysInput
}

export type QueryGetIcelandicNameByIdArgs = {
  input: GetIcelandicNameByIdInput
}

export type QueryGetIcelandicNameByInitialLetterArgs = {
  input: GetIcelandicNameByInitialLetterInput
}

export type QueryGetIcelandicNameBySearchArgs = {
  input: GetIcelandicNameBySearchInput
}

export type QueryGetLifeEventPageArgs = {
  input: GetLifeEventPageInput
}

export type QueryGetLifeEventsForOverviewArgs = {
  input: GetLifeEventsInput
}

export type QueryGetLifeEventsInCategoryArgs = {
  input: GetLifeEventsInCategoryInput
}

export type QueryGetMachineModelsArgs = {
  type: Scalars['String']
}

export type QueryGetMachineParentCategoryByTypeAndModelArgs = {
  input: WorkMachinesParentCategoryByTypeAndModelInput
}

export type QueryGetMachineSubCategoriesArgs = {
  parentCategory: Scalars['String']
}

export type QueryGetMenuArgs = {
  input: GetMenuInput
}

export type QueryGetNamespaceArgs = {
  input: GetNamespaceInput
}

export type QueryGetNewsArgs = {
  input: GetNewsInput
}

export type QueryGetNewsDatesArgs = {
  input: GetNewsDatesInput
}

export type QueryGetOpenApiArgs = {
  input: GetOpenApiInput
}

export type QueryGetOpenDataPageArgs = {
  input: GetOpenDataPageInput
}

export type QueryGetOpenDataSubpageArgs = {
  input: GetOpenDataSubpageInput
}

export type QueryGetOperatingLicensesArgs = {
  input: GetOperatingLicensesInput
}

export type QueryGetOrganizationArgs = {
  input: GetOrganizationInput
}

export type QueryGetOrganizationByNationalIdArgs = {
  input: GetOrganizationByNationalIdInput
}

export type QueryGetOrganizationByTitleArgs = {
  input: GetOrganizationByTitleInput
}

export type QueryGetOrganizationPageArgs = {
  input: GetOrganizationPageInput
}

export type QueryGetOrganizationPageStandaloneSitemapLevel1Args = {
  input: GetOrganizationPageStandaloneSitemapLevel1Input
}

export type QueryGetOrganizationPageStandaloneSitemapLevel2Args = {
  input: GetOrganizationPageStandaloneSitemapLevel2Input
}

export type QueryGetOrganizationParentSubpageArgs = {
  input: GetOrganizationParentSubpageInput
}

export type QueryGetOrganizationSubpageArgs = {
  input: GetOrganizationSubpageInput
}

export type QueryGetOrganizationSubpageByIdArgs = {
  input: GetOrganizationSubpageByIdInput
}

export type QueryGetOrganizationTagsArgs = {
  input: GetOrganizationTagsInput
}

export type QueryGetOrganizationsArgs = {
  input?: InputMaybe<GetOrganizationsInput>
}

export type QueryGetParentalLeavesApplicationPaymentPlanArgs = {
  input: GetParentalLeavesApplicationPaymentPlanInput
}

export type QueryGetParentalLeavesEntitlementsArgs = {
  input: GetParentalLeavesEntitlementsInput
}

export type QueryGetParentalLeavesEstimatedPaymentPlanArgs = {
  input: GetParentalLeavesEstimatedPaymentPlanInput
}

export type QueryGetParentalLeavesPeriodEndDateArgs = {
  input: GetParentalLeavesPeriodEndDateInput
}

export type QueryGetParentalLeavesPeriodLengthArgs = {
  input: GetParentalLeavesPeriodLengthInput
}

export type QueryGetPaymentScheduleByIdArgs = {
  input: GetFinancePaymentScheduleInput
}

export type QueryGetPensionCalculationArgs = {
  input: SocialInsurancePensionCalculationInput
}

export type QueryGetProjectPageArgs = {
  input: GetProjectPageInput
}

export type QueryGetProviderOrganisationArgs = {
  nationalId: Scalars['String']
}

export type QueryGetPublicVehicleSearchArgs = {
  input: GetPublicVehicleSearchInput
}

export type QueryGetPublishedMaterialArgs = {
  input: GetPublishedMaterialInput
}

export type QueryGetRealEstateAddressArgs = {
  input: Scalars['String']
}

export type QueryGetRegulationArgs = {
  input: GetRegulationInput
}

export type QueryGetRegulationFromApiArgs = {
  input: GetRegulationFromApiInput
}

export type QueryGetRegulationImpactsByNameArgs = {
  input: GetRegulationImpactsInput
}

export type QueryGetRegulationOptionListArgs = {
  input: GetRegulationOptionListInput
}

export type QueryGetRegulationsArgs = {
  input: GetRegulationsInput
}

export type QueryGetRegulationsLawChaptersArgs = {
  input: GetRegulationsLawChaptersInput
}

export type QueryGetRegulationsMinistriesArgs = {
  input: GetRegulationsMinistriesInput
}

export type QueryGetRegulationsOptionSearchArgs = {
  input: GetRegulationsSearchInput
}

export type QueryGetRegulationsSearchArgs = {
  input: GetRegulationsSearchInput
}

export type QueryGetServicePortalAlertBannersArgs = {
  input: GetServicePortalAlertBannersInput
}

export type QueryGetServiceWebPageArgs = {
  input: GetServiceWebPageInput
}

export type QueryGetSingleArticleArgs = {
  input: GetSingleArticleInput
}

export type QueryGetSingleEntryTitleByIdArgs = {
  input: GetSingleEntryTitleByIdInput
}

export type QueryGetSingleEventArgs = {
  input: GetSingleEventInput
}

export type QueryGetSingleGrantArgs = {
  input: GetSingleGrantInput
}

export type QueryGetSingleManualArgs = {
  input: GetSingleManualInput
}

export type QueryGetSingleNewsArgs = {
  input: GetSingleNewsInput
}

export type QueryGetSingleSupportQnaArgs = {
  input: GetSingleSupportQnaInput
}

export type QueryGetStatisticsByKeysArgs = {
  input: StatisticsQueryInput
}

export type QueryGetStatisticsTotalArgs = {
  input?: InputMaybe<StatisticsInput>
}

export type QueryGetSubpageHeaderArgs = {
  input: GetSubpageHeaderInput
}

export type QueryGetSupportCategoriesArgs = {
  input: GetSupportCategoriesInput
}

export type QueryGetSupportCategoriesInOrganizationArgs = {
  input: GetSupportCategoriesInOrganizationInput
}

export type QueryGetSupportCategoryArgs = {
  input: GetSupportCategoryInput
}

export type QueryGetSupportQnAsArgs = {
  input: GetSupportQnAsInput
}

export type QueryGetSupportQnAsInCategoryArgs = {
  input: GetSupportQnAsInCategoryInput
}

export type QueryGetSyslumennElectronicIdStatusArgs = {
  input: GetElectronicIdInput
}

export type QueryGetTabSectionArgs = {
  input: GetTabSectionInput
}

export type QueryGetTeamMembersArgs = {
  input: GetTeamMembersInput
}

export type QueryGetTechnicalInfoInputsArgs = {
  parentCategory: Scalars['String']
  subCategory: Scalars['String']
}

export type QueryGetTemporaryCalculationsArgs = {
  input: SocialInsuranceTemporaryCalculationInput
}

export type QueryGetTranslationsArgs = {
  input: GetTranslationsInput
}

export type QueryGetTypeByRegistrationNumberArgs = {
  applicationId: Scalars['String']
  registrationNumber: Scalars['String']
}

export type QueryGetUrlArgs = {
  input: GetUrlInput
}

export type QueryGetVehicleTypeArgs = {
  input: Scalars['String']
}

export type QueryGetWorkerMachineByRegnoArgs = {
  regno: Scalars['String']
  rel: Scalars['String']
}

export type QueryGetWorkerMachineDetailsArgs = {
  id: Scalars['String']
  rel: Scalars['String']
}

export type QueryGetWorkerMachinePaymentRequiredArgs = {
  regNumber: Scalars['String']
}

export type QueryHealthDirectorateMedicineDispensationsAtcArgs = {
  input: MedicineDispensationsAtcInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateMedicineHistoryArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateOrganDonationArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectoratePrescriptionDocumentsArgs = {
  input: MedicinePrescriptionDocumentsInput
}

export type QueryHealthDirectoratePrescriptionsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateReferralArgs = {
  input: HealthDirectorateReferralInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateReferralsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateVaccinationsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateWaitlistArgs = {
  input: HealthDirectorateWaitlistInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthDirectorateWaitlistsArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryHealthInsuranceIsHealthInsuredArgs = {
  input?: InputMaybe<IsHealthInsuredInput>
}

export type QueryHmsLoansPaymentHistoryArgs = {
  input: GetHmsLoansPaymentHistoryInput
}

export type QueryHmsPropertyInfoArgs = {
  input: HmsPropertyInfoInput
}

export type QueryHmsSearchArgs = {
  input: HmsSearchInput
}

export type QueryHousingBenefitCalculatorCalculationArgs = {
  input: HousingBenefitCalculatorCalculationInput
}

export type QueryHousingBenefitCalculatorSpecificSupportCalculationArgs = {
  input: HousingBenefitCalculatorSpecificSupportCalculationInput
}

export type QueryHousingBenefitsPaymentsArgs = {
  input: HousingBenefitsPaymentsInput
}

export type QueryIcelandicGovernmentInstitutionVacanciesArgs = {
  input: IcelandicGovernmentInstitutionVacanciesInput
}

export type QueryIcelandicGovernmentInstitutionVacancyByIdArgs = {
  input: IcelandicGovernmentInstitutionVacancyByIdInput
}

export type QueryIdentityArgs = {
  input?: InputMaybe<IdentityInput>
}

export type QueryIntellectualPropertiesDesignArgs = {
  input: IntellectualPropertiesInput
}

export type QueryIntellectualPropertiesDesignImageArgs = {
  input: IntellectualPropertiesDesignImagesInput
}

export type QueryIntellectualPropertiesDesignImageListArgs = {
  input: IntellectualPropertiesInput
}

export type QueryIntellectualPropertiesPatentArgs = {
  input: IntellectualPropertiesInput
}

export type QueryIntellectualPropertiesTrademarkArgs = {
  input: IntellectualPropertiesInput
}

export type QueryIsEmployerValidArgs = {
  input: GetIsEmployerValidInput
}

export type QueryLawAndOrderCourtCaseDetailArgs = {
  input: LawAndOrderCourtCaseInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryLawAndOrderCourtCasesListArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryLawAndOrderLawyersArgs = {
  locale?: InputMaybe<Scalars['String']>
}

export type QueryLawAndOrderSubpoenaArgs = {
  input: LawAndOrderSubpoenaInput
  locale?: InputMaybe<Scalars['String']>
}

export type QueryListDocumentsV2Args = {
  input: GetDocumentListInput
}

export type QueryMalwareScanStatusArgs = {
  filename: Scalars['String']
}

export type QueryMunicipalitiesFinancialAidApplicationArgs = {
  input: MunicipalitiesFinancialAidApplicationInput
}

export type QueryMunicipalitiesFinancialAidApplicationSignedUrlArgs = {
  input: MunicipalitiesFinancialAidGetSignedUrlInput
}

export type QueryMyPlateOwnershipChecksByRegnoArgs = {
  regno: Scalars['String']
}

export type QueryNationalRegistryPersonArgs = {
  useFakeData?: InputMaybe<Scalars['Boolean']>
}

export type QueryNationalRegistryUserV2ChildGuardianshipArgs = {
  input: NationalRegistryXRoadChildGuardianshipInput
}

export type QueryOccupationalLicenseArgs = {
  input: OccupationalLicensesLicenseInput
}

export type QueryOfficialJournalOfIcelandAdvertArgs = {
  params: OfficialJournalOfIcelandAdvertSingleParams
}

export type QueryOfficialJournalOfIcelandAdvertsArgs = {
  input: OfficialJournalOfIcelandAdvertsInput
}

export type QueryOfficialJournalOfIcelandAdvertsSimilarArgs = {
  params: OfficialJournalOfIcelandAdvertSimilarParams
}

export type QueryOfficialJournalOfIcelandApplicationAdvertTemplateArgs = {
  input: OfficialJournalOfIcelandAdvertTemplateInput
}

export type QueryOfficialJournalOfIcelandApplicationGetAttachmentsArgs = {
  input: OfficialJournalOfIcelandApplicationGetApplicationAttachmentInput
}

export type QueryOfficialJournalOfIcelandApplicationGetPdfUrlArgs = {
  id: Scalars['String']
}

export type QueryOfficialJournalOfIcelandApplicationGetPriceArgs = {
  id: Scalars['String']
}

export type QueryOfficialJournalOfIcelandApplicationGetUserInvolvedPartiesArgs = {
  input: GetUserInvolvedPartiesInput
}

export type QueryOfficialJournalOfIcelandApplicationInvolvedPartySignatureArgs = {
  input: OfficialJournalOfIcelandApplicationInvolvedPartySignaturesInput
}

export type QueryOfficialJournalOfIcelandCasesInProgressArgs = {
  params: OfficialJournalOfIcelandQueryInput
}

export type QueryOfficialJournalOfIcelandCategoriesArgs = {
  params: OfficialJournalOfIcelandQueryInput
}

export type QueryOfficialJournalOfIcelandDepartmentArgs = {
  params: OfficialJournalOfIcelandAdvertSingleParams
}

export type QueryOfficialJournalOfIcelandDepartmentsArgs = {
  params: OfficialJournalOfIcelandQueryInput
}

export type QueryOfficialJournalOfIcelandInstitutionsArgs = {
  params: OfficialJournalOfIcelandQueryInput
}

export type QueryOfficialJournalOfIcelandMainCategoriesArgs = {
  params: OfficialJournalOfIcelandQueryInput
}

export type QueryOfficialJournalOfIcelandMainTypesArgs = {
  params: OfficialJournalOfIcelandMainTypesInput
}

export type QueryOfficialJournalOfIcelandTypeArgs = {
  params: OfficialJournalOfIcelandAdvertSingleParams
}

export type QueryOfficialJournalOfIcelandTypesArgs = {
  params: OfficialJournalOfIcelandTypesInput
}

export type QueryPaymentCatalogArgs = {
  input: PaymentCatalogInput
}

export type QueryPaymentScheduleDistributionArgs = {
  input: GetScheduleDistributionInput
}

export type QueryPaymentScheduleInitialScheduleArgs = {
  input: GetInitialScheduleInput
}

export type QueryPaymentsGetFlowArgs = {
  input: GetPaymentFlowInput
}

export type QueryPaymentsGetVerificationStatusArgs = {
  input: GetPaymentFlowInput
}

export type QueryPlateAvailableArgs = {
  input: PlateAvailabilityInput
}

export type QueryPracticalExamIsCompanyValidArgs = {
  nationalId: Scalars['String']
}

export type QueryRequestCorrectionOnMortgageCertificateArgs = {
  input: RequestCorrectionOnMortgageCertificateInput
}

export type QueryRightsPortalCopaymentBillsArgs = {
  input: RightsPortalCopaymentBillsInput
}

export type QueryRightsPortalCopaymentPeriodsArgs = {
  input: RightsPortalCopaymentPeriodInput
}

export type QueryRightsPortalDrugBillLinesArgs = {
  input: RightsPortalDrugsBillLineInput
}

export type QueryRightsPortalDrugBillsArgs = {
  input: RightsPortalDrugBillInput
}

export type QueryRightsPortalDrugsArgs = {
  input: RightsPortalDrugInput
}

export type QueryRightsPortalGetCertificateByIdArgs = {
  input: RightsPortalDrugCertificateInput
}

export type QueryRightsPortalHealthCenterDoctorsArgs = {
  input: RightsPortalHealthCenterDoctorsInput
}

export type QueryRightsPortalHealthCenterRegistrationHistoryArgs = {
  input?: InputMaybe<RightsPortalHealthCenterHistoryInput>
}

export type QueryRightsPortalPaginatedDentistsArgs = {
  input: RightsPortalDentistsInput
}

export type QueryRightsPortalPaymentOverviewArgs = {
  input: RightsPortalPaymentOverviewInput
}

export type QueryRightsPortalPaymentOverviewDocumentArgs = {
  input: RightsPortalPaymentOverviewDocumentInput
}

export type QueryRightsPortalUserDentistRegistrationArgs = {
  input?: InputMaybe<RightsPortalDentistBillsInput>
}

export type QuerySearchForAllPropertiesArgs = {
  input: SearchForPropertyInput
}

export type QuerySearchForPropertyArgs = {
  input: SearchForPropertyInput
}

export type QuerySearchResultsArgs = {
  query: SearcherInput
}

export type QuerySecondarySchoolProgramsBySchoolIdArgs = {
  isFreshman: Scalars['Boolean']
  schoolId: Scalars['String']
}

export type QuerySeminarsVerIsCompanyValidArgs = {
  nationalId: Scalars['String']
}

export type QuerySessionsListArgs = {
  input: SessionsInput
}

export type QueryShipRegistryShipSearchArgs = {
  input: ShipRegistryShipSearchInput
}

export type QuerySignatureCollectionAdminCanSignInfoArgs = {
  input: SignatureCollectionCanSignFromPaperInput
}

export type QuerySignatureCollectionAdminCandidateLookupArgs = {
  input: SignatureCollectionNationalIdInput
}

export type QuerySignatureCollectionAdminCurrentArgs = {
  input: SignatureCollectionCollectionTypeInput
}

export type QuerySignatureCollectionAdminListArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionAdminListStatusArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionAdminListsArgs = {
  input: SignatureCollectionIdInput
}

export type QuerySignatureCollectionAdminSignaturesArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionAllOpenListsArgs = {
  input: SignatureCollectionIdInput
}

export type QuerySignatureCollectionAreaSummaryReportArgs = {
  input: SignatureCollectionAreaSummaryReportInput
}

export type QuerySignatureCollectionCanSignFromPaperArgs = {
  input: SignatureCollectionCanSignFromPaperInput
}

export type QuerySignatureCollectionLatestForTypeArgs = {
  input: SignatureCollectionCollectionTypeInput
}

export type QuerySignatureCollectionListArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionListOverviewArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionListsForOwnerArgs = {
  input: SignatureCollectionIdInput
}

export type QuerySignatureCollectionListsForUserArgs = {
  input: SignatureCollectionIdInput
}

export type QuerySignatureCollectionSignatureLookupArgs = {
  input: SignatureCollectionSignatureLookupInput
}

export type QuerySignatureCollectionSignaturesArgs = {
  input: SignatureCollectionListIdInput
}

export type QuerySignatureCollectionSignedListArgs = {
  input: SignatureCollectionCollectionTypeInput
}

export type QuerySyslumennGetRegistryPersonArgs = {
  input: GetRegistryPersonInput
}

export type QuerySyslumennGetVehicleArgs = {
  input: GetVehicleInput
}

export type QueryUniversityCareersStudentTrackArgs = {
  input: UniversityCareersStudentInfoByUniversityInput
}

export type QueryUniversityCareersStudentTrackHistoryArgs = {
  input: UniversityCareersStudentInfoInput
}

export type QueryUniversityGatewayApplicationByIdArgs = {
  id: Scalars['String']
}

export type QueryUniversityGatewayProgramArgs = {
  input: UniversityGatewayGetPogramInput
}

export type QueryUserNotificationArgs = {
  id: Scalars['Float']
  locale?: InputMaybe<Scalars['String']>
}

export type QueryUserNotificationsArgs = {
  input?: InputMaybe<NotificationsInput>
  locale?: InputMaybe<Scalars['String']>
}

export type QueryValidateInstructorArgs = {
  input: ValidateInstructorInput
}

export type QueryValidateMortgageCertificateArgs = {
  input: ValidateMortgageCertificateInput
}

export type QueryVehicleBasicInfoByPermnoArgs = {
  permno: Scalars['String']
}

export type QueryVehicleBulkMileageRegistrationRequestOverviewArgs = {
  input: BulkVehicleMileageRequestOverviewInput
}

export type QueryVehicleBulkMileageRegistrationRequestStatusArgs = {
  input: BulkVehicleMileageRequestStatusInput
}

export type QueryVehicleCoOwnerChangeValidationArgs = {
  answers: CoOwnerChangeAnswers
}

export type QueryVehicleMileageDetailsArgs = {
  input: GetVehicleMileageInput
}

export type QueryVehicleOperatorChangeChecksByPermnoArgs = {
  permno: Scalars['String']
}

export type QueryVehicleOperatorChangeValidationArgs = {
  answers: OperatorChangeAnswers
}

export type QueryVehicleOwnerChangeValidationArgs = {
  answers: OwnerChangeAnswers
}

export type QueryVehicleOwnerchangeChecksByPermnoArgs = {
  permno: Scalars['String']
}

export type QueryVehiclePlateOrderChecksByPermnoArgs = {
  permno: Scalars['String']
}

export type QueryVehiclePlateOrderValidationArgs = {
  answers: PlateOrderAnswers
}

export type QueryVehiclesDetailArgs = {
  input: GetVehicleDetailInput
}

export type QueryVehiclesListArgs = {
  input?: InputMaybe<GetVehiclesForUserInput>
}

export type QueryVehiclesListV2Args = {
  input?: InputMaybe<GetVehiclesListV2Input>
}

export type QueryVehiclesListV3Args = {
  input?: InputMaybe<VehiclesListInputV3>
}

export type QueryVehiclesMileageRegistrationHistoryArgs = {
  input?: InputMaybe<GetVehicleMileageInput>
}

export type QueryVehiclesSearchArgs = {
  input: GetVehicleSearchInput
}

export type QueryWatsonAssistantChatIdentityTokenArgs = {
  input: WatsonAssistantChatIdentityTokenInput
}

export type QueryWebSearchAutocompleteArgs = {
  input: WebSearchAutocompleteInput
}

export type QueryWebVerdictByIdArgs = {
  input: WebVerdictByIdInput
}

export type QueryWebVerdictsArgs = {
  input: WebVerdictsInput
}

export type QueryWorkMachineArgs = {
  input: WorkMachinesInput
}

export type QueryWorkMachinesCollectionDocumentArgs = {
  input?: InputMaybe<WorkMachinesCollectionDocumentInput>
}

export type QueryWorkMachinesPaginatedCollectionArgs = {
  input?: InputMaybe<WorkMachinesCollectionInput>
}

export type QuestionAndAnswer = {
  __typename?: 'QuestionAndAnswer'
  answer: Array<Slice>
  id: Scalars['ID']
  publishDate?: Maybe<Scalars['String']>
  question: Scalars['String']
}

export type RealEstateAgent = {
  __typename?: 'RealEstateAgent'
  location?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type RealEstateDetail = {
  __typename?: 'RealEstateDetail'
  defaultAddress?: Maybe<Scalars['String']>
  propertyNumber?: Maybe<Scalars['String']>
  usage?: Maybe<Scalars['String']>
}

export type ReferenceLink = {
  __typename?: 'ReferenceLink'
  slug: Scalars['String']
  type: Scalars['String']
}

export type RegistryPerson = {
  __typename?: 'RegistryPerson'
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
}

export type RegulationAuthor = {
  __typename?: 'RegulationAuthor'
  authorId: Scalars['String']
  name: Scalars['String']
}

export type RegulationShippedAuthor = {
  __typename?: 'RegulationShippedAuthor'
  authorId: Scalars['String']
  name: Scalars['String']
}

export type RegulationSummaryAuthor = {
  __typename?: 'RegulationSummaryAuthor'
  authorId: Scalars['String']
  name: Scalars['String']
}

export enum RegulationViewTypes {
  Current = 'current',
  D = 'd',
  Diff = 'diff',
  Original = 'original',
}

export type ReligiousOrganization = {
  __typename?: 'ReligiousOrganization'
  director?: Maybe<Scalars['String']>
  homeAddress?: Maybe<Scalars['String']>
  municipality?: Maybe<Scalars['String']>
  name: Scalars['String']
  postalCode?: Maybe<Scalars['String']>
}

export type ReligiousOrganizationsResponse = {
  __typename?: 'ReligiousOrganizationsResponse'
  list: Array<ReligiousOrganization>
}

export type RequestCorrectionOnMortgageCertificateInput = {
  identityData: IdentityData
  propertyNumber: Scalars['String']
  userProfileData: UserProfileData
}

export type RequestCorrectionOnMortgageCertificateModel = {
  __typename?: 'RequestCorrectionOnMortgageCertificateModel'
  hasSentRequest: Scalars['Boolean']
}

export enum RequirementKey {
  BeRequiresHealthCertificate = 'beRequiresHealthCertificate',
  CurrentLocalResidency = 'currentLocalResidency',
  DeniedByService = 'deniedByService',
  DrivingAssessmentMissing = 'drivingAssessmentMissing',
  DrivingSchoolMissing = 'drivingSchoolMissing',
  HasDeprivation = 'hasDeprivation',
  HasHadValidCategoryForFiveYearsOrMore = 'hasHadValidCategoryForFiveYearsOrMore',
  HasNoPhoto = 'hasNoPhoto',
  HasNoSignature = 'hasNoSignature',
  HasPoints = 'hasPoints',
  LocalResidency = 'localResidency',
  NoExtendedDrivingLicense = 'noExtendedDrivingLicense',
  NoLicenseFound = 'noLicenseFound',
  NoTempLicense = 'noTempLicense',
  PersonNot17YearsOld = 'personNot17YearsOld',
  PersonNotAtLeast24YearsOld = 'personNotAtLeast24YearsOld',
  PersonNotFoundInNationalRegistry = 'personNotFoundInNationalRegistry',
}

export type Response = {
  __typename?: 'Response'
  created: Scalars['Boolean']
}

export type RightsPortalAddress = {
  __typename?: 'RightsPortalAddress'
  municipality?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
}

export type RightsPortalAidOrNutrition = {
  __typename?: 'RightsPortalAidOrNutrition'
  allowed12MonthPeriod?: Maybe<Scalars['Float']>
  available?: Maybe<Scalars['String']>
  expiring: Scalars['Boolean']
  explanation?: Maybe<Scalars['String']>
  id: Scalars['ID']
  iso: Scalars['String']
  location?: Maybe<Scalars['String']>
  maxMonthlyAmount?: Maybe<Scalars['Float']>
  maxUnitRefund?: Maybe<Scalars['String']>
  name: Scalars['String']
  nextAllowedMonth?: Maybe<Scalars['String']>
  refund: RightsPortalAidOrNutritionRefund
  renewalStatus?: Maybe<RightsPortalAidOrNutritionRenewalStatus>
  type: RightsPortalAidOrNutritionType
  validUntil?: Maybe<Scalars['DateTime']>
}

export type RightsPortalAidOrNutritionRefund = {
  __typename?: 'RightsPortalAidOrNutritionRefund'
  type: Scalars['String']
  value: Scalars['Int']
}

export enum RightsPortalAidOrNutritionRenewalStatus {
  NotValidForRenewal = 'NOT_VALID_FOR_RENEWAL',
  RenewalInProgress = 'RENEWAL_IN_PROGRESS',
  Valid = 'VALID',
  ValidForRenewal = 'VALID_FOR_RENEWAL',
}

export enum RightsPortalAidOrNutritionType {
  Aid = 'AID',
  Nutrition = 'NUTRITION',
}

export type RightsPortalCalculatorRequest = {
  drugs?: InputMaybe<Array<RightsPortalCalculatorRequestInput>>
}

export type RightsPortalCalculatorRequestInput = {
  lineNumber?: InputMaybe<Scalars['Float']>
  nordicCode?: InputMaybe<Scalars['String']>
  price?: InputMaybe<Scalars['Float']>
  units?: InputMaybe<Scalars['Float']>
}

export type RightsPortalCopaymentBill = {
  __typename?: 'RightsPortalCopaymentBill'
  date?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['Int']>
  insuranceAmount?: Maybe<Scalars['Int']>
  overpaid?: Maybe<Scalars['Int']>
  ownAmount?: Maybe<Scalars['Int']>
  serviceType?: Maybe<Scalars['String']>
  totalAmount?: Maybe<Scalars['Int']>
}

export type RightsPortalCopaymentBillResponse = {
  __typename?: 'RightsPortalCopaymentBillResponse'
  errors: Array<RightsPortalPaymentError>
  items: Array<RightsPortalCopaymentBill>
}

export type RightsPortalCopaymentBillsInput = {
  periodId: Scalars['Int']
}

export type RightsPortalCopaymentInsuranceStatus = {
  __typename?: 'RightsPortalCopaymentInsuranceStatus'
  code?: Maybe<Scalars['String']>
  display?: Maybe<Scalars['String']>
}

export type RightsPortalCopaymentPeriod = {
  __typename?: 'RightsPortalCopaymentPeriod'
  id?: Maybe<Scalars['Float']>
  maximumPayment?: Maybe<Scalars['Float']>
  month?: Maybe<Scalars['String']>
  monthPayment?: Maybe<Scalars['Float']>
  overpaid?: Maybe<Scalars['Float']>
  repaid?: Maybe<Scalars['Float']>
  status?: Maybe<RightsPortalCopaymentInsuranceStatus>
}

export type RightsPortalCopaymentPeriodInput = {
  dateFrom: Scalars['DateTime']
  dateTo: Scalars['DateTime']
}

export type RightsPortalCopaymentPeriodResponse = {
  __typename?: 'RightsPortalCopaymentPeriodResponse'
  errors: Array<RightsPortalPaymentError>
  items: Array<RightsPortalCopaymentPeriod>
}

export type RightsPortalCopaymentStatus = {
  __typename?: 'RightsPortalCopaymentStatus'
  basePayment?: Maybe<Scalars['Float']>
  insuranceStatus?: Maybe<RightsPortalCopaymentInsuranceStatus>
  maximumMonthlyPayment?: Maybe<Scalars['Float']>
  maximumPayment?: Maybe<Scalars['Float']>
}

export type RightsPortalDentist = {
  __typename?: 'RightsPortalDentist'
  id: Scalars['Float']
  name?: Maybe<Scalars['String']>
  practices?: Maybe<Array<RightsPortalDentistPractice>>
}

export type RightsPortalDentistBill = {
  __typename?: 'RightsPortalDentistBill'
  amount?: Maybe<Scalars['Int']>
  coveredAmount?: Maybe<Scalars['Int']>
  date?: Maybe<Scalars['DateTime']>
  number?: Maybe<Scalars['Int']>
  refundDate?: Maybe<Scalars['DateTime']>
}

export type RightsPortalDentistBillsInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
}

export type RightsPortalDentistPractice = {
  __typename?: 'RightsPortalDentistPractice'
  address?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  practice?: Maybe<Scalars['String']>
  region?: Maybe<Scalars['String']>
}

export type RightsPortalDentistRegisterInput = {
  id: Scalars['ID']
}

export type RightsPortalDentistRegisterResponse = {
  __typename?: 'RightsPortalDentistRegisterResponse'
  success: Scalars['Boolean']
}

export type RightsPortalDentistStatus = {
  __typename?: 'RightsPortalDentistStatus'
  canRegister?: Maybe<Scalars['Boolean']>
  contractType?: Maybe<Scalars['String']>
  isInsured?: Maybe<Scalars['Boolean']>
}

export type RightsPortalDentistsInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  contractType: Scalars['String']
  limit?: InputMaybe<Scalars['Float']>
  nameStartsWith?: InputMaybe<Scalars['String']>
  pageNumber?: InputMaybe<Scalars['Float']>
}

export type RightsPortalDrug = {
  __typename?: 'RightsPortalDrug'
  atcCode?: Maybe<Scalars['String']>
  form?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  nordicCode?: Maybe<Scalars['String']>
  packaging?: Maybe<Scalars['String']>
  price?: Maybe<Scalars['Float']>
  strength?: Maybe<Scalars['String']>
}

export type RightsPortalDrugBill = {
  __typename?: 'RightsPortalDrugBill'
  date?: Maybe<Scalars['DateTime']>
  description?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['ID']>
  totalCalculatedForPaymentStepAmount?: Maybe<Scalars['Float']>
  totalCopaymentAmount?: Maybe<Scalars['Float']>
  totalCustomerAmount?: Maybe<Scalars['Float']>
  totalExcessAmount?: Maybe<Scalars['Float']>
  totalInsuranceAmount?: Maybe<Scalars['Float']>
}

export type RightsPortalDrugBillInput = {
  paymentPeriodId: Scalars['ID']
}

export type RightsPortalDrugBillLine = {
  __typename?: 'RightsPortalDrugBillLine'
  billId?: Maybe<Scalars['ID']>
  calculatedForPaymentStepAmount?: Maybe<Scalars['Float']>
  copaymentAmount?: Maybe<Scalars['Float']>
  customerAmount?: Maybe<Scalars['Float']>
  drugName?: Maybe<Scalars['String']>
  excessAmount?: Maybe<Scalars['Float']>
  insuranceAmount?: Maybe<Scalars['Float']>
  quantity?: Maybe<Scalars['String']>
  salesPrice?: Maybe<Scalars['Float']>
  strength?: Maybe<Scalars['String']>
  units?: Maybe<Scalars['Float']>
}

export type RightsPortalDrugCalculation = {
  __typename?: 'RightsPortalDrugCalculation'
  calculatedCustomerPrice?: Maybe<Scalars['Float']>
  comment?: Maybe<Scalars['String']>
  customerPrice?: Maybe<Scalars['Float']>
  excessPrice?: Maybe<Scalars['Float']>
  fullPrice?: Maybe<Scalars['Float']>
  insurancePrice?: Maybe<Scalars['Float']>
  lineNumber?: Maybe<Scalars['Float']>
  referencePrice?: Maybe<Scalars['Float']>
}

export type RightsPortalDrugCalculatorInput = {
  drugCalculatorRequestDTO: RightsPortalCalculatorRequest
}

export type RightsPortalDrugCalculatorResponse = {
  __typename?: 'RightsPortalDrugCalculatorResponse'
  drugs?: Maybe<Array<RightsPortalDrugCalculation>>
  totalCustomerPrice?: Maybe<Scalars['Float']>
  totalPrice?: Maybe<Scalars['Float']>
  totalUnits?: Maybe<Scalars['Float']>
}

export type RightsPortalDrugCertificate = {
  __typename?: 'RightsPortalDrugCertificate'
  approved?: Maybe<Scalars['Boolean']>
  atcCode?: Maybe<Scalars['String']>
  atcName?: Maybe<Scalars['String']>
  comment?: Maybe<Scalars['String']>
  date?: Maybe<Scalars['DateTime']>
  doctor?: Maybe<Scalars['String']>
  documentId?: Maybe<Scalars['Float']>
  drugName?: Maybe<Scalars['String']>
  expired?: Maybe<Scalars['Boolean']>
  id?: Maybe<Scalars['Float']>
  methylDoctors?: Maybe<Array<RightsPortalMethylDoctor>>
  processed?: Maybe<Scalars['Boolean']>
  rejected?: Maybe<Scalars['Boolean']>
  valid?: Maybe<Scalars['Boolean']>
  validFrom?: Maybe<Scalars['DateTime']>
  validTo?: Maybe<Scalars['DateTime']>
}

export type RightsPortalDrugCertificateInput = {
  id: Scalars['Float']
}

export type RightsPortalDrugInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  limit?: InputMaybe<Scalars['Float']>
  nameStartsWith?: InputMaybe<Scalars['String']>
  pageNumber?: InputMaybe<Scalars['Float']>
}

export type RightsPortalDrugPeriod = {
  __typename?: 'RightsPortalDrugPeriod'
  active?: Maybe<Scalars['Boolean']>
  dateFrom?: Maybe<Scalars['DateTime']>
  dateTo?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['ID']>
  levelNumber?: Maybe<Scalars['Float']>
  levelPercentage?: Maybe<Scalars['Float']>
  numberOfBills?: Maybe<Scalars['Float']>
  paidAmount?: Maybe<Scalars['Float']>
  paymentStatus?: Maybe<Scalars['Float']>
}

export type RightsPortalDrugsBillLineInput = {
  billId: Scalars['ID']
  paymentPeriodId: Scalars['ID']
}

export type RightsPortalHealthCenter = {
  __typename?: 'RightsPortalHealthCenter'
  address?: Maybe<RightsPortalAddress>
  canRegister?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  name?: Maybe<Scalars['String']>
  region?: Maybe<Scalars['String']>
  waitListRegistration?: Maybe<Scalars['Boolean']>
}

export type RightsPortalHealthCenterDoctors = {
  __typename?: 'RightsPortalHealthCenterDoctors'
  availableFrom?: Maybe<Scalars['String']>
  availableTo?: Maybe<Scalars['String']>
  id?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
}

export type RightsPortalHealthCenterDoctorsInput = {
  id: Scalars['String']
}

export type RightsPortalHealthCenterHistoryInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
}

export type RightsPortalHealthCenterRecord = {
  __typename?: 'RightsPortalHealthCenterRecord'
  dateFrom?: Maybe<Scalars['DateTime']>
  dateTo?: Maybe<Scalars['DateTime']>
  doctor?: Maybe<Scalars['String']>
  healthCenterName?: Maybe<Scalars['String']>
}

export type RightsPortalHealthCenterRegisterInput = {
  doctorId?: InputMaybe<Scalars['Float']>
  id: Scalars['String']
}

export type RightsPortalHealthCenterRegisterResponse = {
  __typename?: 'RightsPortalHealthCenterRegisterResponse'
  success: Scalars['Boolean']
}

export type RightsPortalHealthCenterRegistrationHistory = {
  __typename?: 'RightsPortalHealthCenterRegistrationHistory'
  canRegister?: Maybe<Scalars['Boolean']>
  current?: Maybe<RightsPortalHealthCenterRecord>
  history?: Maybe<Array<RightsPortalHealthCenterRecord>>
  neighborhoodCenter?: Maybe<Scalars['String']>
}

export type RightsPortalInsuranceConfirmation = {
  __typename?: 'RightsPortalInsuranceConfirmation'
  contentType: Scalars['String']
  data: Scalars['String']
  fileName: Scalars['String']
}

export type RightsPortalInsuranceOverview = {
  __typename?: 'RightsPortalInsuranceOverview'
  ehicCardExpiryDate?: Maybe<Scalars['DateTime']>
  explanation?: Maybe<Scalars['String']>
  from?: Maybe<Scalars['DateTime']>
  isInsured: Scalars['Boolean']
  maximumPayment?: Maybe<Scalars['Int']>
  status?: Maybe<RightsPortalInsuranceStatus>
}

export type RightsPortalInsuranceStatus = {
  __typename?: 'RightsPortalInsuranceStatus'
  code?: Maybe<RightsPortalInsuranceStatusType>
  display?: Maybe<Scalars['String']>
}

export enum RightsPortalInsuranceStatusType {
  Alm = 'ALM',
  Atvl = 'ATVL',
  Barn = 'BARN',
  Baum = 'BAUM',
  El67 = 'EL67',
  Elli = 'ELLI',
  Grat = 'GRAT',
  Or = 'OR',
  Oror = 'OROR',
  Ungm = 'UNGM',
}

export type RightsPortalMethylDoctor = {
  __typename?: 'RightsPortalMethylDoctor'
  name?: Maybe<Scalars['String']>
}

export type RightsPortalPaginatedAidsOrNutrition = {
  __typename?: 'RightsPortalPaginatedAidsOrNutrition'
  data: Array<RightsPortalAidOrNutrition>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type RightsPortalPaginatedDentists = {
  __typename?: 'RightsPortalPaginatedDentists'
  data: Array<RightsPortalDentist>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type RightsPortalPaginatedDrug = {
  __typename?: 'RightsPortalPaginatedDrug'
  data: Array<RightsPortalDrug>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type RightsPortalPaginatedHealthCenters = {
  __typename?: 'RightsPortalPaginatedHealthCenters'
  data: Array<RightsPortalHealthCenter>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type RightsPortalPaginatedTherapies = {
  __typename?: 'RightsPortalPaginatedTherapies'
  data: Array<RightsPortalTherapy>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type RightsPortalPaymentError = {
  __typename?: 'RightsPortalPaymentError'
  status: RightsPortalPaymentErrorStatus
}

export enum RightsPortalPaymentErrorStatus {
  InternalServiceError = 'INTERNAL_SERVICE_ERROR',
  NotFound = 'NOT_FOUND',
}

export type RightsPortalPaymentOverview = {
  __typename?: 'RightsPortalPaymentOverview'
  bills?: Maybe<Array<RightsPortalPaymentOverviewBill>>
  credit?: Maybe<Scalars['Float']>
  debt?: Maybe<Scalars['Float']>
}

export type RightsPortalPaymentOverviewBill = {
  __typename?: 'RightsPortalPaymentOverviewBill'
  date?: Maybe<Scalars['DateTime']>
  documentId?: Maybe<Scalars['Float']>
  downloadUrl?: Maybe<Scalars['String']>
  insuranceAmount?: Maybe<Scalars['Float']>
  serviceType?: Maybe<RightsPortalPaymentOverviewServiceType>
  totalAmount?: Maybe<Scalars['Float']>
}

export type RightsPortalPaymentOverviewDocument = {
  __typename?: 'RightsPortalPaymentOverviewDocument'
  contentType?: Maybe<Scalars['String']>
  data?: Maybe<Scalars['String']>
  fileName?: Maybe<Scalars['String']>
}

export type RightsPortalPaymentOverviewDocumentInput = {
  documentId: Scalars['Int']
}

export type RightsPortalPaymentOverviewDocumentResponse = {
  __typename?: 'RightsPortalPaymentOverviewDocumentResponse'
  errors: Array<RightsPortalPaymentError>
  items: Array<RightsPortalPaymentOverviewDocument>
}

export type RightsPortalPaymentOverviewInput = {
  dateFrom: Scalars['DateTime']
  dateTo: Scalars['DateTime']
  serviceTypeCode: Scalars['String']
}

export type RightsPortalPaymentOverviewResponse = {
  __typename?: 'RightsPortalPaymentOverviewResponse'
  errors: Array<RightsPortalPaymentError>
  items: Array<RightsPortalPaymentOverview>
}

export type RightsPortalPaymentOverviewServiceType = {
  __typename?: 'RightsPortalPaymentOverviewServiceType'
  code?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
}

export type RightsPortalPaymentOverviewServiceTypeResponse = {
  __typename?: 'RightsPortalPaymentOverviewServiceTypeResponse'
  errors: Array<RightsPortalPaymentError>
  items: Array<RightsPortalPaymentOverviewServiceType>
}

export type RightsPortalTherapy = {
  __typename?: 'RightsPortalTherapy'
  id: Scalars['ID']
  name: Scalars['String']
  periods?: Maybe<Array<RightsPortalTherapyPeriod>>
  postStation?: Maybe<Scalars['String']>
  state?: Maybe<RightsPortalTherapyState>
}

export type RightsPortalTherapyPeriod = {
  __typename?: 'RightsPortalTherapyPeriod'
  from?: Maybe<Scalars['DateTime']>
  sessions?: Maybe<RightsPortalTherapySession>
  to?: Maybe<Scalars['DateTime']>
}

export type RightsPortalTherapySession = {
  __typename?: 'RightsPortalTherapySession'
  available: Scalars['Int']
  used: Scalars['Int']
}

export type RightsPortalTherapyState = {
  __typename?: 'RightsPortalTherapyState'
  code: Scalars['String']
  display: Scalars['String']
}

export type RightsPortalUserDentistInformation = {
  __typename?: 'RightsPortalUserDentistInformation'
  id?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  status?: Maybe<RightsPortalDentistStatus>
}

export type RightsPortalUserDentistRegistration = {
  __typename?: 'RightsPortalUserDentistRegistration'
  dentist?: Maybe<RightsPortalUserDentistInformation>
  history?: Maybe<Array<RightsPortalDentistBill>>
}

export type RskCompany = {
  __typename?: 'RskCompany'
  companyInfo?: Maybe<RskCompanyInfo>
  dateOfRegistration?: Maybe<Scalars['DateTime']>
  lastUpdated?: Maybe<Scalars['DateTime']>
  name: Scalars['String']
  nationalId: Scalars['ID']
  status: Scalars['String']
  vatNumber: Scalars['String']
}

export type RskCompanyAddress = {
  __typename?: 'RskCompanyAddress'
  country?: Maybe<Scalars['String']>
  locality?: Maybe<Scalars['String']>
  municipalityNumber?: Maybe<Scalars['String']>
  postalCode?: Maybe<Scalars['String']>
  streetAddress?: Maybe<Scalars['String']>
}

export type RskCompanyClassification = {
  __typename?: 'RskCompanyClassification'
  classificationSystem: Scalars['String']
  name: Scalars['String']
  number: Scalars['String']
  type: Scalars['String']
}

export type RskCompanyFormOfOperation = {
  __typename?: 'RskCompanyFormOfOperation'
  name: Scalars['String']
  type: Scalars['String']
}

export type RskCompanyInfo = {
  __typename?: 'RskCompanyInfo'
  address?: Maybe<RskCompanyAddress>
  formOfOperation: Array<RskCompanyFormOfOperation>
  legalDomicile?: Maybe<RskCompanyAddress>
  relatedParty: Array<RskCompanyRelatedParty>
  relationships?: Maybe<Array<RskCompanyRelatedParty>>
  vat: Array<RskCompanyVat>
}

export type RskCompanyInfoInput = {
  nationalId: Scalars['String']
}

export type RskCompanyInfoSearchInput = {
  /** Cursor for pagination as base64 encoded number */
  after?: InputMaybe<Scalars['String']>
  first: Scalars['Float']
  searchTerm: Scalars['String']
}

export type RskCompanyRelatedParty = {
  __typename?: 'RskCompanyRelatedParty'
  name: Scalars['String']
  nationalId: Scalars['ID']
  type: Scalars['String']
}

export type RskCompanySearchItems = {
  __typename?: 'RskCompanySearchItems'
  data: Array<RskCompany>
  pageInfo: PageInfoDto
}

export type RskCompanyVat = {
  __typename?: 'RskCompanyVat'
  classification?: Maybe<Array<RskCompanyClassification>>
  dateOfDeregistration?: Maybe<Scalars['DateTime']>
  dateOfRegistration?: Maybe<Scalars['DateTime']>
  vatNumber?: Maybe<Scalars['String']>
}

export type RunEndpointTestsInput = {
  documentId: Scalars['String']
  nationalId: Scalars['String']
  providerId: Scalars['String']
  recipient: Scalars['String']
}

export type ScopeInput = {
  scopeName: Scalars['String']
  tenantId: Scalars['String']
}

export type ScopesInput = {
  tenantId: Scalars['String']
}

export type SearchForPropertyInput = {
  propertyNumber: Scalars['String']
  propertyType?: InputMaybe<Scalars['String']>
}

export type SearchResult = {
  __typename?: 'SearchResult'
  items: Array<Items>
  processEntryCount?: Maybe<Scalars['Int']>
  tagCounts?: Maybe<Array<TagCount>>
  total: Scalars['Int']
  typesCount?: Maybe<Array<TypeCount>>
}

export enum SearchableContentTypes {
  WebArticle = 'webArticle',
  WebDigitalIcelandCommunityPage = 'webDigitalIcelandCommunityPage',
  WebDigitalIcelandService = 'webDigitalIcelandService',
  WebLifeEventPage = 'webLifeEventPage',
  WebLink = 'webLink',
  WebManual = 'webManual',
  WebManualChapterItem = 'webManualChapterItem',
  WebNews = 'webNews',
  WebOrganizationPage = 'webOrganizationPage',
  WebOrganizationSubpage = 'webOrganizationSubpage',
  WebProjectPage = 'webProjectPage',
  WebQna = 'webQNA',
  WebSubArticle = 'webSubArticle',
}

export enum SearchableTags {
  Category = 'category',
  Organization = 'organization',
  Processentry = 'processentry',
  ReferencedBy = 'referencedBy',
}

export type SearcherInput = {
  contentfulTags?: InputMaybe<Array<Scalars['String']>>
  countProcessEntry?: InputMaybe<Scalars['Boolean']>
  countTag?: InputMaybe<Array<SearchableTags>>
  countTypes?: InputMaybe<Scalars['Boolean']>
  excludedTags?: InputMaybe<Array<Tag>>
  highlightResults?: InputMaybe<Scalars['Boolean']>
  language?: InputMaybe<ContentLanguage>
  order?: InputMaybe<SortDirection>
  page?: InputMaybe<Scalars['Int']>
  queryString: Scalars['String']
  size?: InputMaybe<Scalars['Int']>
  sort?: InputMaybe<SortField>
  tags?: InputMaybe<Array<Tag>>
  types?: InputMaybe<Array<SearchableContentTypes>>
  useQuery?: InputMaybe<Scalars['String']>
}

export type SecondarySchoolProgram = {
  __typename?: 'SecondarySchoolProgram'
  id: Scalars['String']
  isSpecialNeedsProgram: Scalars['Boolean']
  nameEn: Scalars['String']
  nameIs: Scalars['String']
  registrationEndDate: Scalars['DateTime']
}

export type SectionWithImage = {
  __typename?: 'SectionWithImage'
  content?: Maybe<Array<Slice>>
  id: Scalars['ID']
  image?: Maybe<Image>
  title: Scalars['String']
}

export type SectionWithVideo = {
  __typename?: 'SectionWithVideo'
  html?: Maybe<Html>
  id: Scalars['ID']
  link?: Maybe<Link>
  locale: Scalars['String']
  showDividerOnTop?: Maybe<Scalars['Boolean']>
  showTitle?: Maybe<Scalars['Boolean']>
  title: Scalars['String']
  video?: Maybe<EmbeddedVideo>
}

export type SeminarIndividual = {
  email?: InputMaybe<Scalars['String']>
  nationalId?: InputMaybe<Scalars['String']>
}

export type SeminarsCompanyValidationItem = {
  __typename?: 'SeminarsCompanyValidationItem'
  mayPayWithAnAccount?: Maybe<Scalars['Boolean']>
  nationalId?: Maybe<Scalars['String']>
}

export type SeminarsIndividualValidationItem = {
  __typename?: 'SeminarsIndividualValidationItem'
  errorCode?: Maybe<Scalars['String']>
  errorMessage?: Maybe<Scalars['String']>
  errorMessageEn?: Maybe<Scalars['String']>
  mayTakeCourse?: Maybe<Scalars['Boolean']>
  nationalID?: Maybe<Scalars['String']>
}

export type Service = {
  __typename?: 'Service'
  access: Array<AccessCategory>
  data: Array<DataCategory>
  description: Scalars['String']
  environments: Array<ServiceEnvironment>
  id: Scalars['ID']
  owner: Scalars['String']
  pricing: Array<PricingCategory>
  summary: Scalars['String']
  title: Scalars['String']
  type: Array<TypeCategory>
}

export type ServiceDetail = {
  __typename?: 'ServiceDetail'
  data: Array<DataCategory>
  description: Scalars['String']
  links: ExternalLinks
  pricing: Array<PricingCategory>
  summary: Scalars['String']
  title: Scalars['String']
  type: TypeCategory
  version: Scalars['ID']
  xroadIdentifier: XroadIdentifier
}

export type ServiceEnvironment = {
  __typename?: 'ServiceEnvironment'
  details: Array<ServiceDetail>
  environment: Environment
}

export type ServiceWebFormsInput = {
  category: Scalars['String']
  email: Scalars['String']
  institutionSlug: Scalars['String']
  lang?: InputMaybe<Scalars['String']>
  message: Scalars['String']
  name: Scalars['String']
  subject?: InputMaybe<Scalars['String']>
  syslumadur: Scalars['String']
}

export type ServiceWebPage = {
  __typename?: 'ServiceWebPage'
  alertBanner?: Maybe<AlertBanner>
  contactFormDisclaimer?: Maybe<Array<Slice>>
  emailConfig?: Maybe<ServiceWebPageEmailConfig>
  footerItems?: Maybe<Array<FooterItem>>
  id: Scalars['ID']
  organization?: Maybe<Organization>
  slices: Array<Slice>
  title: Scalars['String']
}

export type ServiceWebPageEmailConfig = {
  __typename?: 'ServiceWebPageEmailConfig'
  emails: Array<ServiceWebPageEmailConfigItem>
}

export type ServiceWebPageEmailConfigItem = {
  __typename?: 'ServiceWebPageEmailConfigItem'
  emailList: Array<Scalars['String']>
  supportCategoryId: Scalars['String']
}

export type SessionsInput = {
  after?: InputMaybe<Scalars['String']>
  before?: InputMaybe<Scalars['String']>
  fromDate?: InputMaybe<Scalars['DateTime']>
  limit?: InputMaybe<Scalars['Int']>
  nationalId?: InputMaybe<Scalars['String']>
  order?: InputMaybe<Order>
  toDate?: InputMaybe<Scalars['DateTime']>
}

export type SessionsPaginatedSessionResponse = {
  __typename?: 'SessionsPaginatedSessionResponse'
  data: Array<SessionsSession>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type SessionsSession = {
  __typename?: 'SessionsSession'
  actor: Identity
  client: AuthClient
  device?: Maybe<Scalars['String']>
  id: Scalars['ID']
  ip: Scalars['String']
  ipLocation?: Maybe<Scalars['String']>
  subject: Identity
  timestamp: Scalars['DateTime']
  userAgent: Scalars['String']
}

export type SessionsSessionClientArgs = {
  lang?: InputMaybe<Scalars['String']>
}

export type ShipDetail = {
  __typename?: 'ShipDetail'
  initialRegistrationDate?: Maybe<Scalars['DateTime']>
  mainMeasurements?: Maybe<ShipMeasurements>
  name?: Maybe<Scalars['String']>
  shipRegistrationNumber?: Maybe<Scalars['String']>
  usageType?: Maybe<Scalars['String']>
}

export type ShipMeasurements = {
  __typename?: 'ShipMeasurements'
  bruttoWeightTons?: Maybe<Scalars['String']>
  length?: Maybe<Scalars['String']>
}

export type ShipRegistryShip = {
  __typename?: 'ShipRegistryShip'
  grossTonnage?: Maybe<Scalars['Float']>
  length?: Maybe<Scalars['Float']>
  manufactionYear?: Maybe<Scalars['String']>
  manufacturer?: Maybe<Scalars['String']>
  owners?: Maybe<Array<ShipRegistryShipOwner>>
  portOfRegistry?: Maybe<Scalars['String']>
  regStatus?: Maybe<Scalars['String']>
  region?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['Float']>
  shipName?: Maybe<Scalars['String']>
  shipType?: Maybe<Scalars['String']>
}

export type ShipRegistryShipOwner = {
  __typename?: 'ShipRegistryShipOwner'
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  sharePercentage?: Maybe<Scalars['Float']>
}

export type ShipRegistryShipSearch = {
  __typename?: 'ShipRegistryShipSearch'
  ships: Array<ShipRegistryShip>
}

export type ShipRegistryShipSearchInput = {
  qs: Scalars['String']
}

export type SidebarCard = {
  __typename?: 'SidebarCard'
  contentString: Scalars['String']
  id: Scalars['ID']
  image?: Maybe<Image>
  link?: Maybe<Link>
  title: Scalars['String']
  type: Scalars['String']
}

export type SignatureCollection = {
  __typename?: 'SignatureCollection'
  areas: Array<SignatureCollectionArea>
  candidates: Array<SignatureCollectionCandidate>
  collectionType: SignatureCollectionCollectionType
  endTime: Scalars['DateTime']
  id: Scalars['ID']
  isActive: Scalars['Boolean']
  name: Scalars['String']
  startTime: Scalars['DateTime']
  status: CollectionStatus
}

export type SignatureCollectionAddListsInput = {
  areaIds?: InputMaybe<Array<Scalars['String']>>
  candidateId: Scalars['String']
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
}

export type SignatureCollectionArea = {
  __typename?: 'SignatureCollectionArea'
  id: Scalars['ID']
  max?: Maybe<Scalars['Float']>
  min: Scalars['Float']
  name: Scalars['String']
}

export type SignatureCollectionAreaBase = {
  __typename?: 'SignatureCollectionAreaBase'
  id: Scalars['ID']
  name: Scalars['String']
}

export type SignatureCollectionAreaInput = {
  areaId: Scalars['String']
}

export type SignatureCollectionAreaSummaryReport = {
  __typename?: 'SignatureCollectionAreaSummaryReport'
  id: Scalars['ID']
  lists: Array<SignatureCollectionListSummary>
  max?: Maybe<Scalars['Float']>
  min: Scalars['Float']
  name: Scalars['String']
}

export type SignatureCollectionAreaSummaryReportInput = {
  areaId: Scalars['String']
  collectionId: Scalars['String']
}

export type SignatureCollectionBulk = {
  __typename?: 'SignatureCollectionBulk'
  failed: Array<SignatureCollectionNationalIds>
  success: Array<SignatureCollectionNationalIds>
}

export type SignatureCollectionCanSignFromPaperInput = {
  collectionType: SignatureCollectionCollectionType
  listId: Scalars['String']
  signeeNationalId: Scalars['String']
}

export type SignatureCollectionCancelListsInput = {
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
  listIds?: InputMaybe<Array<Scalars['String']>>
}

export type SignatureCollectionCandidate = {
  __typename?: 'SignatureCollectionCandidate'
  collectionId?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  id: Scalars['ID']
  name: Scalars['String']
  nationalId: Scalars['String']
  partyBallotLetter?: Maybe<Scalars['String']>
  phone?: Maybe<Scalars['String']>
}

export type SignatureCollectionCandidateIdInput = {
  candidateId: Scalars['String']
}

export type SignatureCollectionCandidateLookUp = {
  __typename?: 'SignatureCollectionCandidateLookUp'
  address?: Maybe<Scalars['String']>
  canCreate: Scalars['Boolean']
  canCreateInfo?: Maybe<Array<Scalars['String']>>
  name: Scalars['String']
  nationalId: Scalars['String']
}

export enum SignatureCollectionCollectionType {
  LocalGovernmental = 'LocalGovernmental',
  OtherSameRulesAsParliamentary = 'OtherSameRulesAsParliamentary',
  OtherUnknown = 'OtherUnknown',
  Parliamentary = 'Parliamentary',
  Presidential = 'Presidential',
  Referendum = 'Referendum',
  ResidentPoll = 'ResidentPoll',
  SpecialLocalGovernmental = 'SpecialLocalGovernmental',
}

export type SignatureCollectionCollectionTypeInput = {
  collectionType: SignatureCollectionCollectionType
}

export type SignatureCollectionCollector = {
  __typename?: 'SignatureCollectionCollector'
  name: Scalars['String']
  nationalId: Scalars['String']
}

export type SignatureCollectionExtendDeadlineInput = {
  listId: Scalars['String']
  newEndDate: Scalars['DateTime']
}

export type SignatureCollectionIdInput = {
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
}

export type SignatureCollectionList = {
  __typename?: 'SignatureCollectionList'
  active?: Maybe<Scalars['Boolean']>
  area: SignatureCollectionArea
  candidate: SignatureCollectionCandidate
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
  collectors?: Maybe<Array<SignatureCollectionCollector>>
  endTime: Scalars['DateTime']
  id: Scalars['ID']
  maxReached: Scalars['Boolean']
  numberOfSignatures?: Maybe<Scalars['Float']>
  reviewed: Scalars['Boolean']
  slug: Scalars['String']
  startTime: Scalars['DateTime']
  title: Scalars['String']
}

export type SignatureCollectionListBase = {
  __typename?: 'SignatureCollectionListBase'
  active?: Maybe<Scalars['Boolean']>
  area: SignatureCollectionArea
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
  endTime: Scalars['DateTime']
  id: Scalars['ID']
  maxReached: Scalars['Boolean']
  numberOfSignatures?: Maybe<Scalars['Float']>
  reviewed: Scalars['Boolean']
  slug: Scalars['String']
  startTime: Scalars['DateTime']
  title: Scalars['String']
}

export type SignatureCollectionListBulkUploadInput = {
  listId: Scalars['String']
  upload: Array<BulkUploadUser>
}

export type SignatureCollectionListIdInput = {
  listId: Scalars['String']
}

export type SignatureCollectionListIdWithTypeInput = {
  collectionType: SignatureCollectionCollectionType
  listId: Scalars['String']
}

export type SignatureCollectionListInput = {
  /** If not provided, the list will be available in all areas */
  areas?: InputMaybe<Array<SignatureCollectionAreaInput>>
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
  owner: SignatureCollectionOwnerInput
}

export type SignatureCollectionListNationalIdsInput = {
  listId: Scalars['String']
  nationalIds: Array<Scalars['String']>
}

export type SignatureCollectionListStatus = {
  __typename?: 'SignatureCollectionListStatus'
  status: ListStatus
}

export type SignatureCollectionListSummary = {
  __typename?: 'SignatureCollectionListSummary'
  candidateName: Scalars['String']
  listName: Scalars['String']
  nrOfDigitalSignatures: Scalars['Float']
  nrOfPaperSignatures: Scalars['Float']
  nrOfSignatures: Scalars['Float']
  partyBallotLetter: Scalars['String']
}

export type SignatureCollectionNationalIdInput = {
  collectionType: SignatureCollectionCollectionType
  nationalId: Scalars['String']
}

export type SignatureCollectionNationalIds = {
  __typename?: 'SignatureCollectionNationalIds'
  nationalId: Scalars['String']
  reason?: Maybe<Scalars['String']>
}

export type SignatureCollectionNationalIdsInput = {
  collectionId: Scalars['String']
  nationalIds: Array<Scalars['String']>
}

export type SignatureCollectionOwnedList = {
  __typename?: 'SignatureCollectionOwnedList'
  area: SignatureCollectionArea
  id: Scalars['ID']
  title: Scalars['String']
}

export type SignatureCollectionOwnerInput = {
  email: Scalars['String']
  name: Scalars['String']
  nationalId: Scalars['String']
  phone: Scalars['String']
}

export type SignatureCollectionSignature = {
  __typename?: 'SignatureCollectionSignature'
  created: Scalars['DateTime']
  id: Scalars['ID']
  isDigital: Scalars['Boolean']
  listId: Scalars['String']
  listTitle?: Maybe<Scalars['String']>
  pageNumber?: Maybe<Scalars['Float']>
  signee: SignatureCollectionSigneeBase
  valid?: Maybe<Scalars['Boolean']>
}

export type SignatureCollectionSignatureIdInput = {
  signatureId: Scalars['String']
}

export type SignatureCollectionSignatureLookupInput = {
  collectionId: Scalars['String']
  nationalId: Scalars['String']
}

export type SignatureCollectionSignatureUpdateInput = {
  pageNumber: Scalars['Float']
  signatureId: Scalars['String']
}

export type SignatureCollectionSignedList = {
  __typename?: 'SignatureCollectionSignedList'
  active?: Maybe<Scalars['Boolean']>
  area: SignatureCollectionArea
  canUnsign: Scalars['Boolean']
  collectionId: Scalars['String']
  collectionType: SignatureCollectionCollectionType
  endTime: Scalars['DateTime']
  id: Scalars['ID']
  isDigital: Scalars['Boolean']
  isValid: Scalars['Boolean']
  maxReached: Scalars['Boolean']
  numberOfSignatures?: Maybe<Scalars['Float']>
  pageNumber?: Maybe<Scalars['Float']>
  reviewed: Scalars['Boolean']
  signedDate: Scalars['DateTime']
  slug: Scalars['String']
  startTime: Scalars['DateTime']
  title: Scalars['String']
}

export type SignatureCollectionSignee = {
  __typename?: 'SignatureCollectionSignee'
  address?: Maybe<Scalars['String']>
  area?: Maybe<SignatureCollectionAreaBase>
  canCreate: Scalars['Boolean']
  canCreateInfo?: Maybe<Array<Scalars['String']>>
  canSign?: Maybe<Scalars['Boolean']>
  canSignInfo?: Maybe<Array<Scalars['String']>>
  candidate?: Maybe<SignatureCollectionCandidate>
  isOwner: Scalars['Boolean']
  name: Scalars['String']
  nationalId: Scalars['String']
  ownedLists?: Maybe<Array<SignatureCollectionOwnedList>>
  signature?: Maybe<SignatureCollectionSignature>
}

export type SignatureCollectionSigneeBase = {
  __typename?: 'SignatureCollectionSigneeBase'
  address?: Maybe<Scalars['String']>
  name: Scalars['String']
  nationalId: Scalars['String']
}

export type SignatureCollectionSlug = {
  __typename?: 'SignatureCollectionSlug'
  slug: Scalars['String']
}

export type SignatureCollectionSuccess = {
  __typename?: 'SignatureCollectionSuccess'
  reasons?: Maybe<Array<Scalars['String']>>
  success: Scalars['Boolean']
}

export type SignatureCollectionUploadPaperSignatureInput = {
  listId: Scalars['String']
  nationalId: Scalars['String']
  pageNumber: Scalars['Float']
}

export type SimpleProperties = {
  __typename?: 'SimpleProperties'
  defaultAddress?: Maybe<PropertyLocation>
  propertyNumber?: Maybe<Scalars['String']>
}

export type Slice =
  | AccordionSlice
  | AnchorPageListSlice
  | Asset
  | BulletListSlice
  | Chart
  | ChartComponent
  | ChartNumberBox
  | ConnectedComponent
  | ContactUs
  | Districts
  | EmailSignup
  | Embed
  | EmbeddedVideo
  | EventSlice
  | FaqList
  | FeaturedArticles
  | FeaturedEvents
  | FeaturedLinks
  | FeaturedSupportQnAs
  | Form
  | GenericList
  | GrantCardsList
  | GraphCard
  | HeadingSlice
  | Html
  | Image
  | IntroLinkImage
  | LatestEventsSlice
  | LatestGenericListItems
  | LatestNewsSlice
  | LinkCard
  | LinkCardSection
  | LogoListSlice
  | MultipleStatistics
  | OneColumnText
  | OrganizationParentSubpageList
  | OverviewLinks
  | PowerBiSlice
  | ProcessEntry
  | SectionWithImage
  | SectionWithVideo
  | SidebarCard
  | SliceDropdown
  | Statistics
  | Stepper
  | StorySlice
  | TabSection
  | TableSlice
  | TeamList
  | TellUsAStory
  | TimelineSlice
  | TwoColumnText

export type SliceDropdown = {
  __typename?: 'SliceDropdown'
  alphabeticallyOrdered?: Maybe<Scalars['Boolean']>
  dropdownLabel?: Maybe<Scalars['String']>
  id: Scalars['ID']
  slices: Array<OneColumnText>
}

export type SocialInsuranceGeneralUnion = {
  __typename?: 'SocialInsuranceGeneralUnion'
  name: Scalars['String']
  nationalId: Scalars['String']
}

export type SocialInsuranceIncomePlan = {
  __typename?: 'SocialInsuranceIncomePlan'
  incomeCategories: Array<SocialInsuranceIncomePlanIncomeCategory>
  isEligibleForChange: SocialInsuranceIncomePlanEligbility
  registrationDate: Scalars['DateTime']
  status: SocialInsuranceIncomePlanStatus
}

export type SocialInsuranceIncomePlanEligbility = {
  __typename?: 'SocialInsuranceIncomePlanEligbility'
  isEligible?: Maybe<Scalars['Boolean']>
  reason?: Maybe<Scalars['String']>
}

export type SocialInsuranceIncomePlanIncomeCategory = {
  __typename?: 'SocialInsuranceIncomePlanIncomeCategory'
  annualSum: Scalars['Int']
  currency?: Maybe<Scalars['String']>
  name: Scalars['String']
  typeName: Scalars['String']
}

export enum SocialInsuranceIncomePlanStatus {
  Accepted = 'ACCEPTED',
  Cancelled = 'CANCELLED',
  InProgress = 'IN_PROGRESS',
  Unknown = 'UNKNOWN',
}

export type SocialInsuranceIncomeType = {
  amountApr?: InputMaybe<Scalars['Int']>
  amountAug?: InputMaybe<Scalars['Int']>
  amountDec?: InputMaybe<Scalars['Int']>
  amountFeb?: InputMaybe<Scalars['Int']>
  amountJan?: InputMaybe<Scalars['Int']>
  amountJul?: InputMaybe<Scalars['Int']>
  amountJun?: InputMaybe<Scalars['Int']>
  amountMar?: InputMaybe<Scalars['Int']>
  amountMay?: InputMaybe<Scalars['Int']>
  amountNov?: InputMaybe<Scalars['Int']>
  amountOct?: InputMaybe<Scalars['Int']>
  amountSep?: InputMaybe<Scalars['Int']>
  currencyCode?: InputMaybe<Scalars['String']>
  incomeCategoryCode?: InputMaybe<Scalars['String']>
  incomeCategoryName?: InputMaybe<Scalars['String']>
  incomeCategoryNumber?: InputMaybe<Scalars['Int']>
  incomeTypeCode?: InputMaybe<Scalars['String']>
  incomeTypeName?: InputMaybe<Scalars['String']>
  incomeTypeNumber?: InputMaybe<Scalars['Int']>
}

export type SocialInsuranceMedicalDocumentsHealthGoals = {
  __typename?: 'SocialInsuranceMedicalDocumentsHealthGoals'
  goalDescription?: Maybe<Scalars['String']>
  measures?: Maybe<Scalars['String']>
}

export type SocialInsuranceMedicalDocumentsRehabilitationPlan = {
  __typename?: 'SocialInsuranceMedicalDocumentsRehabilitationPlan'
  activityAndParticipationGoals?: Maybe<SocialInsuranceMedicalDocumentsHealthGoals>
  mentalHealthGoals?: Maybe<SocialInsuranceMedicalDocumentsHealthGoals>
  physicalHealthGoals?: Maybe<SocialInsuranceMedicalDocumentsHealthGoals>
  plannedEndDate?: Maybe<Scalars['DateTime']>
  rehabilitationFocusAndStrategy?: Maybe<Scalars['String']>
  serviceProvider?: Maybe<SocialInsuranceMedicalDocumentsServiceProvider>
  startDate?: Maybe<Scalars['DateTime']>
}

export type SocialInsuranceMedicalDocumentsServiceProvider = {
  __typename?: 'SocialInsuranceMedicalDocumentsServiceProvider'
  coordinatorName?: Maybe<Scalars['String']>
  coordinatorTitle?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
  serviceProviderName?: Maybe<Scalars['String']>
  workplace?: Maybe<Scalars['String']>
}

export type SocialInsurancePayment = {
  __typename?: 'SocialInsurancePayment'
  markWithAsterisk?: Maybe<Scalars['Boolean']>
  monthlyPaymentHistory: Array<SocialInsurancePaymentMonth>
  name: Scalars['String']
  totalYearCumulativeAmount: Scalars['Int']
}

export type SocialInsurancePaymentGroup = {
  __typename?: 'SocialInsurancePaymentGroup'
  monthlyPaymentHistory: Array<SocialInsurancePaymentMonth>
  name: Scalars['String']
  payments: Array<SocialInsurancePayment>
  totalYearCumulativeAmount: Scalars['Int']
  type: SocialInsurancePaymentGroupType
}

export enum SocialInsurancePaymentGroupType {
  Debt = 'DEBT',
  Paid = 'PAID',
  Payments = 'PAYMENTS',
  Subtraction = 'SUBTRACTION',
  Unknown = 'UNKNOWN',
}

export type SocialInsurancePaymentMonth = {
  __typename?: 'SocialInsurancePaymentMonth'
  amount: Scalars['Int']
  monthIndex: Scalars['Int']
}

export type SocialInsurancePaymentPlan = {
  __typename?: 'SocialInsurancePaymentPlan'
  paymentGroups?: Maybe<Array<SocialInsurancePaymentGroup>>
  totalPayments?: Maybe<Scalars['Int']>
  totalPaymentsReceived?: Maybe<Scalars['Int']>
  totalPaymentsSubtraction?: Maybe<Scalars['Int']>
}

export type SocialInsurancePayments = {
  __typename?: 'SocialInsurancePayments'
  nextPayment?: Maybe<Scalars['Int']>
  previousPayment?: Maybe<Scalars['Int']>
}

export enum SocialInsurancePensionCalculationBasePensionType {
  Disability = 'Disability',
  FishermanRetirement = 'FishermanRetirement',
  HalfRetirement = 'HalfRetirement',
  NewSystem = 'NewSystem',
  NewSystemDisability = 'NewSystemDisability',
  NewSystemMedicalAndRehabilitation = 'NewSystemMedicalAndRehabilitation',
  NewSystemPartialDisability = 'NewSystemPartialDisability',
  Rehabilitation = 'Rehabilitation',
  Retirement = 'Retirement',
}

export type SocialInsurancePensionCalculationInput = {
  ageOfFirst75DisabilityAssessment?: InputMaybe<Scalars['Int']>
  benefitsFromMunicipality?: InputMaybe<Scalars['Int']>
  birthMonth?: InputMaybe<Scalars['Int']>
  birthYear?: InputMaybe<Scalars['Int']>
  capitalIncome?: InputMaybe<Scalars['Int']>
  childCount?: InputMaybe<Scalars['Int']>
  childSupportCount?: InputMaybe<Scalars['Int']>
  dateOfCalculations?: InputMaybe<Scalars['String']>
  foreignBasicPension?: InputMaybe<Scalars['Int']>
  hasSpouse?: InputMaybe<Scalars['Boolean']>
  income?: InputMaybe<Scalars['Int']>
  installmentClaims?: InputMaybe<Scalars['Int']>
  livingCondition?: InputMaybe<SocialInsurancePensionCalculationLivingCondition>
  livingConditionAbroadInYears?: InputMaybe<Scalars['Int']>
  livingConditionRatio?: InputMaybe<Scalars['Int']>
  otherIncome?: InputMaybe<Scalars['Int']>
  pensionPayments?: InputMaybe<Scalars['Int']>
  premium?: InputMaybe<Scalars['Int']>
  privatePensionPayments?: InputMaybe<Scalars['Int']>
  startMonth?: InputMaybe<Scalars['Int']>
  startYear?: InputMaybe<Scalars['Int']>
  taxCard?: InputMaybe<Scalars['Int']>
  typeOfBasePension?: InputMaybe<SocialInsurancePensionCalculationBasePensionType>
  typeOfPeriodIncome?: InputMaybe<SocialInsurancePensionCalculationPeriodIncomeType>
}

export enum SocialInsurancePensionCalculationLivingCondition {
  DoesNotLiveAlone = 'DoesNotLiveAlone',
  LivesAlone = 'LivesAlone',
}

export enum SocialInsurancePensionCalculationPeriodIncomeType {
  Month = 'Month',
  Year = 'Year',
}

export type SocialInsurancePensionCalculationResponse = {
  __typename?: 'SocialInsurancePensionCalculationResponse'
  groups?: Maybe<Array<SocialInsurancePensionCalculationResponseItemGroup>>
  highlightedItems?: Maybe<Array<SocialInsurancePensionCalculationResponseItem>>
}

export type SocialInsurancePensionCalculationResponseItem = {
  __typename?: 'SocialInsurancePensionCalculationResponseItem'
  monthlyAmount?: Maybe<Scalars['Float']>
  name?: Maybe<Scalars['String']>
  yearlyAmount?: Maybe<Scalars['Float']>
}

export type SocialInsurancePensionCalculationResponseItemGroup = {
  __typename?: 'SocialInsurancePensionCalculationResponseItemGroup'
  items: Array<SocialInsurancePensionCalculationResponseItem>
  name?: Maybe<Scalars['String']>
}

export type SocialInsuranceTemporaryCalculation = {
  __typename?: 'SocialInsuranceTemporaryCalculation'
  groups?: Maybe<Array<SocialInsuranceTemporaryCalculationGroup>>
  paidOut?: Maybe<Scalars['Int']>
  subtracted?: Maybe<Scalars['Int']>
  totalPayment?: Maybe<Scalars['Int']>
}

export type SocialInsuranceTemporaryCalculationGroup = {
  __typename?: 'SocialInsuranceTemporaryCalculationGroup'
  group?: Maybe<Scalars['String']>
  groupId?: Maybe<Scalars['Int']>
  monthTotals?: Maybe<Array<SocialInsuranceTemporaryCalculationMonth>>
  rows?: Maybe<Array<SocialInsuranceTemporaryCalculationRow>>
  total?: Maybe<Scalars['Int']>
}

export type SocialInsuranceTemporaryCalculationInput = {
  incomeTypes?: InputMaybe<Array<SocialInsuranceIncomeType>>
  incomeYear: Scalars['Int']
}

export type SocialInsuranceTemporaryCalculationMonth = {
  __typename?: 'SocialInsuranceTemporaryCalculationMonth'
  amount?: Maybe<Scalars['Int']>
  month: Scalars['Int']
}

export type SocialInsuranceTemporaryCalculationRow = {
  __typename?: 'SocialInsuranceTemporaryCalculationRow'
  months?: Maybe<Array<SocialInsuranceTemporaryCalculationMonth>>
  name?: Maybe<Scalars['String']>
  total?: Maybe<Scalars['Int']>
}

export enum SortDirection {
  Asc = 'ASC',
  Desc = 'DESC',
}

export enum SortField {
  Popular = 'POPULAR',
  ReleaseDate = 'RELEASE_DATE',
  Title = 'TITLE',
}

export type Statistic = {
  __typename?: 'Statistic'
  id: Scalars['ID']
  label: Scalars['String']
  value: Scalars['String']
}

export type StatisticKeyValue = {
  __typename?: 'StatisticKeyValue'
  key: Scalars['String']
  value?: Maybe<Scalars['Float']>
}

export type Statistics = {
  __typename?: 'Statistics'
  id: Scalars['ID']
  statistics: Array<Statistic>
  title: Scalars['String']
}

export type StatisticsCard = {
  __typename?: 'StatisticsCard'
  image?: Maybe<Image>
  statistic: Scalars['String']
  title: Scalars['String']
}

export type StatisticsForHeader = {
  __typename?: 'StatisticsForHeader'
  header: Scalars['String']
  headerType: Scalars['String']
  statisticsForHeader: Array<StatisticKeyValue>
}

export type StatisticsInput = {
  /** Date format: YYYY-MM-DD */
  fromDate?: InputMaybe<Scalars['String']>
  organisationId?: InputMaybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  toDate?: InputMaybe<Scalars['String']>
}

export type StatisticsQueryInput = {
  dateFrom?: InputMaybe<Scalars['DateTime']>
  dateTo?: InputMaybe<Scalars['DateTime']>
  interval?: InputMaybe<Scalars['Float']>
  numberOfDataPoints?: InputMaybe<Scalars['Float']>
  sourceDataKeys: Array<Scalars['String']>
}

export type StatisticsQueryResponse = {
  __typename?: 'StatisticsQueryResponse'
  statistics: Array<StatisticsForHeader>
}

export type Step = {
  __typename?: 'Step'
  config?: Maybe<Scalars['String']>
  id: Scalars['ID']
  slug: Scalars['String']
  stepType?: Maybe<Scalars['String']>
  subtitle?: Maybe<Array<Slice>>
  title: Scalars['String']
}

export type Stepper = {
  __typename?: 'Stepper'
  config?: Maybe<Scalars['String']>
  id: Scalars['ID']
  steps?: Maybe<Array<Step>>
  title: Scalars['String']
}

export type Story = {
  __typename?: 'Story'
  body?: Maybe<Scalars['String']>
  date: Scalars['String']
  intro: Scalars['String']
  label: Scalars['String']
  link: Scalars['String']
  linkedPage?: Maybe<Scalars['String']>
  logo: Image
  readMoreText: Scalars['String']
  title: Scalars['String']
}

export type StorySlice = {
  __typename?: 'StorySlice'
  id: Scalars['ID']
  readMoreText: Scalars['String']
  stories: Array<Story>
}

export type StudentAssessment = {
  __typename?: 'StudentAssessment'
  studentNationalId?: Maybe<Scalars['String']>
  teacherName?: Maybe<Scalars['String']>
  teacherNationalId?: Maybe<Scalars['String']>
}

export type StudentCanGetPracticePermit = {
  __typename?: 'StudentCanGetPracticePermit'
  errorCode?: Maybe<Scalars['String']>
  instructor?: Maybe<Scalars['String']>
  isOk?: Maybe<Scalars['Boolean']>
  student?: Maybe<Scalars['String']>
}

export type StudentCanGetPracticePermitInput = {
  studentSSN: Scalars['String']
}

export type StudentInformation = {
  __typename?: 'StudentInformation'
  name: Scalars['String']
}

export type StudentInformationResult = {
  __typename?: 'StudentInformationResult'
  student?: Maybe<StudentInformation>
}

export type SubArticle = {
  __typename?: 'SubArticle'
  body: Array<Slice>
  id: Scalars['ID']
  parent?: Maybe<ArticleReference>
  showTableOfContents?: Maybe<Scalars['Boolean']>
  signLanguageVideo?: Maybe<EmbeddedVideo>
  slug: Scalars['String']
  stepper?: Maybe<Stepper>
  title: Scalars['String']
}

export type SubmitApplicationInput = {
  answers?: InputMaybe<Scalars['JSON']>
  event: Scalars['String']
  id: Scalars['String']
}

export type SubmitFormSystemScreenInput = {
  screenId?: InputMaybe<Scalars['String']>
}

export type SubpageHeader = {
  __typename?: 'SubpageHeader'
  body?: Maybe<Array<Slice>>
  featuredImage?: Maybe<Image>
  subpageId: Scalars['String']
  summary: Scalars['String']
  title: Scalars['String']
}

export enum SubscriptionType {
  AllChanges = 'AllChanges',
  OnlyNew = 'OnlyNew',
  StatusChanges = 'StatusChanges',
}

export type SupportCategory = {
  __typename?: 'SupportCategory'
  description?: Maybe<Scalars['String']>
  id: Scalars['ID']
  importance: Scalars['Float']
  organization?: Maybe<Organization>
  slug?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type SupportQna = {
  __typename?: 'SupportQNA'
  answer: Array<Slice>
  category?: Maybe<SupportCategory>
  contactLink: Scalars['String']
  id: Scalars['ID']
  importance: Scalars['Float']
  organization?: Maybe<Organization>
  relatedLinks: Array<Link>
  slug: Scalars['String']
  subCategory?: Maybe<SupportSubCategory>
  title: Scalars['String']
}

export type SupportSubCategory = {
  __typename?: 'SupportSubCategory'
  description?: Maybe<Scalars['String']>
  importance: Scalars['Float']
  slug?: Maybe<Scalars['String']>
  title: Scalars['String']
}

export type SyslumennAuction = {
  __typename?: 'SyslumennAuction'
  auctionDate?: Maybe<Scalars['String']>
  auctionTakesPlaceAt?: Maybe<Scalars['String']>
  auctionTime?: Maybe<Scalars['String']>
  auctionType?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  lotId?: Maybe<Scalars['String']>
  lotItems?: Maybe<Scalars['String']>
  lotName?: Maybe<Scalars['String']>
  lotType?: Maybe<Scalars['String']>
  office?: Maybe<Scalars['String']>
  petitioners?: Maybe<Scalars['String']>
  publishText?: Maybe<Scalars['String']>
  respondent?: Maybe<Scalars['String']>
}

export type TabContent = {
  __typename?: 'TabContent'
  body?: Maybe<Array<Slice>>
  contentTitle?: Maybe<Scalars['String']>
  image?: Maybe<Image>
  tabTitle: Scalars['String']
}

export type TabSection = {
  __typename?: 'TabSection'
  id: Scalars['ID']
  tabs: Array<TabContent>
  title: Scalars['String']
}

export type TableSlice = {
  __typename?: 'TableSlice'
  id: Scalars['ID']
  tableContent?: Maybe<Scalars['JSON']>
  title: Scalars['String']
}

export type Tag = {
  key: Scalars['String']
  type: SearchableTags
}

export type TagCount = {
  __typename?: 'TagCount'
  count: Scalars['Int']
  key: Scalars['String']
  type?: Maybe<Scalars['String']>
  value: Scalars['String']
}

export type TeacherV4 = {
  __typename?: 'TeacherV4'
  driverLicenseId?: Maybe<Scalars['Float']>
  name: Scalars['String']
  nationalId: Scalars['ID']
}

export type TeamList = {
  __typename?: 'TeamList'
  filterTags?: Maybe<Array<GenericTag>>
  id: Scalars['ID']
  showSearchInput?: Maybe<Scalars['Boolean']>
  teamMemberOrder?: Maybe<GetTeamMembersInputOrderBy>
  teamMembers: Array<TeamMember>
  variant?: Maybe<Scalars['String']>
}

export type TeamMember = {
  __typename?: 'TeamMember'
  createdAt?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  filterTags?: Maybe<Array<GenericTag>>
  id: Scalars['ID']
  image?: Maybe<Image>
  imageOnSelect?: Maybe<Image>
  intro?: Maybe<Array<Slice>>
  name: Scalars['String']
  phone?: Maybe<Scalars['String']>
  tagGroups?: Maybe<Array<TeamMemberTagGroup>>
  title: Scalars['String']
}

export type TeamMemberResponse = {
  __typename?: 'TeamMemberResponse'
  input: TeamMemberResponseInput
  items: Array<TeamMember>
  total: Scalars['Int']
}

export type TeamMemberResponseInput = {
  __typename?: 'TeamMemberResponseInput'
  lang: Scalars['String']
  orderBy?: Maybe<GetTeamMembersInputOrderBy>
  page?: Maybe<Scalars['Int']>
  queryString?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
  tagGroups?: Maybe<Scalars['JSON']>
  tags?: Maybe<Array<Scalars['String']>>
  teamListId: Scalars['String']
}

export type TeamMemberTagGroup = {
  __typename?: 'TeamMemberTagGroup'
  groupId: Scalars['String']
  groupLabel: Scalars['String']
  tagLabels: Array<Scalars['String']>
}

export type TellUsAStory = {
  __typename?: 'TellUsAStory'
  SuccessMessageTitle: Scalars['String']
  dateOfStoryInputErrorMessage: Scalars['String']
  dateOfStoryLabel: Scalars['String']
  dateOfStoryPlaceholder: Scalars['String']
  emailInputErrorMessage: Scalars['String']
  emailLabel: Scalars['String']
  emailPlaceholder: Scalars['String']
  errorMessage?: Maybe<Html>
  errorMessageTitle: Scalars['String']
  firstSectionTitle: Scalars['String']
  id: Scalars['ID']
  instructionsDescription?: Maybe<Html>
  instructionsImage: Image
  instructionsTitle: Scalars['String']
  introDescription?: Maybe<Html>
  introImage?: Maybe<Image>
  introTitle: Scalars['String']
  messageInputErrorMessage: Scalars['String']
  messageLabel: Scalars['String']
  messagePlaceholder: Scalars['String']
  nameInputErrorMessage: Scalars['String']
  nameLabel: Scalars['String']
  namePlaceholder: Scalars['String']
  organizationInputErrorMessage: Scalars['String']
  organizationLabel: Scalars['String']
  organizationPlaceholder: Scalars['String']
  publicationAllowedLabel: Scalars['String']
  secondSectionTitle: Scalars['String']
  subjectInputErrorMessage?: Maybe<Scalars['String']>
  subjectLabel: Scalars['String']
  subjectPlaceholder: Scalars['String']
  submitButtonTitle: Scalars['String']
  successMessage?: Maybe<Html>
  thirdSectionTitle: Scalars['String']
}

export type TellUsAStoryInput = {
  dateOfStory: Scalars['String']
  email: Scalars['String']
  message: Scalars['String']
  name: Scalars['String']
  organization: Scalars['String']
  publicationAllowed?: InputMaybe<Scalars['Boolean']>
  subject?: InputMaybe<Scalars['String']>
}

export type TemporaryEventLicence = {
  __typename?: 'TemporaryEventLicence'
  estimatedNumberOfGuests?: Maybe<Scalars['Float']>
  issuedBy?: Maybe<Scalars['String']>
  licenceSubType?: Maybe<Scalars['String']>
  licenceType?: Maybe<Scalars['String']>
  licenseHolder?: Maybe<Scalars['String']>
  licenseNumber?: Maybe<Scalars['String']>
  licenseResponsible?: Maybe<Scalars['String']>
  location?: Maybe<Scalars['String']>
  maximumNumberOfGuests?: Maybe<Scalars['Float']>
  validFrom?: Maybe<Scalars['DateTime']>
  validTo?: Maybe<Scalars['DateTime']>
  year?: Maybe<Scalars['Float']>
}

export type TestResult = {
  __typename?: 'TestResult'
  id: Scalars['String']
  isValid: Scalars['Boolean']
  message?: Maybe<Scalars['String']>
}

export type TextFieldLocales = {
  __typename?: 'TextFieldLocales'
  en: Scalars['String']
  is: Scalars['String']
}

export type TimelineEvent = {
  __typename?: 'TimelineEvent'
  body?: Maybe<Html>
  date: Scalars['String']
  denominator?: Maybe<Scalars['Int']>
  id: Scalars['ID']
  label: Scalars['String']
  link: Scalars['String']
  numerator?: Maybe<Scalars['Int']>
  tags?: Maybe<Array<Scalars['String']>>
  title: Scalars['String']
}

export type TimelineSlice = {
  __typename?: 'TimelineSlice'
  events: Array<TimelineEvent>
  hasBorderAbove?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  intro: Scalars['String']
  title: Scalars['String']
}

export enum TrademarkSubType {
  CertificationMark = 'CERTIFICATION_MARK',
  CollectiveMark = 'COLLECTIVE_MARK',
  Trademark = 'TRADEMARK',
}

export enum TrademarkType {
  Animation = 'ANIMATION',
  Audio = 'AUDIO',
  Image = 'IMAGE',
  Multimedia = 'MULTIMEDIA',
  Text = 'TEXT',
  TextAndImage = 'TEXT_AND_IMAGE',
  Unknown = 'UNKNOWN',
}

export enum TransactionType {
  A = 'A',
  Af = 'AF',
  As = 'AS',
  E = 'E',
  G = 'G',
  I = 'I',
  Kg = 'KG',
  Ks = 'KS',
  L = 'L',
  Lm = 'LM',
  M = 'M',
}

export type TwoColumnText = {
  __typename?: 'TwoColumnText'
  dividerOnTop?: Maybe<Scalars['Boolean']>
  id: Scalars['ID']
  leftContent?: Maybe<Array<Slice>>
  leftLink?: Maybe<Link>
  leftTitle?: Maybe<Scalars['String']>
  onlyUseOneTitle?: Maybe<Scalars['Boolean']>
  rightContent?: Maybe<Array<Slice>>
  rightLink?: Maybe<Link>
  rightTitle?: Maybe<Scalars['String']>
}

export enum TypeCategory {
  Graphql = 'GRAPHQL',
  Rest = 'REST',
  Soap = 'SOAP',
}

export type TypeCount = {
  __typename?: 'TypeCount'
  count: Scalars['Int']
  key: Scalars['String']
}

export type Tyres = {
  __typename?: 'Tyres'
  axle1?: Maybe<Scalars['String']>
  axle2?: Maybe<Scalars['String']>
  axle3?: Maybe<Scalars['String']>
  axle4?: Maybe<Scalars['String']>
  axle5?: Maybe<Scalars['String']>
}

export type Union = {
  __typename?: 'Union'
  id: Scalars['String']
  name: Scalars['String']
}

export type Unit = {
  __typename?: 'Unit'
  address?: Maybe<Scalars['String']>
  addressCode?: Maybe<Scalars['Float']>
  appraisalUnitCode?: Maybe<Scalars['Float']>
  fireInsuranceValuation?: Maybe<Scalars['Float']>
  propertyCode?: Maybe<Scalars['Float']>
  propertyUsageDescription?: Maybe<Scalars['String']>
  propertyValue?: Maybe<Scalars['Float']>
  size?: Maybe<Scalars['Float']>
  sizeUnit?: Maybe<Scalars['String']>
  unitCode?: Maybe<Scalars['String']>
}

export type UnitOfUse = {
  __typename?: 'UnitOfUse'
  address?: Maybe<PropertyLocation>
  appraisal?: Maybe<Appraisal>
  buildYearDisplay?: Maybe<Scalars['String']>
  displaySize?: Maybe<Scalars['Float']>
  explanation?: Maybe<Scalars['String']>
  fireAssessment?: Maybe<Scalars['Float']>
  marking?: Maybe<Scalars['String']>
  propertyNumber?: Maybe<Scalars['String']>
  unitOfUseNumber?: Maybe<Scalars['String']>
  usageDisplay?: Maybe<Scalars['String']>
}

export type UnitsOfUseModel = {
  __typename?: 'UnitsOfUseModel'
  paging?: Maybe<PagingData>
  unitsOfUse?: Maybe<Array<UnitOfUse>>
}

export type UniversityCareersInstitution = {
  __typename?: 'UniversityCareersInstitution'
  displayName?: Maybe<Scalars['String']>
  id: UniversityCareersUniversityId
  logoUrl?: Maybe<Scalars['String']>
  shortId: Scalars['String']
}

export type UniversityCareersStudentFile = {
  __typename?: 'UniversityCareersStudentFile'
  displayName: Scalars['String']
  fileName: Scalars['String']
  locale: Scalars['String']
  type: Scalars['String']
}

export type UniversityCareersStudentInfoByUniversityInput = {
  locale: Scalars['String']
  trackNumber: Scalars['Float']
  universityId: UniversityCareersUniversityId
}

export type UniversityCareersStudentInfoInput = {
  locale: Scalars['String']
}

export type UniversityCareersStudentTrack = {
  __typename?: 'UniversityCareersStudentTrack'
  downloadServiceURL?: Maybe<Scalars['String']>
  /** Extra info about any available files for download */
  files: Array<UniversityCareersStudentFile>
  metadata: UniversityCareersStudentTrackMetadata
  transcript: UniversityCareersStudentTrackTranscript
}

export type UniversityCareersStudentTrackHistory = {
  __typename?: 'UniversityCareersStudentTrackHistory'
  errors?: Maybe<Array<UniversityCareersStudentTrackTranscriptError>>
  transcripts: Array<UniversityCareersStudentTrackTranscript>
}

export type UniversityCareersStudentTrackMetadata = {
  __typename?: 'UniversityCareersStudentTrackMetadata'
  description: Scalars['String']
  footer: Scalars['String']
  unconfirmedData?: Maybe<Scalars['String']>
}

export type UniversityCareersStudentTrackTranscript = {
  __typename?: 'UniversityCareersStudentTrackTranscript'
  degree?: Maybe<Scalars['String']>
  faculty: Scalars['String']
  graduationDate: Scalars['String']
  institution: UniversityCareersInstitution
  name: Scalars['String']
  nationalId?: Maybe<Scalars['String']>
  school: Scalars['String']
  studyProgram?: Maybe<Scalars['String']>
  trackNumber: Scalars['Int']
}

export type UniversityCareersStudentTrackTranscriptError = {
  __typename?: 'UniversityCareersStudentTrackTranscriptError'
  /** The error, raw */
  error?: Maybe<Scalars['String']>
  institution: UniversityCareersInstitution
}

export enum UniversityCareersUniversityId {
  AgriculturalUniversityOfIceland = 'AGRICULTURAL_UNIVERSITY_OF_ICELAND',
  BifrostUniversity = 'BIFROST_UNIVERSITY',
  HolarUniversity = 'HOLAR_UNIVERSITY',
  IcelandUniversityOfTheArts = 'ICELAND_UNIVERSITY_OF_THE_ARTS',
  UniversityOfAkureyri = 'UNIVERSITY_OF_AKUREYRI',
  UniversityOfIceland = 'UNIVERSITY_OF_ICELAND',
}

export type UniversityGatewayApplication = {
  __typename?: 'UniversityGatewayApplication'
  id: Scalars['String']
  nationalId: Scalars['String']
}

export type UniversityGatewayGetPogramInput = {
  id: Scalars['String']
}

export type UniversityGatewayProgram = {
  __typename?: 'UniversityGatewayProgram'
  active: Scalars['Boolean']
  applicationEndDate: Scalars['DateTime']
  applicationInUniversityGateway: Scalars['Boolean']
  applicationPeriodOpen: Scalars['Boolean']
  applicationStartDate: Scalars['DateTime']
  costPerYear?: Maybe<Scalars['Float']>
  credits: Scalars['Float']
  degreeAbbreviation: Scalars['String']
  degreeType: Scalars['String']
  departmentNameEn: Scalars['String']
  departmentNameIs: Scalars['String']
  descriptionEn: Scalars['String']
  descriptionIs: Scalars['String']
  durationInYears: Scalars['Float']
  externalId: Scalars['String']
  id: Scalars['String']
  iscedCode: Scalars['String']
  modeOfDelivery: Array<Scalars['String']>
  nameEn: Scalars['String']
  nameIs: Scalars['String']
  schoolAnswerDate?: Maybe<Scalars['DateTime']>
  specializationExternalId?: Maybe<Scalars['String']>
  specializationNameEn?: Maybe<Scalars['String']>
  specializationNameIs?: Maybe<Scalars['String']>
  startingSemesterSeason: Scalars['String']
  startingSemesterYear: Scalars['Float']
  studentAnswerDate?: Maybe<Scalars['DateTime']>
  universityContentfulKey: Scalars['String']
  universityId: Scalars['String']
}

export type UniversityGatewayProgramDetails = {
  __typename?: 'UniversityGatewayProgramDetails'
  active: Scalars['Boolean']
  admissionRequirementsEn?: Maybe<Scalars['String']>
  admissionRequirementsIs?: Maybe<Scalars['String']>
  allowException: Scalars['Boolean']
  allowThirdLevelQualification: Scalars['Boolean']
  applicationEndDate: Scalars['DateTime']
  applicationInUniversityGateway: Scalars['Boolean']
  applicationPeriodOpen: Scalars['Boolean']
  applicationStartDate: Scalars['DateTime']
  arrangementEn?: Maybe<Scalars['String']>
  arrangementIs?: Maybe<Scalars['String']>
  costInformationEn?: Maybe<Scalars['String']>
  costInformationIs?: Maybe<Scalars['String']>
  costPerYear?: Maybe<Scalars['Float']>
  credits: Scalars['Float']
  degreeAbbreviation: Scalars['String']
  degreeType: Scalars['String']
  departmentNameEn: Scalars['String']
  departmentNameIs: Scalars['String']
  descriptionEn: Scalars['String']
  descriptionHtmlEn?: Maybe<Scalars['JSON']>
  descriptionHtmlIs?: Maybe<Scalars['JSON']>
  descriptionIs: Scalars['String']
  durationInYears: Scalars['Float']
  externalId: Scalars['String']
  externalUrlEn?: Maybe<Scalars['String']>
  externalUrlIs?: Maybe<Scalars['String']>
  extraApplicationFields: Array<UniversityGatewayProgramExtraApplicationField>
  id: Scalars['String']
  iscedCode: Scalars['String']
  modeOfDelivery: Array<Scalars['String']>
  nameEn: Scalars['String']
  nameIs: Scalars['String']
  schoolAnswerDate?: Maybe<Scalars['DateTime']>
  specializationExternalId?: Maybe<Scalars['String']>
  specializationNameEn?: Maybe<Scalars['String']>
  specializationNameIs?: Maybe<Scalars['String']>
  startingSemesterSeason: Scalars['String']
  startingSemesterYear: Scalars['Float']
  studentAnswerDate?: Maybe<Scalars['DateTime']>
  studyRequirementsEn?: Maybe<Scalars['String']>
  studyRequirementsIs?: Maybe<Scalars['String']>
  universityContentfulKey: Scalars['String']
  universityId: Scalars['String']
}

export type UniversityGatewayProgramExtraApplicationField = {
  __typename?: 'UniversityGatewayProgramExtraApplicationField'
  descriptionEn?: Maybe<Scalars['String']>
  descriptionIs?: Maybe<Scalars['String']>
  externalKey: Scalars['String']
  fieldType: Scalars['String']
  nameEn: Scalars['String']
  nameIs: Scalars['String']
  options?: Maybe<Scalars['String']>
  required: Scalars['Boolean']
  uploadAcceptedFileType?: Maybe<Scalars['String']>
}

export type UniversityGatewayProgramFilter = {
  __typename?: 'UniversityGatewayProgramFilter'
  field: Scalars['String']
  options: Array<Scalars['String']>
}

export type UniversityGatewayProgramsPaginated = {
  __typename?: 'UniversityGatewayProgramsPaginated'
  data: Array<UniversityGatewayProgram>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type UniversityGatewayUniversity = {
  __typename?: 'UniversityGatewayUniversity'
  contentfulKey: Scalars['String']
  contentfulLink?: Maybe<Scalars['String']>
  contentfulLinkEn?: Maybe<Scalars['String']>
  contentfulLogoUrl?: Maybe<Scalars['String']>
  contentfulTitle?: Maybe<Scalars['String']>
  contentfulTitleEn?: Maybe<Scalars['String']>
  id: Scalars['String']
  nationalId: Scalars['String']
}

export type UpdateApplicationExternalDataInput = {
  dataProviders: Array<DataProvider>
  id: Scalars['String']
}

export type UpdateApplicationInput = {
  answers?: InputMaybe<Scalars['JSON']>
  draftProgress?: InputMaybe<DraftProgressInput>
  id: Scalars['String']
  skipValidation?: InputMaybe<Scalars['Boolean']>
}

export type UpdateAuthDelegationInput = {
  delegationId: Scalars['String']
  scopes: Array<AuthDelegationScopeInput>
}

export type UpdateChangeAppendixInput = {
  diff?: InputMaybe<Scalars['String']>
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type UpdateContactInput = {
  address?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  phoneNumber?: InputMaybe<Scalars['String']>
}

export type UpdateCurrentEmployerInput = {
  employerNationalId: Scalars['String']
}

export type UpdateCurrentEmployerResponse = {
  __typename?: 'UpdateCurrentEmployerResponse'
  success: Scalars['Boolean']
}

export type UpdateDraftRegulationCancelInput = {
  date?: InputMaybe<Scalars['String']>
  id: Scalars['String']
}

export type UpdateDraftRegulationChangeInput = {
  appendixes?: InputMaybe<Array<UpdateChangeAppendixInput>>
  comments?: InputMaybe<Scalars['String']>
  date?: InputMaybe<Scalars['String']>
  diff?: InputMaybe<Scalars['String']>
  id: Scalars['String']
  text?: InputMaybe<Scalars['String']>
  title?: InputMaybe<Scalars['String']>
}

export type UpdateEndorsementListDto = {
  closedDate: Scalars['DateTime']
  description?: InputMaybe<Scalars['String']>
  openedDate: Scalars['DateTime']
  title: Scalars['String']
}

export type UpdateEndorsementListInput = {
  endorsementList: UpdateEndorsementListDto
  listId: Scalars['String']
}

export type UpdateEndpointInput = {
  endpoint: Scalars['String']
  nationalId: Scalars['String']
  providerId: Scalars['String']
  xroad?: InputMaybe<Scalars['Boolean']>
}

export type UpdateFormSystemApplicantDtoInput = {
  name?: InputMaybe<FormSystemLanguageTypeInput>
}

export type UpdateFormSystemApplicantInput = {
  id?: InputMaybe<Scalars['String']>
  updateFormApplicantTypeDto?: InputMaybe<UpdateFormSystemApplicantDtoInput>
}

export type UpdateFormSystemApplicationDependenciesInput = {
  completed?: InputMaybe<Array<InputMaybe<Scalars['String']>>>
  dependencies?: InputMaybe<Array<InputMaybe<FormSystemDependencyInput>>>
}

export type UpdateHelpdeskInput = {
  email?: InputMaybe<Scalars['String']>
  phoneNumber?: InputMaybe<Scalars['String']>
}

export type UpdateIcelandicNameInput = {
  body: CreateIcelandicNameInput
  id: Scalars['Float']
}

export type UpdateOrganisationInput = {
  address?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  name?: InputMaybe<Scalars['String']>
  nationalId?: InputMaybe<Scalars['String']>
  phoneNumber?: InputMaybe<Scalars['String']>
}

export type UpdatePracticalDrivingLessonInput = {
  bookId: Scalars['String']
  comments: Scalars['String']
  createdOn: Scalars['String']
  id: Scalars['String']
  minutes: Scalars['Float']
}

export type UpdateUserProfileInput = {
  bankInfo?: InputMaybe<Scalars['String']>
  canNudge?: InputMaybe<Scalars['Boolean']>
  documentNotifications?: InputMaybe<Scalars['Boolean']>
  email?: InputMaybe<Scalars['String']>
  emailCode?: InputMaybe<Scalars['String']>
  emailStatus?: InputMaybe<Scalars['String']>
  locale?: InputMaybe<Scalars['String']>
  mobilePhoneNumber?: InputMaybe<Scalars['String']>
  mobileStatus?: InputMaybe<Scalars['String']>
  smsCode?: InputMaybe<Scalars['String']>
}

export type Url = {
  __typename?: 'Url'
  explicitRedirect?: Maybe<Scalars['String']>
  id: Scalars['ID']
  page?: Maybe<ReferenceLink>
  title?: Maybe<Scalars['String']>
  urlsList: Array<Scalars['String']>
}

export type UserDeviceToken = {
  __typename?: 'UserDeviceToken'
  created: Scalars['DateTime']
  deviceToken: Scalars['String']
  id: Scalars['ID']
  modified: Scalars['DateTime']
  nationalId: Scalars['String']
}

export type UserDeviceTokenInput = {
  deviceToken: Scalars['String']
}

export type UserProfile = {
  __typename?: 'UserProfile'
  bankInfo?: Maybe<Scalars['String']>
  /** @deprecated Deprecated due to new field EmailNotification from UserProfile V2 */
  canNudge?: Maybe<Scalars['Boolean']>
  documentNotifications: Scalars['Boolean']
  email?: Maybe<Scalars['String']>
  emailNotifications?: Maybe<Scalars['Boolean']>
  emailStatus?: Maybe<Scalars['String']>
  emailVerified: Scalars['Boolean']
  locale?: Maybe<Scalars['String']>
  mobilePhoneNumber?: Maybe<Scalars['String']>
  mobilePhoneNumberVerified: Scalars['Boolean']
  mobileStatus?: Maybe<Scalars['String']>
  /** @deprecated needsNudge should be used to determine if profile needs nudge. v2 doesnt provide the modified value. */
  modified?: Maybe<Scalars['DateTime']>
  nationalId: Scalars['ID']
  needsNudge?: Maybe<Scalars['Boolean']>
}

export type UserProfileActorProfile = {
  __typename?: 'UserProfileActorProfile'
  emailNotifications: Scalars['Boolean']
  fromName?: Maybe<Scalars['String']>
  fromNationalId: Scalars['String']
}

export type UserProfileActorProfileResponse = {
  __typename?: 'UserProfileActorProfileResponse'
  data: Array<UserProfileActorProfile>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type UserProfileAdminProfile = {
  __typename?: 'UserProfileAdminProfile'
  bankInfo?: Maybe<Scalars['String']>
  /** @deprecated Deprecated due to new field EmailNotification from UserProfile V2 */
  canNudge?: Maybe<Scalars['Boolean']>
  documentNotifications: Scalars['Boolean']
  email?: Maybe<Scalars['String']>
  emailNotifications?: Maybe<Scalars['Boolean']>
  emailStatus?: Maybe<Scalars['String']>
  emailVerified: Scalars['Boolean']
  fullName?: Maybe<Scalars['String']>
  lastNudge?: Maybe<Scalars['DateTime']>
  locale?: Maybe<Scalars['String']>
  mobilePhoneNumber?: Maybe<Scalars['String']>
  mobilePhoneNumberVerified: Scalars['Boolean']
  mobileStatus?: Maybe<Scalars['String']>
  /** @deprecated needsNudge should be used to determine if profile needs nudge. v2 doesnt provide the modified value. */
  modified?: Maybe<Scalars['DateTime']>
  nationalId: Scalars['ID']
  needsNudge?: Maybe<Scalars['Boolean']>
  nextNudge?: Maybe<Scalars['DateTime']>
}

export type UserProfileAdminProfilesResponse = {
  __typename?: 'UserProfileAdminProfilesResponse'
  data: Array<UserProfileAdminProfile>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type UserProfileData = {
  email: Scalars['String']
  mobilePhoneNumber: Scalars['String']
}

export type UserProfileLocale = {
  __typename?: 'UserProfileLocale'
  locale?: Maybe<Scalars['String']>
  nationalId: Scalars['ID']
}

export type UserProfileUpdateActorProfileInput = {
  emailNotifications: Scalars['Boolean']
  fromNationalId: Scalars['String']
}

export enum VacanciesGetLanguageEnum {
  En = 'EN',
  Is = 'IS',
  Onlyen = 'ONLYEN',
  Onlyis = 'ONLYIS',
}

export enum VacanciesVacancyIdGetLanguageEnum {
  En = 'EN',
  Is = 'IS',
  Onlyen = 'ONLYEN',
  Onlyis = 'ONLYIS',
}

export type ValidateInstructorInput = {
  nationalId: Scalars['String']
  xCorrelationID: Scalars['String']
}

export type ValidateMortgageCertificateInput = {
  properties: Array<Properties>
}

export type ValidateSeminarIndividualsInput = {
  individuals: Array<SeminarIndividual>
}

export type VehicleCurrentWithMileage = {
  __typename?: 'VehicleCurrentWithMileage'
  color?: Maybe<VehiclesColor>
  make?: Maybe<Scalars['String']>
  mileageDetails?: Maybe<VehiclesMileageDetails>
  /** ISO8601 */
  nextInspection?: Maybe<Scalars['String']>
  registration?: Maybe<VehiclesRegistration>
  userRole?: Maybe<Scalars['String']>
  vehicleId: Scalars['String']
}

export type VehicleDetail = {
  __typename?: 'VehicleDetail'
  color?: Maybe<Scalars['String']>
  dateOfRegistration?: Maybe<Scalars['DateTime']>
  licencePlate?: Maybe<Scalars['String']>
  manufacturer?: Maybe<Scalars['String']>
  manufacturerType?: Maybe<Scalars['String']>
  propertyNumber?: Maybe<Scalars['String']>
}

export type VehicleListed = {
  __typename?: 'VehicleListed'
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  colorCode?: Maybe<Scalars['String']>
  colorName?: Maybe<Scalars['String']>
  lastMileageRegistration?: Maybe<VehicleMileageDetail>
  latestMileage?: Maybe<Scalars['Float']>
  make?: Maybe<Scalars['String']>
  mileageRegistrationHistory?: Maybe<Array<VehicleMileageDetail>>
  modelYear?: Maybe<Scalars['String']>
  nextMainInspection?: Maybe<Scalars['DateTime']>
  permno?: Maybe<Scalars['String']>
  persidno?: Maybe<Scalars['String']>
  regTypeCode?: Maybe<Scalars['String']>
  regTypeName?: Maybe<Scalars['String']>
  regTypeSubName?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['String']>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
  role?: Maybe<Scalars['String']>
}

export type VehicleMileageDetail = {
  __typename?: 'VehicleMileageDetail'
  internalId?: Maybe<Scalars['ID']>
  /**
   * Deprecated. Use {mileageNumber} instead. Keeping in for backwards compatibility
   * @deprecated Third party service wants this as an integer.
   */
  mileage?: Maybe<Scalars['String']>
  mileageNumber?: Maybe<Scalars['Float']>
  originCode?: Maybe<Scalars['String']>
  permno?: Maybe<Scalars['String']>
  readDate?: Maybe<Scalars['DateTime']>
}

export type VehicleMileageOverview = {
  __typename?: 'VehicleMileageOverview'
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  canUserRegisterVehicleMileage?: Maybe<Scalars['Boolean']>
  data?: Maybe<Array<VehicleMileageDetail>>
  /** Indicates that the user has already posted a reading today. So instead of posting a new reading, should be editing the reading from today */
  editing?: Maybe<Scalars['Boolean']>
  permno?: Maybe<Scalars['String']>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
}

export type VehicleMileagePostResponse =
  | VehicleMileageDetail
  | VehiclesMileageUpdateError

export type VehicleMileagePutModel = {
  __typename?: 'VehicleMileagePutModel'
  internalId?: Maybe<Scalars['ID']>
  mileage?: Maybe<Scalars['String']>
  mileageNumber?: Maybe<Scalars['Float']>
  permno?: Maybe<Scalars['String']>
}

export type VehicleMileagePutResponse =
  | VehicleMileagePutModel
  | VehiclesMileageUpdateError

export type VehicleOperatorChangeChecksByPermno = {
  __typename?: 'VehicleOperatorChangeChecksByPermno'
  basicVehicleInformation?: Maybe<BasicVehicleInformation>
  isDebtLess?: Maybe<Scalars['Boolean']>
  validationErrorMessages?: Maybe<Array<VehicleValidationErrorMessage>>
}

export type VehicleOwnerchangeChecksByPermno = {
  __typename?: 'VehicleOwnerchangeChecksByPermno'
  basicVehicleInformation?: Maybe<BasicVehicleInformation>
  isDebtLess?: Maybe<Scalars['Boolean']>
  validationErrorMessages?: Maybe<Array<VehicleValidationErrorMessage>>
}

export type VehiclePaging = {
  __typename?: 'VehiclePaging'
  pageNumber?: Maybe<Scalars['Float']>
  pageSize?: Maybe<Scalars['Float']>
  totalPages?: Maybe<Scalars['Float']>
  totalRecords?: Maybe<Scalars['Float']>
}

export type VehiclePlateOrderChecksByPermno = {
  __typename?: 'VehiclePlateOrderChecksByPermno'
  basicVehicleInformation?: Maybe<BasicVehicleInformation>
  validationErrorMessages?: Maybe<Array<VehicleValidationErrorMessage>>
}

export type VehicleRegistration = {
  __typename?: 'VehicleRegistration'
  color?: Maybe<Scalars['String']>
  licensePlate?: Maybe<Scalars['String']>
  manufacturer?: Maybe<Scalars['String']>
  modelName?: Maybe<Scalars['String']>
}

export enum VehicleUserTypeEnum {
  Eigandi = 'eigandi',
  Medeigandi = 'medeigandi',
  Umradamadur = 'umradamadur',
}

export type VehicleValidationErrorMessage = {
  __typename?: 'VehicleValidationErrorMessage'
  defaultMessage?: Maybe<Scalars['String']>
  errorNo?: Maybe<Scalars['String']>
}

export type VehiclesAxle = {
  __typename?: 'VehiclesAxle'
  axleMaxWeight?: Maybe<Scalars['Float']>
  wheelAxle?: Maybe<Scalars['String']>
}

export type VehiclesBasicInfo = {
  __typename?: 'VehiclesBasicInfo'
  country?: Maybe<Scalars['String']>
  formerCountry?: Maybe<Scalars['String']>
  importStatus?: Maybe<Scalars['String']>
  model?: Maybe<Scalars['String']>
  permno?: Maybe<Scalars['String']>
  preregDateYear?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['String']>
  subModel?: Maybe<Scalars['String']>
  vehicleStatus?: Maybe<Scalars['String']>
  verno?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Float']>
}

export type VehiclesBulkMileageReadingResponse = {
  __typename?: 'VehiclesBulkMileageReadingResponse'
  errorCode?: Maybe<Scalars['Int']>
  errorMessage?: Maybe<Scalars['String']>
  /** The GUID of the mileage registration post request. Used to fetch job status */
  requestId?: Maybe<Scalars['ID']>
}

export type VehiclesBulkMileageRegistrationJob = {
  __typename?: 'VehiclesBulkMileageRegistrationJob'
  /** When did the bulk request execution finish */
  dateFinished?: Maybe<Scalars['DateTime']>
  /** When was the bulk request requested? */
  dateRequested?: Maybe<Scalars['DateTime']>
  /** When did the bulk request start executing? */
  dateStarted?: Maybe<Scalars['DateTime']>
  guid: Scalars['ID']
  originCode?: Maybe<Scalars['String']>
  originName?: Maybe<Scalars['String']>
  reportingPersonName?: Maybe<Scalars['String']>
  reportingPersonNationalId?: Maybe<Scalars['String']>
}

export type VehiclesBulkMileageRegistrationJobHistory = {
  __typename?: 'VehiclesBulkMileageRegistrationJobHistory'
  history: Array<VehiclesBulkMileageRegistrationJob>
}

export type VehiclesBulkMileageRegistrationRequestDetail = {
  __typename?: 'VehiclesBulkMileageRegistrationRequestDetail'
  errors?: Maybe<Array<VehiclesBulkMileageRegistrationRequestError>>
  guid: Scalars['ID']
  mileage?: Maybe<Scalars['Int']>
  returnCode?: Maybe<Scalars['String']>
  vehicleId: Scalars['String']
}

export type VehiclesBulkMileageRegistrationRequestError = {
  __typename?: 'VehiclesBulkMileageRegistrationRequestError'
  code?: Maybe<Scalars['String']>
  message?: Maybe<Scalars['String']>
  warningSerialCode?: Maybe<Scalars['Int']>
  warningText?: Maybe<Scalars['String']>
}

export type VehiclesBulkMileageRegistrationRequestOverview = {
  __typename?: 'VehiclesBulkMileageRegistrationRequestOverview'
  requests: Array<VehiclesBulkMileageRegistrationRequestDetail>
}

export type VehiclesBulkMileageRegistrationRequestStatus = {
  __typename?: 'VehiclesBulkMileageRegistrationRequestStatus'
  jobsErrored?: Maybe<Scalars['Int']>
  jobsFinished?: Maybe<Scalars['Int']>
  jobsRemaining?: Maybe<Scalars['Int']>
  jobsSubmitted?: Maybe<Scalars['Int']>
  jobsValid?: Maybe<Scalars['Int']>
  requestId: Scalars['ID']
}

export type VehiclesColor = {
  __typename?: 'VehiclesColor'
  code: Scalars['String']
  name: Scalars['String']
}

export type VehiclesCurrentListResponse = {
  __typename?: 'VehiclesCurrentListResponse'
  data?: Maybe<Array<VehicleCurrentWithMileage>>
  pageNumber: Scalars['Int']
  pageSize: Scalars['Int']
  totalPages: Scalars['Int']
  totalRecords: Scalars['Int']
}

export type VehiclesCurrentOwnerInfo = {
  __typename?: 'VehiclesCurrentOwnerInfo'
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  dateOfPurchase?: Maybe<Scalars['DateTime']>
  nationalId?: Maybe<Scalars['String']>
  owner?: Maybe<Scalars['String']>
  postalcode?: Maybe<Scalars['String']>
}

export type VehiclesDetail = {
  __typename?: 'VehiclesDetail'
  basicInfo?: Maybe<VehiclesBasicInfo>
  coOwners?: Maybe<Array<VehiclesCurrentOwnerInfo>>
  currentOwnerInfo?: Maybe<VehiclesCurrentOwnerInfo>
  downloadServiceURL?: Maybe<Scalars['String']>
  inspectionInfo?: Maybe<VehiclesInspectionInfo>
  isDebtLess?: Maybe<Scalars['Boolean']>
  isOutOfCommission?: Maybe<Scalars['Boolean']>
  lastMileage?: Maybe<VehicleMileageDetail>
  mainInfo?: Maybe<VehiclesMainInfo>
  operators?: Maybe<Array<VehiclesOperator>>
  ownersInfo?: Maybe<Array<VehiclesOwners>>
  registrationInfo?: Maybe<VehiclesRegistrationInfo>
  technicalInfo?: Maybe<VehiclesTechnicalInfo>
}

export type VehiclesDownloadServiceUrls = {
  __typename?: 'VehiclesDownloadServiceUrls'
  excel: Scalars['String']
  pdf: Scalars['String']
}

export type VehiclesInspectionInfo = {
  __typename?: 'VehiclesInspectionInfo'
  carTax?: Maybe<Scalars['Float']>
  date?: Maybe<Scalars['DateTime']>
  inspectionFine?: Maybe<Scalars['Float']>
  insuranceStatus?: Maybe<Scalars['Boolean']>
  lastInspectionDate?: Maybe<Scalars['DateTime']>
  mortages?: Maybe<Scalars['Float']>
  nextInspectionDate?: Maybe<Scalars['DateTime']>
  odometer?: Maybe<Scalars['String']>
  result?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type VehiclesList = {
  __typename?: 'VehiclesList'
  /** @deprecated New service does not include this field */
  address?: Maybe<Scalars['String']>
  /** @deprecated New service does not include this field */
  createdTimestamp?: Maybe<Scalars['String']>
  downloadServiceUrls?: Maybe<VehiclesDownloadServiceUrls>
  /** @deprecated New service does not include this field */
  name?: Maybe<Scalars['String']>
  paging?: Maybe<VehiclePaging>
  /** @deprecated New service does not include this field */
  persidno?: Maybe<Scalars['String']>
  /** @deprecated New service does not include this field */
  postStation?: Maybe<Scalars['String']>
  /** @deprecated Too slow. Use VehiclesListV2 when possible. */
  vehicleList?: Maybe<Array<VehiclesVehicle>>
}

export type VehiclesListInputV3 = {
  filterOnlyVehiclesUserCanRegisterMileage?: InputMaybe<Scalars['Boolean']>
  page: Scalars['Float']
  pageSize: Scalars['Float']
  query?: InputMaybe<Scalars['String']>
}

export type VehiclesListV2 = {
  __typename?: 'VehiclesListV2'
  downloadServiceUrls?: Maybe<VehiclesDownloadServiceUrls>
  paging?: Maybe<VehiclePaging>
  vehicleList?: Maybe<Array<VehicleListed>>
}

export type VehiclesMainInfo = {
  __typename?: 'VehiclesMainInfo'
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  co2?: Maybe<Scalars['Float']>
  co2Wltp?: Maybe<Scalars['Float']>
  cubicCapacity?: Maybe<Scalars['Float']>
  model?: Maybe<Scalars['String']>
  nextAvailableMileageReadDate?: Maybe<Scalars['DateTime']>
  regno?: Maybe<Scalars['String']>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
  subModel?: Maybe<Scalars['String']>
  trailerWithBrakesWeight?: Maybe<Scalars['Float']>
  trailerWithoutBrakesWeight?: Maybe<Scalars['Float']>
  weightedCo2?: Maybe<Scalars['Float']>
  weightedCo2Wltp?: Maybe<Scalars['Float']>
  year?: Maybe<Scalars['Float']>
}

export type VehiclesMileageDetails = {
  __typename?: 'VehiclesMileageDetails'
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  lastMileageRegistration?: Maybe<VehiclesMileageRegistration>
  mileageRegistrations?: Maybe<VehiclesMileageRegistrationHistory>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
}

export type VehiclesMileageRegistration = {
  __typename?: 'VehiclesMileageRegistration'
  /** ISO8601 */
  date: Scalars['String']
  internalId?: Maybe<Scalars['Int']>
  mileage: Scalars['Int']
  operation?: Maybe<Scalars['String']>
  originCode: Scalars['String']
  /** ISO8601 */
  transactionDate?: Maybe<Scalars['String']>
}

export type VehiclesMileageRegistrationHistory = {
  __typename?: 'VehiclesMileageRegistrationHistory'
  mileageRegistrationHistory?: Maybe<Array<VehiclesMileageRegistration>>
  vehicleId: Scalars['String']
}

export type VehiclesMileageUpdateError = {
  __typename?: 'VehiclesMileageUpdateError'
  code?: Maybe<Scalars['Int']>
  error?: Maybe<Scalars['JSON']>
  message: Scalars['String']
}

export type VehiclesOperator = {
  __typename?: 'VehiclesOperator'
  address?: Maybe<Scalars['String']>
  city?: Maybe<Scalars['String']>
  endDate?: Maybe<Scalars['DateTime']>
  mainOperator?: Maybe<Scalars['Boolean']>
  /** Deprecated. Keeping in for now for backward compatibility. */
  mainoperator?: Maybe<Scalars['Boolean']>
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
  postalcode?: Maybe<Scalars['String']>
  serial?: Maybe<Scalars['Float']>
  startDate?: Maybe<Scalars['DateTime']>
}

export type VehiclesOwners = {
  __typename?: 'VehiclesOwners'
  address?: Maybe<Scalars['String']>
  current?: Maybe<Scalars['Boolean']>
  dateOfPurchase: Scalars['DateTime']
  name?: Maybe<Scalars['String']>
  nationalId?: Maybe<Scalars['String']>
}

export type VehiclesPublicVehicleSearch = {
  __typename?: 'VehiclesPublicVehicleSearch'
  co?: Maybe<Scalars['Float']>
  co2?: Maybe<Scalars['Float']>
  co2WLTP?: Maybe<Scalars['Float']>
  color?: Maybe<Scalars['String']>
  firstRegDate?: Maybe<Scalars['DateTime']>
  make?: Maybe<Scalars['String']>
  mass?: Maybe<Scalars['Float']>
  massLaden?: Maybe<Scalars['Float']>
  newRegDate?: Maybe<Scalars['DateTime']>
  nextVehicleMainInspection?: Maybe<Scalars['DateTime']>
  permno?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['String']>
  typeNumber?: Maybe<Scalars['String']>
  vehicleCommercialName?: Maybe<Scalars['String']>
  vehicleStatus?: Maybe<Scalars['String']>
  vin?: Maybe<Scalars['String']>
  weightedCo2?: Maybe<Scalars['Float']>
  weightedCo2WLTP?: Maybe<Scalars['Float']>
}

export type VehiclesRegistration = {
  __typename?: 'VehiclesRegistration'
  code?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  number: Scalars['String']
  subName?: Maybe<Scalars['String']>
}

export type VehiclesRegistrationInfo = {
  __typename?: 'VehiclesRegistrationInfo'
  color?: Maybe<Scalars['String']>
  driversPassengers?: Maybe<Scalars['Float']>
  firstRegistrationDate?: Maybe<Scalars['DateTime']>
  newRegistrationDate?: Maybe<Scalars['DateTime']>
  passengers?: Maybe<Scalars['Float']>
  plateLocation?: Maybe<Scalars['String']>
  plateStatus?: Maybe<Scalars['String']>
  plateTypeFront?: Maybe<Scalars['String']>
  plateTypeRear?: Maybe<Scalars['String']>
  preRegistrationDate?: Maybe<Scalars['DateTime']>
  reggroup?: Maybe<Scalars['String']>
  reggroupName?: Maybe<Scalars['String']>
  specialName?: Maybe<Scalars['String']>
  standingPassengers?: Maybe<Scalars['Float']>
  useGroup?: Maybe<Scalars['String']>
  vehicleGroup?: Maybe<Scalars['String']>
}

export type VehiclesTechnicalInfo = {
  __typename?: 'VehiclesTechnicalInfo'
  axleTotalWeight?: Maybe<Scalars['Float']>
  axles?: Maybe<Array<VehiclesAxle>>
  capacityWeight?: Maybe<Scalars['Float']>
  carryingCapacity?: Maybe<Scalars['Float']>
  cubicCapacity?: Maybe<Scalars['String']>
  engine?: Maybe<Scalars['String']>
  horsepower?: Maybe<Scalars['Float']>
  length?: Maybe<Scalars['Float']>
  totalWeight?: Maybe<Scalars['String']>
  trailerWithBrakesWeight?: Maybe<Scalars['Float']>
  trailerWithoutBrakesWeight?: Maybe<Scalars['Float']>
  tyres?: Maybe<Tyres>
  vehicleWeight?: Maybe<Scalars['Float']>
  width?: Maybe<Scalars['Float']>
}

export type VehiclesVehicle = {
  __typename?: 'VehiclesVehicle'
  buyerPersidno?: Maybe<Scalars['String']>
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  color?: Maybe<Scalars['String']>
  deregistrationDate?: Maybe<Scalars['DateTime']>
  firstRegDate?: Maybe<Scalars['DateTime']>
  isCurrent?: Maybe<Scalars['Boolean']>
  lastInspectionDate?: Maybe<Scalars['DateTime']>
  lastInspectionResult?: Maybe<Scalars['String']>
  lastInspectionType?: Maybe<Scalars['String']>
  modelYear?: Maybe<Scalars['String']>
  nextAvailableMileageReadDate?: Maybe<Scalars['DateTime']>
  nextInspection?: Maybe<NextInspection>
  nextInspectionDate?: Maybe<Scalars['DateTime']>
  operatorEndDate?: Maybe<Scalars['DateTime']>
  operatorNumber?: Maybe<Scalars['Float']>
  operatorStartDate?: Maybe<Scalars['DateTime']>
  otherOwners?: Maybe<Scalars['Boolean']>
  outOfUse?: Maybe<Scalars['Boolean']>
  ownerName?: Maybe<Scalars['String']>
  ownerPersidno?: Maybe<Scalars['String']>
  ownerSsid?: Maybe<Scalars['String']>
  permno?: Maybe<Scalars['String']>
  plateStatus?: Maybe<Scalars['String']>
  primaryOperator?: Maybe<Scalars['Boolean']>
  productYear?: Maybe<Scalars['String']>
  registrationType?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['String']>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
  role?: Maybe<Scalars['String']>
  termination?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
  useGroup?: Maybe<Scalars['String']>
  vehGroup?: Maybe<Scalars['String']>
  vehicleStatus?: Maybe<Scalars['String']>
  vin?: Maybe<Scalars['String']>
}

export type VehiclesVehicleSearch = {
  __typename?: 'VehiclesVehicleSearch'
  canRegisterMileage?: Maybe<Scalars['Boolean']>
  co?: Maybe<Scalars['Float']>
  co2Wltp?: Maybe<Scalars['Float']>
  color?: Maybe<Scalars['String']>
  currentOwner?: Maybe<Scalars['String']>
  currentOwnerAddress?: Maybe<Scalars['String']>
  currentOwnerIsAnonymous?: Maybe<Scalars['Boolean']>
  engine?: Maybe<Scalars['String']>
  firstregdate?: Maybe<Scalars['DateTime']>
  latestregistration?: Maybe<Scalars['String']>
  mass?: Maybe<Scalars['Float']>
  massLaden?: Maybe<Scalars['Float']>
  nextAvailableMileageReadDate?: Maybe<Scalars['DateTime']>
  nextInspection?: Maybe<VehiclesVehicleSearchNextInspection>
  operatorAnonymityStatus: OperatorAnonymityStatus
  /** Basic operator array, names only. */
  operatorNames?: Maybe<Array<Scalars['String']>>
  permno?: Maybe<Scalars['String']>
  regno?: Maybe<Scalars['String']>
  regtype?: Maybe<Scalars['String']>
  requiresMileageRegistration?: Maybe<Scalars['Boolean']>
  type?: Maybe<Scalars['String']>
  useGroup?: Maybe<Scalars['String']>
  vehicleStatus?: Maybe<Scalars['String']>
  vin?: Maybe<Scalars['String']>
  weightedco2Wltp?: Maybe<Scalars['Float']>
}

export type VehiclesVehicleSearchNextInspection = {
  __typename?: 'VehiclesVehicleSearchNextInspection'
  nextinspectiondate?: Maybe<Scalars['DateTime']>
  nextinspectiondateIfPassedInspectionToday?: Maybe<Scalars['DateTime']>
}

export type VerifyLicenseBarcodeDataUnion = LicenseDriverLicenseData

/** Exhaustive list of verify license barcode errors */
export enum VerifyLicenseBarcodeError {
  Error = 'ERROR',
  Expired = 'EXPIRED',
}

export type VerifyLicenseBarcodeInput = {
  data: Scalars['String']
}

export type VerifyLicenseBarcodeResult = {
  __typename?: 'VerifyLicenseBarcodeResult'
  /** Verify license barcode type */
  barcodeType: VerifyLicenseBarcodeType
  /** Optional data related to the verify verification */
  data?: Maybe<VerifyLicenseBarcodeDataUnion>
  /** Verify result error */
  error?: Maybe<VerifyLicenseBarcodeError>
  licenseType?: Maybe<GenericLicenseType>
  /** Is the verify valid? */
  valid: Scalars['Boolean']
}

/** Exhaustive list of verify license barcode types */
export enum VerifyLicenseBarcodeType {
  PkPass = 'PK_PASS',
  Unknown = 'UNKNOWN',
  V2 = 'V2',
}

export type VerifyPkPassInput = {
  data: Scalars['String']
}

export type WatsonAssistantChatIdentityTokenInput = {
  email: Scalars['String']
  name: Scalars['String']
  userID: Scalars['String']
}

export type WatsonAssistantChatIdentityTokenResponse = {
  __typename?: 'WatsonAssistantChatIdentityTokenResponse'
  token: Scalars['String']
}

export type WatsonAssistantChatSubmitFeedbackInput = {
  assistantChatLog: Array<Scalars['JSONObject']>
  feedback?: InputMaybe<Scalars['String']>
  thumbStatus: WatsonAssistantChatSubmitFeedbackThumbStatus
  url?: InputMaybe<Scalars['String']>
}

export type WatsonAssistantChatSubmitFeedbackResponse = {
  __typename?: 'WatsonAssistantChatSubmitFeedbackResponse'
  success: Scalars['Boolean']
}

export enum WatsonAssistantChatSubmitFeedbackThumbStatus {
  Down = 'Down',
  NoChoice = 'NoChoice',
  Up = 'Up',
}

export type WebSearchAutocomplete = {
  __typename?: 'WebSearchAutocomplete'
  completions: Array<Scalars['String']>
  total: Scalars['Int']
}

export type WebSearchAutocompleteInput = {
  language?: InputMaybe<ContentLanguage>
  singleTerm: Scalars['String']
  size?: InputMaybe<Scalars['Int']>
}

export type WebVerdictByIdInput = {
  id: Scalars['String']
}

export type WebVerdictByIdItem = {
  __typename?: 'WebVerdictByIdItem'
  caseNumber: Scalars['String']
  court: Scalars['String']
  keywords: Array<Scalars['String']>
  pdfString?: Maybe<Scalars['String']>
  presentings: Scalars['String']
  richText?: Maybe<Scalars['JSON']>
  title: Scalars['String']
  verdictDate?: Maybe<Scalars['DateTime']>
}

export type WebVerdictByIdResponse = {
  __typename?: 'WebVerdictByIdResponse'
  item: WebVerdictByIdItem
}

export type WebVerdictCaseCategoriesResponse = {
  __typename?: 'WebVerdictCaseCategoriesResponse'
  caseCategories: Array<WebVerdictCaseCategory>
}

export type WebVerdictCaseCategory = {
  __typename?: 'WebVerdictCaseCategory'
  label: Scalars['String']
}

export type WebVerdictCaseType = {
  __typename?: 'WebVerdictCaseType'
  label: Scalars['String']
}

export type WebVerdictCaseTypesResponse = {
  __typename?: 'WebVerdictCaseTypesResponse'
  caseTypes: Array<WebVerdictCaseType>
}

export type WebVerdictItem = {
  __typename?: 'WebVerdictItem'
  caseNumber: Scalars['String']
  court: Scalars['String']
  id: Scalars['String']
  keywords: Array<Scalars['String']>
  presentings: Scalars['String']
  presidentJudge?: Maybe<WebVerdictJudge>
  title: Scalars['String']
  verdictDate?: Maybe<Scalars['DateTime']>
}

export type WebVerdictJudge = {
  __typename?: 'WebVerdictJudge'
  name?: Maybe<Scalars['String']>
  title?: Maybe<Scalars['String']>
}

export type WebVerdictKeyword = {
  __typename?: 'WebVerdictKeyword'
  label: Scalars['String']
}

export type WebVerdictKeywordsResponse = {
  __typename?: 'WebVerdictKeywordsResponse'
  keywords: Array<WebVerdictKeyword>
}

export type WebVerdictsInput = {
  caseCategories?: InputMaybe<Array<Scalars['String']>>
  caseNumber?: InputMaybe<Scalars['String']>
  caseTypes?: InputMaybe<Array<Scalars['String']>>
  courtLevel?: InputMaybe<Scalars['String']>
  dateFrom?: InputMaybe<Scalars['String']>
  dateTo?: InputMaybe<Scalars['String']>
  keywords?: InputMaybe<Array<Scalars['String']>>
  laws?: InputMaybe<Array<Scalars['String']>>
  page?: InputMaybe<Scalars['Int']>
  searchTerm?: InputMaybe<Scalars['String']>
}

export type WebVerdictsInputResponse = {
  __typename?: 'WebVerdictsInputResponse'
  caseCategories?: Maybe<Array<Scalars['String']>>
  caseNumber?: Maybe<Scalars['String']>
  caseTypes?: Maybe<Array<Scalars['String']>>
  courtLevel?: Maybe<Scalars['String']>
  dateFrom?: Maybe<Scalars['String']>
  dateTo?: Maybe<Scalars['String']>
  keywords?: Maybe<Array<Scalars['String']>>
  laws?: Maybe<Array<Scalars['String']>>
  page?: Maybe<Scalars['Int']>
  searchTerm?: Maybe<Scalars['String']>
}

export type WebVerdictsResponse = {
  __typename?: 'WebVerdictsResponse'
  input: WebVerdictsInputResponse
  items: Array<WebVerdictItem>
  total: Scalars['Int']
}

export type WorkMachine = {
  __typename?: 'WorkMachine'
  category?: Maybe<Scalars['String']>
  dateLastInspection?: Maybe<Scalars['DateTime']>
  id?: Maybe<Scalars['ID']>
  importer?: Maybe<Scalars['String']>
  insurer?: Maybe<Scalars['String']>
  labels?: Maybe<Array<WorkMachinesLabel>>
  licensePlateNumber?: Maybe<Scalars['String']>
  links?: Maybe<Array<WorkMachinesLink>>
  ownerAddress?: Maybe<Scalars['String']>
  ownerName?: Maybe<Scalars['String']>
  ownerNationalId?: Maybe<Scalars['String']>
  ownerNumber?: Maybe<Scalars['String']>
  ownerPostcode?: Maybe<Scalars['String']>
  productionCountry?: Maybe<Scalars['String']>
  productionNumber?: Maybe<Scalars['String']>
  productionYear?: Maybe<Scalars['Float']>
  registrationDate?: Maybe<Scalars['String']>
  registrationNumber?: Maybe<Scalars['String']>
  status?: Maybe<Scalars['String']>
  subCategory?: Maybe<Scalars['String']>
  supervisorAddress?: Maybe<Scalars['String']>
  supervisorName?: Maybe<Scalars['String']>
  supervisorNationalId?: Maybe<Scalars['String']>
  supervisorPostcode?: Maybe<Scalars['String']>
  type?: Maybe<Scalars['String']>
}

export type WorkMachineExamineeInput = {
  drivingLicenseCountryOfOrigin?: InputMaybe<Scalars['String']>
  drivingLicenseNumber?: InputMaybe<Scalars['String']>
  email?: InputMaybe<Scalars['String']>
  examCategories?: InputMaybe<Array<Scalars['String']>>
  nationalId?: InputMaybe<Scalars['String']>
  phoneNumber?: InputMaybe<Scalars['String']>
}

export type WorkMachineExamineeValidation = {
  __typename?: 'WorkMachineExamineeValidation'
  doesntHaveToPayLicenseFee?: Maybe<Scalars['Boolean']>
  errorMessage?: Maybe<Scalars['String']>
  errorMessageEn?: Maybe<Scalars['String']>
  examCategories?: Maybe<Array<Scalars['String']>>
  isValid?: Maybe<Scalars['Boolean']>
  nationalId?: Maybe<Scalars['String']>
}

export enum WorkMachinesAction {
  ChangeStatus = 'CHANGE_STATUS',
  OwnerChange = 'OWNER_CHANGE',
  RegisterForTraffic = 'REGISTER_FOR_TRAFFIC',
  RequestInspection = 'REQUEST_INSPECTION',
  SupervisorChange = 'SUPERVISOR_CHANGE',
}

export type WorkMachinesCategory = {
  __typename?: 'WorkMachinesCategory'
  name?: Maybe<Scalars['String']>
  nameEn?: Maybe<Scalars['String']>
  registrationNumberPrefix?: Maybe<Scalars['String']>
  subCategoryName?: Maybe<Scalars['String']>
  subCategoryNameEn?: Maybe<Scalars['String']>
}

export type WorkMachinesCollectionDocument = {
  __typename?: 'WorkMachinesCollectionDocument'
  downloadUrl?: Maybe<Scalars['String']>
}

export type WorkMachinesCollectionDocumentInput = {
  fileType?: InputMaybe<WorkMachinesFileType>
}

export type WorkMachinesCollectionInput = {
  locale?: InputMaybe<Scalars['String']>
  onlyInOwnerChangeProcess?: InputMaybe<Scalars['Boolean']>
  orderBy?: InputMaybe<Scalars['String']>
  pageNumber?: InputMaybe<Scalars['Float']>
  pageSize?: InputMaybe<Scalars['Float']>
  searchQuery?: InputMaybe<Scalars['String']>
  showDeregisteredMachines?: InputMaybe<Scalars['Boolean']>
  supervisorRegistered?: InputMaybe<Scalars['Boolean']>
}

export type WorkMachinesCollectionLink = {
  __typename?: 'WorkMachinesCollectionLink'
  displayTitle?: Maybe<Scalars['String']>
  href?: Maybe<Scalars['String']>
  method?: Maybe<Scalars['String']>
  rel?: Maybe<WorkMachinesExternalLink>
}

export enum WorkMachinesExternalLink {
  Csv = 'CSV',
  Excel = 'EXCEL',
  NextPage = 'NEXT_PAGE',
  Self = 'SELF',
}

export enum WorkMachinesFileType {
  Csv = 'CSV',
  Excel = 'EXCEL',
}

export type WorkMachinesInput = {
  id: Scalars['String']
  locale: Scalars['String']
}

export type WorkMachinesLabel = {
  __typename?: 'WorkMachinesLabel'
  columnName?: Maybe<Scalars['String']>
  displayTitle?: Maybe<Scalars['String']>
  tooltip?: Maybe<Scalars['String']>
}

export type WorkMachinesLink = {
  __typename?: 'WorkMachinesLink'
  displayTitle?: Maybe<Scalars['String']>
  href?: Maybe<Scalars['String']>
  method?: Maybe<Scalars['String']>
  rel?: Maybe<WorkMachinesAction>
}

export type WorkMachinesMachineType = {
  __typename?: 'WorkMachinesMachineType'
  name?: Maybe<Scalars['String']>
}

export type WorkMachinesModel = {
  __typename?: 'WorkMachinesModel'
  name?: Maybe<Scalars['String']>
}

export type WorkMachinesPaginatedCollection = {
  __typename?: 'WorkMachinesPaginatedCollection'
  data: Array<WorkMachine>
  labels?: Maybe<Array<WorkMachinesLabel>>
  links?: Maybe<Array<WorkMachinesCollectionLink>>
  pageInfo: PageInfoDto
  totalCount: Scalars['Float']
}

export type WorkMachinesParentCategoryByTypeAndModelInput = {
  model: Scalars['String']
  type: Scalars['String']
}

export type WorkMachinesSubCategory = {
  __typename?: 'WorkMachinesSubCategory'
  name?: Maybe<Scalars['String']>
  nameEn?: Maybe<Scalars['String']>
  parentCategoryName?: Maybe<Scalars['String']>
  parentCategoryNameEn?: Maybe<Scalars['String']>
  registrationNumberPrefix?: Maybe<Scalars['String']>
}

export type WorkMachinesTechInfoItem = {
  __typename?: 'WorkMachinesTechInfoItem'
  label?: Maybe<Scalars['String']>
  labelEn?: Maybe<Scalars['String']>
  maxLength?: Maybe<Scalars['String']>
  required?: Maybe<Scalars['Boolean']>
  type?: Maybe<Scalars['String']>
  values?: Maybe<Array<WorkMachinesTechInfoListItem>>
  variableName?: Maybe<Scalars['String']>
}

export type WorkMachinesTechInfoListItem = {
  __typename?: 'WorkMachinesTechInfoListItem'
  name?: Maybe<Scalars['String']>
  nameEn?: Maybe<Scalars['String']>
}

export type XroadIdentifier = {
  __typename?: 'XroadIdentifier'
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  serviceCode: Scalars['String']
  subsystemCode: Scalars['String']
}

export type ChangeEndorsmentListClosedDateDto = {
  closedDate: Scalars['DateTime']
}

export enum OccupationalLicenseLicenseType {
  DistrictCommissioners = 'DISTRICT_COMMISSIONERS',
  Education = 'EDUCATION',
  HealthDirectorate = 'HEALTH_DIRECTORATE',
}

export type OfficialJournalOfIcelandApplicationAdvertTemplateResponse = {
  __typename?: 'officialJournalOfIcelandApplicationAdvertTemplateResponse'
  html: Scalars['String']
  type: OfficialJournalOfIcelandApplicationAdvertTemplateTypeEnum
}

export type OfficialJournalOfIcelandApplicationAdvertTemplateType = {
  __typename?: 'officialJournalOfIcelandApplicationAdvertTemplateType'
  title: Scalars['String']
  type: OfficialJournalOfIcelandApplicationAdvertTemplateTypeEnum
}

export enum OfficialJournalOfIcelandApplicationAdvertTemplateTypeEnum {
  Auglysing = 'AUGLYSING',
  Gjaldskra = 'GJALDSKRA',
  Reglugerd = 'REGLUGERD',
  Unknown = 'UNKNOWN',
}

export type OfficialJournalOfIcelandApplicationAdvertTemplateTypesResponse = {
  __typename?: 'officialJournalOfIcelandApplicationAdvertTemplateTypesResponse'
  types: Array<OfficialJournalOfIcelandApplicationAdvertTemplateType>
}

export type SendPdfEmailInput = {
  emailAddress: Scalars['String']
  listId: Scalars['String']
}

export type SendPdfEmailResponse = {
  __typename?: 'sendPdfEmailResponse'
  success: Scalars['Boolean']
}

export type SiaUnionsQueryVariables = Exact<{ [key: string]: never }>

export type SiaUnionsQuery = {
  __typename?: 'Query'
  socialInsuranceUnions: Array<{
    __typename?: 'SocialInsuranceGeneralUnion'
    nationalId: string
    name: string
  }>
}
