import gql from 'graphql-tag'
import * as ApolloReactCommon from '@apollo/client'
import * as ApolloReactHooks from '@apollo/client'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K]
}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: Date
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: { [key: string]: any }
}

export type AccessCategory = 'XROAD' | 'APIGW'

export type AddAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
  url: Scalars['String']
}

export type ApplicationApplicationInput = {
  id: Scalars['String']
}

export type ApplicationApplicationsInput = {
  typeId?: Maybe<Array<Scalars['String']>>
  status?: Maybe<Array<Scalars['String']>>
}

export type ApplicationEligibilityInput = {
  applicationFor: Scalars['String']
}

export type ApplicationPaymentChargeInput = {
  applicationId: Scalars['String']
  chargeItemCode: Scalars['String']
}

export type ApplicationResponseDtoStatusEnum =
  | 'inprogress'
  | 'completed'
  | 'rejected'

export type ApplicationResponseDtoTypeIdEnum =
  | 'ExampleForm'
  | 'Passport'
  | 'DrivingLicense'
  | 'DrivingAssessmentApproval'
  | 'ParentalLeave'
  | 'DocumentProviderOnboarding'
  | 'HealthInsurance'
  | 'ChildrenResidenceChange'
  | 'DataProtectionAuthorityComplaint'
  | 'LoginService'
  | 'InstitutionCollaboration'
  | 'FundingGovernmentProjects'
  | 'PublicDebtPaymentPlan'
  | 'ComplaintsToAlthingiOmbudsman'
  | 'AccidentNotification'
  | 'GeneralPetitionService'
  | 'PSign'
  | 'CriminalRecord'
  | 'ExamplePayment'

export type AssignApplicationInput = {
  token: Scalars['String']
}

export type AttachmentPresignedUrlInput = {
  id: Scalars['String']
  attachmentKey: Scalars['String']
}

export type AuthDelegationInput = {
  delegationId: Scalars['String']
}

export type AuthDelegationProvider =
  | 'Thjodskra'
  | 'Fyrirtaekjaskra'
  | 'Talsmannagrunnur'
  | 'Delegationdb'

export type AuthDelegationScopeInput = {
  name: Scalars['String']
  type: AuthDelegationScopeType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthDelegationScopeType = 'ApiScope' | 'IdentityResource'

export type AuthDelegationType =
  | 'LegalGuardian'
  | 'ProcurationHolder'
  | 'PersonalRepresentative'
  | 'Custom'

export type ConfirmEmailVerificationInput = {
  hash: Scalars['String']
}

export type ConfirmSmsVerificationInput = {
  code: Scalars['String']
}

export type ContactUsInput = {
  name: Scalars['String']
  phone?: Maybe<Scalars['String']>
  email: Scalars['String']
  subject?: Maybe<Scalars['String']>
  message: Scalars['String']
}

export type ContentLanguage = 'is' | 'en'

export type CreateApplicationDtoTypeIdEnum =
  | 'ExampleForm'
  | 'Passport'
  | 'DrivingLicense'
  | 'DrivingAssessmentApproval'
  | 'ParentalLeave'
  | 'DocumentProviderOnboarding'
  | 'HealthInsurance'
  | 'ChildrenResidenceChange'
  | 'DataProtectionAuthorityComplaint'
  | 'LoginService'
  | 'InstitutionCollaboration'
  | 'FundingGovernmentProjects'
  | 'PublicDebtPaymentPlan'
  | 'ComplaintsToAlthingiOmbudsman'
  | 'AccidentNotification'
  | 'GeneralPetitionService'
  | 'PSign'
  | 'CriminalRecord'
  | 'ExamplePayment'

export type CreateApplicationInput = {
  typeId: CreateApplicationDtoTypeIdEnum
}

export type CreateAuthDelegationInput = {
  toNationalId: Scalars['String']
  scopes?: Maybe<Array<AuthDelegationScopeInput>>
}

export type CreateContactInput = {
  name: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type CreateEmailVerificationInput = {
  email: Scalars['String']
}

export type CreateEndorsementInput = {
  listId: Scalars['String']
  endorsementDto: EndorsementInput
}

export type CreateEndorsementListDto = {
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  endorsementMetadata: Array<MetadataInput>
  tags: Array<EndorsementListDtoTagsEnum>
  meta?: Maybe<Scalars['JSON']>
  closedDate: Scalars['DateTime']
  openedDate: Scalars['DateTime']
  adminLock: Scalars['Boolean']
}

export type CreateHelpdeskInput = {
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type CreateIcelandicNameInput = {
  icelandicName: Scalars['String']
  type: Scalars['String']
  status: Scalars['String']
  verdict?: Maybe<Scalars['String']>
  description?: Maybe<Scalars['String']>
  visible: Scalars['Boolean']
  url?: Maybe<Scalars['String']>
}

export type CreateProviderInput = {
  nationalId: Scalars['String']
  clientName: Scalars['String']
}

export type CreateSmsVerificationInput = {
  mobilePhoneNumber: Scalars['String']
}

export type CreateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  documentNotifications?: Maybe<Scalars['Boolean']>
  emailStatus?: Maybe<Scalars['String']>
  mobileStatus?: Maybe<Scalars['String']>
  emailCode?: Maybe<Scalars['String']>
  smsCode?: Maybe<Scalars['String']>
  canNudge?: Maybe<Scalars['Boolean']>
}

export type DataCategory =
  | 'OPEN'
  | 'PUBLIC'
  | 'OFFICIAL'
  | 'PERSONAL'
  | 'HEALTH'
  | 'FINANCIAL'

export type DataProvider = {
  id: Scalars['String']
  type: Scalars['String']
}

export type DeleteAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
}

export type DeleteAuthDelegationInput = {
  delegationId: Scalars['String']
}

export type DeleteIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type DeleteIslykillValueInput = {
  mobilePhoneNumber?: Maybe<Scalars['Boolean']>
  email?: Maybe<Scalars['Boolean']>
}

export type EndorsementInput = {
  showName: Scalars['Boolean']
}

export type EndorsementListControllerFindByTagsTagsEnum = 'generalPetition'

export type EndorsementListDtoTagsEnum = 'generalPetition'

export type EndorsementListOpenTagsEnum = 'generalPetition'

export type EndorsementListTagsEnum = 'generalPetition'

export type EndorsementMetadataDtoFieldEnum = 'fullName' | 'showName'

export type EndorsementPaginationInput = {
  limit?: Maybe<Scalars['Float']>
  before?: Maybe<Scalars['String']>
  after?: Maybe<Scalars['String']>
}

export type Environment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION'

export type FetchEducationSignedLicenseUrlInput = {
  licenseId: Scalars['String']
}

export type FindEndorsementListInput = {
  listId: Scalars['String']
}

export type Gender =
  | 'MALE'
  | 'FEMALE'
  | 'TRANSGENDER'
  | 'MALE_MINOR'
  | 'FEMALE_MINOR'
  | 'TRANSGENDER_MINOR'
  | 'UNKNOWN'

export type GeneratePdfDtoTypeEnum = 'ChildrenResidenceChange'

export type GeneratePdfInput = {
  id: Scalars['String']
  type: GeneratePdfDtoTypeEnum
}

export type GeneratePkPassInput = {
  licenseType: Scalars['String']
}

/** Possible types of data fields */
export type GenericLicenseDataFieldType = 'Group' | 'Category' | 'Value'

/** Exhaustive list of license provider IDs */
export type GenericLicenseProviderId =
  | 'NationalPoliceCommissioner'
  | 'EnvironmentAgency'

/** Exhaustive list of license types */
export type GenericLicenseType = 'DriversLicense' | 'HuntingLicense'

/** Possible license fetch statuses */
export type GenericUserLicenseFetchStatus =
  | 'Fetched'
  | 'NotFetched'
  | 'Fetching'
  | 'Error'
  | 'Stale'

/** Possible license pkpass statuses */
export type GenericUserLicensePkPassStatus =
  | 'Available'
  | 'NotAvailable'
  | 'Unknown'

/** Possible license statuses for user */
export type GenericUserLicenseStatus = 'Unknown' | 'HasLicense' | 'NotAvailable'

export type GetAdgerdirFrontpageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirPageInput = {
  slug?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirPagesInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAlertBannerInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAnnualStatusDocumentInput = {
  year: Scalars['String']
}

export type GetApiCatalogueInput = {
  limit?: Maybe<Scalars['Int']>
  cursor?: Maybe<Scalars['String']>
  query?: Maybe<Scalars['String']>
  pricing?: Maybe<Array<Scalars['String']>>
  data?: Maybe<Array<Scalars['String']>>
  type?: Maybe<Array<Scalars['String']>>
  access?: Maybe<Array<Scalars['String']>>
}

export type GetApiServiceInput = {
  id: Scalars['ID']
}

export type GetArticleCategoriesInput = {
  lang?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
}

export type GetArticlesInput = {
  lang?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
  sort?: Maybe<SortField>
}

export type GetAuctionInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAuctionsInput = {
  lang?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Float']>
  month?: Maybe<Scalars['Float']>
}

export type GetContentSlugInput = {
  id: Scalars['String']
}

export type GetCustomerRecordsInput = {
  chargeTypeID?: Maybe<Array<Scalars['String']>>
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
}

export type GetDocumentInput = {
  id: Scalars['String']
}

export type GetDocumentsListInput = {
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
  listPath: Scalars['String']
}

export type GetErrorPageInput = {
  errorCode: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetFinanceDocumentInput = {
  documentID: Scalars['String']
}

export type GetFinancialOverviewInput = {
  orgID: Scalars['String']
  chargeTypeID: Scalars['String']
}

export type GetFrontpageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericLicenseInput = {
  licenseType: Scalars['String']
}

export type GetGenericLicensesInput = {
  includedTypes?: Maybe<Array<Scalars['String']>>
  excludedTypes?: Maybe<Array<Scalars['String']>>
  force?: Maybe<Scalars['Boolean']>
  onlyList?: Maybe<Scalars['Boolean']>
}

export type GetGenericOverviewPageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetHomestaysInput = {
  year?: Maybe<Scalars['Float']>
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
  totalAmount: Scalars['Float']
  disposableIncome: Scalars['Float']
  type: PaymentScheduleType
}

export type GetLifeEventPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInCategoryInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetMenuInput = {
  name: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetMultiPropertyInput = {
  cursor?: Maybe<Scalars['String']>
  limit?: Maybe<Scalars['Float']>
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetNewsDatesInput = {
  lang?: Maybe<Scalars['String']>
  order?: Maybe<Scalars['String']>
  tag?: Maybe<Scalars['String']>
}

export type GetNewsInput = {
  lang?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  month?: Maybe<Scalars['Int']>
  order?: Maybe<Scalars['String']>
  page?: Maybe<Scalars['Int']>
  size?: Maybe<Scalars['Int']>
  tag?: Maybe<Scalars['String']>
}

export type GetOpenApiInput = {
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  subsystemCode: Scalars['String']
  serviceCode: Scalars['String']
}

export type GetOpenDataPageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOpenDataSubpageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOperatingLicensesInput = {
  searchBy?: Maybe<Scalars['String']>
  pageNumber?: Maybe<Scalars['Float']>
  pageSize?: Maybe<Scalars['Float']>
}

export type GetOrganizationInput = {
  slug?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationSubpageInput = {
  organizationSlug: Scalars['String']
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationsInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetPagingTypes = {
  assetId: Scalars['String']
  cursor?: Maybe<Scalars['String']>
  limit?: Maybe<Scalars['Float']>
}

export type GetParentalLeavesApplicationPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  applicationId: Scalars['String']
}

export type GetParentalLeavesEntitlementsInput = {
  dateOfBirth: Scalars['String']
}

export type GetParentalLeavesEstimatedPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  period: Array<Period>
}

export type GetParentalLeavesPeriodEndDateInput = {
  startDate: Scalars['String']
  length: Scalars['String']
  percentage: Scalars['String']
}

export type GetParentalLeavesPeriodLengthInput = {
  startDate: Scalars['String']
  endDate: Scalars['String']
  percentage: Scalars['String']
}

export type GetPresignedUrlInput = {
  id: Scalars['String']
  type: Scalars['String']
}

export type GetProjectPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetRealEstateInput = {
  assetId: Scalars['String']
}

export type GetRegulationInput = {
  viewType: RegulationViewTypes
  name: Scalars['String']
  date?: Maybe<Scalars['String']>
  isCustomDiff?: Maybe<Scalars['Boolean']>
  earlierDate?: Maybe<Scalars['String']>
}

export type GetRegulationsInput = {
  type: Scalars['String']
  page?: Maybe<Scalars['Float']>
}

export type GetRegulationsLawChaptersInput = {
  tree?: Maybe<Scalars['Boolean']>
}

export type GetRegulationsSearchInput = {
  q?: Maybe<Scalars['String']>
  rn?: Maybe<Scalars['String']>
  ch?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Int']>
  yearTo?: Maybe<Scalars['Int']>
  iA?: Maybe<Scalars['Boolean']>
  iR?: Maybe<Scalars['Boolean']>
  page?: Maybe<Scalars['Int']>
}

export type GetScheduleDistributionInput = {
  monthAmount?: Maybe<Scalars['Float']>
  monthCount?: Maybe<Scalars['Float']>
  scheduleType: PaymentScheduleType
  totalAmount: Scalars['Float']
}

export type GetSingleArticleInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSingleMenuInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSingleNewsInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSubpageHeaderInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSupportCategoriesInOrganizationInput = {
  lang?: Maybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportCategoriesInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetSupportCategoryInput = {
  lang?: Maybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportQnAsInCategoryInput = {
  lang?: Maybe<Scalars['String']>
  slug: Scalars['String']
}

export type GetSupportQnAsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetTellUsAStoryInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetTranslationsInput = {
  namespaces: Array<Scalars['String']>
  lang: Scalars['String']
}

export type GetUrlInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type HealthInsuranceAccidentNotificationStatusTypes =
  | 'ACCEPTED'
  | 'REFUSED'
  | 'INPROGRESS'
  | 'INPROGRESSWAITINGFORDOCUMENT'

export type HealthInsuranceAccidentStatusInput = {
  ihiDocumentID: Scalars['Float']
}

export type IdentityInput = {
  nationalId: Scalars['String']
}

export type IdentityType = 'Person' | 'Company'

export type IsHealthInsuredInput = {
  date?: Maybe<Scalars['DateTime']>
}

export type MaritalStatus =
  | 'UNMARRIED'
  | 'MARRIED'
  | 'WIDOWED'
  | 'SEPARATED'
  | 'DIVORCED'
  | 'MARRIED_LIVING_SEPARATELY'
  | 'MARRIED_TO_FOREIGN_LAW_PERSON'
  | 'UNKNOWN'
  | 'FOREIGN_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON'
  | 'ICELANDIC_RESIDENCE_MARRIED_TO_UNREGISTERED_PERSON'

export type MetadataInput = {
  field: EndorsementMetadataDtoFieldEnum
}

export type OpenListInput = {
  listId: Scalars['String']
  changeEndorsmentListClosedDateDto: ChangeEndorsmentListClosedDateDto
}

export type PaginatedEndorsementInput = {
  listId: Scalars['String']
  limit?: Maybe<Scalars['Float']>
  before?: Maybe<Scalars['String']>
  after?: Maybe<Scalars['String']>
}

export type PaginatedEndorsementListInput = {
  tags: Array<EndorsementListControllerFindByTagsTagsEnum>
  limit?: Maybe<Scalars['Float']>
  before?: Maybe<Scalars['String']>
  after?: Maybe<Scalars['String']>
}

export type PaymentCatalogInput = {
  performingOrganizationID?: Maybe<Scalars['String']>
}

/** Possible types of schedules */
export type PaymentScheduleType =
  | 'FinesAndLegalCost'
  | 'OverpaidBenefits'
  | 'Wagedection'
  | 'OtherFees'

export type Period = {
  from: Scalars['String']
  to: Scalars['String']
  ratio: Scalars['String']
  approved: Scalars['Boolean']
  paid: Scalars['Boolean']
}

export type PricingCategory = 'FREE' | 'PAID'

export type RegulationViewTypes = 'current' | 'diff' | 'original' | 'd'

export type RequestFileSignatureDtoTypeEnum = 'ChildrenResidenceChange'

export type RequestFileSignatureInput = {
  id: Scalars['String']
  type: RequestFileSignatureDtoTypeEnum
}

export type RequirementKey =
  | 'drivingAssessmentMissing'
  | 'drivingSchoolMissing'
  | 'deniedByService'
  | 'localResidency'
  | 'noTempLicense'
  | 'noLicenseFound'
  | 'personNot17YearsOld'
  | 'hasNoPhoto'
  | 'hasNoSignature'
  | 'personNotFoundInNationalRegistry'
  | 'hasDeprivation'
  | 'hasPoints'

export type RskCompanyInfoInput = {
  nationalId: Scalars['String']
}

export type RskCompanyInfoSearchInput = {
  searchTerm: Scalars['String']
  first: Scalars['Float']
  /** Cursor for pagination as base64 encoded number */
  after?: Maybe<Scalars['String']>
}

export type RunEndpointTestsInput = {
  nationalId: Scalars['String']
  recipient: Scalars['String']
  documentId: Scalars['String']
  providerId: Scalars['String']
}

export type SearchableContentTypes =
  | 'webArticle'
  | 'webSubArticle'
  | 'webLifeEventPage'
  | 'webNews'
  | 'webAdgerdirPage'
  | 'webOrganizationSubpage'
  | 'webQNA'
  | 'webLink'

export type SearchableTags = 'category' | 'processentry' | 'organization'

export type SearcherInput = {
  queryString: Scalars['String']
  types?: Maybe<Array<SearchableContentTypes>>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  tags?: Maybe<Array<Tag>>
  countTag?: Maybe<Array<SearchableTags>>
  countTypes?: Maybe<Scalars['Boolean']>
  countProcessEntry?: Maybe<Scalars['Boolean']>
}

export type ServiceWebFormsInput = {
  name: Scalars['String']
  email: Scalars['String']
  subject?: Maybe<Scalars['String']>
  syslumadur: Scalars['String']
  category: Scalars['String']
  message: Scalars['String']
  institutionSlug: Scalars['String']
}

export type SortField = 'TITLE' | 'POPULAR'

export type StatisticsInput = {
  organisationId?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  fromDate?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  toDate?: Maybe<Scalars['String']>
}

export type SubmitApplicationInput = {
  id: Scalars['String']
  event: Scalars['String']
  answers?: Maybe<Scalars['JSON']>
}

export type Tag = {
  type: SearchableTags
  key: Scalars['String']
}

export type TellUsAStoryInput = {
  organization: Scalars['String']
  dateOfStory: Scalars['String']
  subject?: Maybe<Scalars['String']>
  message: Scalars['String']
  name: Scalars['String']
  email: Scalars['String']
  publicationAllowed?: Maybe<Scalars['Boolean']>
}

export type TypeCategory = 'REST' | 'SOAP' | 'GRAPHQL'

export type UpdateApplicationExternalDataInput = {
  id: Scalars['String']
  dataProviders: Array<DataProvider>
}

export type UpdateApplicationInput = {
  id: Scalars['String']
  answers?: Maybe<Scalars['JSON']>
}

export type UpdateAuthDelegationInput = {
  delegationId: Scalars['String']
  scopes: Array<AuthDelegationScopeInput>
}

export type UpdateContactInput = {
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type UpdateCurrentEmployerInput = {
  employerNationalId: Scalars['String']
}

export type UpdateEndorsementListDto = {
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  closedDate: Scalars['DateTime']
  openedDate: Scalars['DateTime']
}

export type UpdateEndorsementListInput = {
  listId: Scalars['String']
  endorsementList: UpdateEndorsementListDto
}

export type UpdateEndpointInput = {
  nationalId: Scalars['String']
  endpoint: Scalars['String']
  providerId: Scalars['String']
  xroad?: Maybe<Scalars['Boolean']>
}

export type UpdateHelpdeskInput = {
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type UpdateIcelandicNameInput = {
  id: Scalars['Float']
  body: CreateIcelandicNameInput
}

export type UpdateOrganisationInput = {
  nationalId?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type UpdateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  documentNotifications?: Maybe<Scalars['Boolean']>
  emailStatus?: Maybe<Scalars['String']>
  mobileStatus?: Maybe<Scalars['String']>
  emailCode?: Maybe<Scalars['String']>
  smsCode?: Maybe<Scalars['String']>
  canNudge?: Maybe<Scalars['Boolean']>
  bankInfo?: Maybe<Scalars['String']>
}

export type UploadSignedFileDtoTypeEnum = 'ChildrenResidenceChange'

export type UploadSignedFileInput = {
  id: Scalars['String']
  documentToken: Scalars['String']
  type: UploadSignedFileDtoTypeEnum
}

export type UserDeviceTokenInput = {
  deviceToken: Scalars['String']
}

export type VerifyPkPassInput = {
  licenseType: Scalars['String']
  data: Scalars['String']
}

export type WebSearchAutocompleteInput = {
  singleTerm: Scalars['String']
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
}

export type ChangeEndorsmentListClosedDateDto = {
  closedDate: Scalars['DateTime']
}

export type SendPdfEmailInput = {
  listId: Scalars['String']
  emailAddress: Scalars['String']
}

export type ActorDelegationsQueryVariables = Exact<{ [key: string]: never }>

export type ActorDelegationsQuery = {
  __typename?: 'Query'
  authActorDelegations: Array<
    | {
        __typename?: 'AuthCustomDelegation'
        from?: Maybe<
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
        >
      }
    | {
        __typename?: 'AuthLegalGuardianDelegation'
        from?: Maybe<
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
        >
      }
    | {
        __typename?: 'AuthPersonalRepresentativeDelegation'
        from?: Maybe<
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
        >
      }
    | {
        __typename?: 'AuthProcuringHolderDelegation'
        from?: Maybe<
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
        >
      }
  >
}

export type GetUserProfileQueryVariables = Exact<{ [key: string]: never }>

export type GetUserProfileQuery = {
  __typename?: 'Query'
  getUserProfile?: Maybe<{
    __typename?: 'UserProfile'
    email?: Maybe<string>
    mobilePhoneNumber?: Maybe<string>
  }>
}

export type UpdateUserProfileMutationVariables = Exact<{
  input: UpdateUserProfileInput
}>

export type UpdateUserProfileMutation = {
  __typename?: 'Mutation'
  updateProfile?: Maybe<{
    __typename?: 'UserProfile'
    locale?: Maybe<string>
    nationalId: string
  }>
}

export const ActorDelegationsDocument = gql`
  query ActorDelegations {
    authActorDelegations {
      from {
        nationalId
        name
      }
    }
  }
`

/**
 * __useActorDelegationsQuery__
 *
 * To run a query within a React component, call `useActorDelegationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useActorDelegationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useActorDelegationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useActorDelegationsQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >(ActorDelegationsDocument, baseOptions)
}
export function useActorDelegationsLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    ActorDelegationsQuery,
    ActorDelegationsQueryVariables
  >(ActorDelegationsDocument, baseOptions)
}
export type ActorDelegationsQueryHookResult = ReturnType<
  typeof useActorDelegationsQuery
>
export type ActorDelegationsLazyQueryHookResult = ReturnType<
  typeof useActorDelegationsLazyQuery
>
export type ActorDelegationsQueryResult = ApolloReactCommon.QueryResult<
  ActorDelegationsQuery,
  ActorDelegationsQueryVariables
>
export const GetUserProfileDocument = gql`
  query GetUserProfile {
    getUserProfile {
      email
      mobilePhoneNumber
    }
  }
`

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetUserProfileQuery(
  baseOptions?: ApolloReactHooks.QueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  return ApolloReactHooks.useQuery<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >(GetUserProfileDocument, baseOptions)
}
export function useGetUserProfileLazyQuery(
  baseOptions?: ApolloReactHooks.LazyQueryHookOptions<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >,
) {
  return ApolloReactHooks.useLazyQuery<
    GetUserProfileQuery,
    GetUserProfileQueryVariables
  >(GetUserProfileDocument, baseOptions)
}
export type GetUserProfileQueryHookResult = ReturnType<
  typeof useGetUserProfileQuery
>
export type GetUserProfileLazyQueryHookResult = ReturnType<
  typeof useGetUserProfileLazyQuery
>
export type GetUserProfileQueryResult = ApolloReactCommon.QueryResult<
  GetUserProfileQuery,
  GetUserProfileQueryVariables
>
export const UpdateUserProfileDocument = gql`
  mutation updateUserProfile($input: UpdateUserProfileInput!) {
    updateProfile(input: $input) {
      locale
      nationalId
    }
  }
`
export type UpdateUserProfileMutationFn = ApolloReactCommon.MutationFunction<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(
  baseOptions?: ApolloReactHooks.MutationHookOptions<
    UpdateUserProfileMutation,
    UpdateUserProfileMutationVariables
  >,
) {
  return ApolloReactHooks.useMutation<
    UpdateUserProfileMutation,
    UpdateUserProfileMutationVariables
  >(UpdateUserProfileDocument, baseOptions)
}
export type UpdateUserProfileMutationHookResult = ReturnType<
  typeof useUpdateUserProfileMutation
>
export type UpdateUserProfileMutationResult = ApolloReactCommon.MutationResult<UpdateUserProfileMutation>
export type UpdateUserProfileMutationOptions = ApolloReactCommon.BaseMutationOptions<
  UpdateUserProfileMutation,
  UpdateUserProfileMutationVariables
>
