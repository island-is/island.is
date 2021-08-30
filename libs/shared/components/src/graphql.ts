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

export type IdentityType = 'Person' | 'Company'

export type AuthDelegationType =
  | 'LegalGuardian'
  | 'ProcurationHolder'
  | 'Custom'

export type AuthDelegationProvider =
  | 'Thjodskra'
  | 'Fyrirtaekjaskra'
  | 'Delegationdb'

export type Gender =
  | 'MALE'
  | 'FEMALE'
  | 'TRANSGENDER'
  | 'MALE_MINOR'
  | 'FEMALE_MINOR'
  | 'TRANSGENDER_MINOR'
  | 'UNKNOWN'

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

export type RequirementKey =
  | 'drivingAssessmentMissing'
  | 'drivingSchoolMissing'
  | 'deniedByService'

export type ApplicationResponseDtoTypeIdEnum =
  | 'ExampleForm'
  | 'Passport'
  | 'DrivingLessons'
  | 'DrivingLicense'
  | 'DrivingAssessmentApproval'
  | 'ParentalLeave'
  | 'MetaApplication'
  | 'DocumentProviderOnboarding'
  | 'HealthInsurance'
  | 'ChildrenResidenceChange'
  | 'DataProtectionAuthorityComplaint'
  | 'PartyLetter'
  | 'LoginService'
  | 'PartyApplication'
  | 'InstitutionCollaboration'
  | 'FundingGovernmentProjects'
  | 'PublicDebtPaymentPlan'
  | 'JointCustodyAgreement'
  | 'PayableDummyTemplate'
  | 'ComplaintsToAlthingiOmbudsman'
  | 'AccidentNotification'

export type ApplicationResponseDtoStatusEnum =
  | 'inprogress'
  | 'completed'
  | 'rejected'

export type TypeCategory = 'REST' | 'SOAP' | 'GRAPHQL'

export type PricingCategory = 'FREE' | 'PAID'

export type DataCategory =
  | 'OPEN'
  | 'PUBLIC'
  | 'OFFICIAL'
  | 'PERSONAL'
  | 'HEALTH'
  | 'FINANCIAL'

export type Environment = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION'

export type AccessCategory = 'XROAD' | 'APIGW'

export type EndorsementListOpenTagsEnum =
  | 'partyLetter2021'
  | 'partyApplicationNordausturkjordaemi2021'
  | 'partyApplicationNordvesturkjordaemi2021'
  | 'partyApplicationReykjavikurkjordaemiNordur2021'
  | 'partyApplicationReykjavikurkjordaemiSudur2021'
  | 'partyApplicationSudurkjordaemi2021'
  | 'partyApplicationSudvesturkjordaemi2021'

export type EndorsementMetadataSignedTagsEnum =
  | 'partyLetter2021'
  | 'partyApplicationNordausturkjordaemi2021'
  | 'partyApplicationNordvesturkjordaemi2021'
  | 'partyApplicationReykjavikurkjordaemiNordur2021'
  | 'partyApplicationReykjavikurkjordaemiSudur2021'
  | 'partyApplicationSudurkjordaemi2021'
  | 'partyApplicationSudvesturkjordaemi2021'

export type ValidationRuleDtoTypeEnum =
  | 'minAge'
  | 'minAgeAtDate'
  | 'uniqueWithinTags'

export type EndorsementListEndorsementMetaEnum =
  | 'fullName'
  | 'address'
  | 'signedTags'
  | 'voterRegion'

export type EndorsementListTagsEnum =
  | 'partyLetter2021'
  | 'partyApplicationNordausturkjordaemi2021'
  | 'partyApplicationNordvesturkjordaemi2021'
  | 'partyApplicationReykjavikurkjordaemiNordur2021'
  | 'partyApplicationReykjavikurkjordaemiSudur2021'
  | 'partyApplicationSudurkjordaemi2021'
  | 'partyApplicationSudvesturkjordaemi2021'

/** Possible types of data fields */
export type GenericLicenseDataFieldType = 'Group' | 'Category' | 'Value'

/** Exhaustive list of license provider IDs */
export type GenericLicenseProviderId =
  | 'NationalPoliceCommissioner'
  | 'EnvironmentAgency'

/** Exhaustive list of license types */
export type GenericLicenseType = 'DriversLicense' | 'HuntingLicense'

/** Possible license statuses for user */
export type GenericUserLicenseStatus = 'Unknown' | 'HasLicense' | 'NotAvailable'

/** Possible license fetch statuses */
export type GenericUserLicenseFetchStatus =
  | 'Fetched'
  | 'NotFetched'
  | 'Fetching'
  | 'Error'
  | 'Stale'

/** Possible types of schedules */
export type PaymentScheduleType =
  | 'FinesAndLegalCost'
  | 'OverpaidBenefits'
  | 'Wagedection'
  | 'OtherFees'

export type AuthDelegationInput = {
  toNationalId: Scalars['String']
}

export type IdentityInput = {
  nationalId: Scalars['String']
}

export type SearcherInput = {
  queryString: Scalars['String']
  types?: Maybe<Array<SearchableContentTypes>>
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
  page?: Maybe<Scalars['Int']>
  tags?: Maybe<Array<Tag>>
  countTag?: Maybe<SearchableTags>
  countTypes?: Maybe<Scalars['Boolean']>
}

export type SearchableContentTypes =
  | 'webAboutPage'
  | 'webArticle'
  | 'webSubArticle'
  | 'webLifeEventPage'
  | 'webNews'
  | 'webAdgerdirPage'
  | 'webOrganizationSubpage'

export type ContentLanguage = 'is' | 'en'

export type Tag = {
  type: SearchableTags
  key: Scalars['String']
}

export type SearchableTags = 'category' | 'processentry'

export type WebSearchAutocompleteInput = {
  singleTerm: Scalars['String']
  language?: Maybe<ContentLanguage>
  size?: Maybe<Scalars['Int']>
}

export type GetNamespaceInput = {
  namespace?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetAboutPageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAboutSubPageInput = {
  url: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetContentSlugInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAlertBannerInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetGenericOverviewPageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirPageInput = {
  slug?: Maybe<Scalars['String']>
  lang?: Maybe<Scalars['String']>
}

export type GetErrorPageInput = {
  errorCode: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetOpenDataPageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOpenDataSubpageInput = {
  lang?: Maybe<Scalars['String']>
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

export type GetAuctionsInput = {
  lang?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  year?: Maybe<Scalars['Float']>
  month?: Maybe<Scalars['Float']>
}

export type GetAuctionInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetProjectPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirPagesInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetOrganizationsInput = {
  lang?: Maybe<Scalars['String']>
  perPage?: Maybe<Scalars['Int']>
}

export type GetAdgerdirTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetOrganizationTagsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetAdgerdirFrontpageInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventPageInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetLifeEventsInCategoryInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetUrlInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetTellUsAStoryInput = {
  lang?: Maybe<Scalars['String']>
}

export type GetFrontpageInput = {
  pageIdentifier: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetArticleCategoriesInput = {
  lang?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
}

export type GetSingleArticleInput = {
  slug: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetArticlesInput = {
  lang?: Maybe<Scalars['String']>
  category?: Maybe<Scalars['String']>
  organization?: Maybe<Scalars['String']>
  size?: Maybe<Scalars['Int']>
  sort?: Maybe<SortField>
}

export type SortField = 'TITLE' | 'POPULAR'

export type GetSingleNewsInput = {
  slug: Scalars['String']
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

export type GetMenuInput = {
  name: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSingleMenuInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type GetSubpageHeaderInput = {
  id: Scalars['String']
  lang?: Maybe<Scalars['String']>
}

export type ApplicationApplicationInput = {
  id: Scalars['String']
}

export type ApplicationApplicationsInput = {
  typeId?: Maybe<Array<Scalars['String']>>
  status?: Maybe<Array<Scalars['String']>>
}

export type GetPresignedUrlInput = {
  id: Scalars['String']
  type: Scalars['String']
}

export type GetParentalLeavesEntitlementsInput = {
  dateOfBirth: Scalars['String']
}

export type GetParentalLeavesEstimatedPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  period: Array<Period>
}

export type Period = {
  from: Scalars['String']
  to: Scalars['String']
  ratio: Scalars['Float']
  approved: Scalars['Boolean']
  paid: Scalars['Boolean']
}

export type GetParentalLeavesApplicationPaymentPlanInput = {
  dateOfBirth: Scalars['String']
  applicationId: Scalars['String']
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

export type GetDocumentInput = {
  id: Scalars['String']
}

export type StatisticsInput = {
  organisationId?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  fromDate?: Maybe<Scalars['String']>
  /** Date format: YYYY-MM-DD */
  toDate?: Maybe<Scalars['String']>
}

export type GetTranslationsInput = {
  namespaces: Array<Scalars['String']>
  lang: Scalars['String']
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

export type GetOpenApiInput = {
  instance: Scalars['String']
  memberClass: Scalars['String']
  memberCode: Scalars['String']
  subsystemCode: Scalars['String']
  serviceCode: Scalars['String']
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

export type FindEndorsementListInput = {
  listId: Scalars['String']
}

export type FindEndorsementListByTagsDto = {
  tags: Array<EndorsementListControllerFindByTagsTagsEnum>
}

export type EndorsementListControllerFindByTagsTagsEnum =
  | 'partyLetter2021'
  | 'partyApplicationNordausturkjordaemi2021'
  | 'partyApplicationNordvesturkjordaemi2021'
  | 'partyApplicationReykjavikurkjordaemiNordur2021'
  | 'partyApplicationReykjavikurkjordaemiSudur2021'
  | 'partyApplicationSudurkjordaemi2021'
  | 'partyApplicationSudvesturkjordaemi2021'

export type GetRegulationInput = {
  viewType: RegulationViewTypes
  name: Scalars['String']
  date?: Maybe<Scalars['String']>
  isCustomDiff?: Maybe<Scalars['Boolean']>
  earlierDate?: Maybe<Scalars['String']>
}

export type RegulationViewTypes = 'current' | 'diff' | 'original' | 'd'

export type GetRegulationsInput = {
  type: Scalars['String']
  page?: Maybe<Scalars['Float']>
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

export type GetRegulationsLawChaptersInput = {
  tree?: Maybe<Scalars['Boolean']>
}

export type GetFinancialOverviewInput = {
  OrgID: Scalars['String']
  chargeTypeID: Scalars['String']
}

export type GetCustomerRecordsInput = {
  chargeTypeID?: Maybe<Array<Scalars['String']>>
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
}

export type GetDocumentsListInput = {
  dayFrom: Scalars['String']
  dayTo: Scalars['String']
  listPath: Scalars['String']
}

export type GetFinanceDocumentInput = {
  documentID: Scalars['String']
}

export type GetAnnualStatusDocumentInput = {
  year: Scalars['String']
}

export type PaymentCatalogInput = {
  performingOrganizationID?: Maybe<Scalars['String']>
}

export type GetGenericLicensesInput = {
  includedTypes?: Maybe<Array<Scalars['String']>>
  excludedTypes?: Maybe<Array<Scalars['String']>>
  force?: Maybe<Scalars['Boolean']>
  onlyList?: Maybe<Scalars['Boolean']>
}

export type GetGenericLicenseInput = {
  licenseType: Scalars['String']
}

export type GetInitialScheduleInput = {
  totalAmount: Scalars['Float']
  disposableIncome: Scalars['Float']
  type: PaymentScheduleType
}

export type GetScheduleDistributionInput = {
  monthAmount?: Maybe<Scalars['Float']>
  monthCount?: Maybe<Scalars['Float']>
  scheduleType: PaymentScheduleType
  totalAmount: Scalars['Float']
}

export type CreateAuthDelegationInput = {
  toNationalId: Scalars['String']
  name: Scalars['String']
  scopes?: Maybe<Array<AuthDelegationScopeInput>>
}

export type AuthDelegationScopeInput = {
  name: Scalars['String']
  type: AuthDelegationScopeType
  validTo?: Maybe<Scalars['DateTime']>
}

export type AuthDelegationScopeType = 'ApiScope' | 'IdentityResource'

export type UpdateAuthDelegationInput = {
  toNationalId: Scalars['String']
  name?: Maybe<Scalars['String']>
  scopes: Array<AuthDelegationScopeInput>
}

export type DeleteAuthDelegationInput = {
  toNationalId: Scalars['String']
}

export type FetchEducationSignedLicenseUrlInput = {
  licenseId: Scalars['String']
}

export type ApplicationPaymentChargeInput = {
  applicationId: Scalars['String']
  chargeItemCode: Scalars['String']
}

export type CreateApplicationInput = {
  typeId: CreateApplicationDtoTypeIdEnum
}

export type CreateApplicationDtoTypeIdEnum =
  | 'ExampleForm'
  | 'Passport'
  | 'DrivingLessons'
  | 'DrivingLicense'
  | 'DrivingAssessmentApproval'
  | 'ParentalLeave'
  | 'MetaApplication'
  | 'DocumentProviderOnboarding'
  | 'HealthInsurance'
  | 'ChildrenResidenceChange'
  | 'DataProtectionAuthorityComplaint'
  | 'PartyLetter'
  | 'LoginService'
  | 'PartyApplication'
  | 'InstitutionCollaboration'
  | 'FundingGovernmentProjects'
  | 'PublicDebtPaymentPlan'
  | 'JointCustodyAgreement'
  | 'PayableDummyTemplate'
  | 'ComplaintsToAlthingiOmbudsman'
  | 'AccidentNotification'

export type UpdateApplicationInput = {
  id: Scalars['String']
  applicant?: Maybe<Scalars['String']>
  assignee?: Maybe<Scalars['String']>
  attachments?: Maybe<Scalars['JSON']>
  answers?: Maybe<Scalars['JSON']>
}

export type UpdateApplicationExternalDataInput = {
  id: Scalars['String']
  dataProviders: Array<DataProvider>
}

export type DataProvider = {
  id: Scalars['String']
  type: Scalars['String']
}

export type AddAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
  url: Scalars['String']
}

export type DeleteAttachmentInput = {
  id: Scalars['String']
  key: Scalars['String']
}

export type SubmitApplicationInput = {
  id: Scalars['String']
  event: Scalars['String']
  answers?: Maybe<Scalars['JSON']>
}

export type AssignApplicationInput = {
  token: Scalars['String']
}

export type GeneratePdfInput = {
  id: Scalars['String']
  type: GeneratePdfDtoTypeEnum
}

export type GeneratePdfDtoTypeEnum =
  | 'ChildrenResidenceChange'
  | 'JointCustodyAgreement'

export type RequestFileSignatureInput = {
  id: Scalars['String']
  type: RequestFileSignatureDtoTypeEnum
}

export type RequestFileSignatureDtoTypeEnum =
  | 'ChildrenResidenceChange'
  | 'JointCustodyAgreement'

export type UploadSignedFileInput = {
  id: Scalars['String']
  documentToken: Scalars['String']
  type: UploadSignedFileDtoTypeEnum
}

export type UploadSignedFileDtoTypeEnum =
  | 'ChildrenResidenceChange'
  | 'JointCustodyAgreement'

export type UpdateOrganisationInput = {
  nationalId?: Maybe<Scalars['String']>
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateContactInput = {
  name: Scalars['String']
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type UpdateContactInput = {
  name?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateHelpdeskInput = {
  email: Scalars['String']
  phoneNumber: Scalars['String']
}

export type UpdateHelpdeskInput = {
  email?: Maybe<Scalars['String']>
  phoneNumber?: Maybe<Scalars['String']>
}

export type CreateProviderInput = {
  nationalId: Scalars['String']
  clientName: Scalars['String']
}

export type UpdateEndpointInput = {
  nationalId: Scalars['String']
  endpoint: Scalars['String']
  providerId: Scalars['String']
  xroad?: Maybe<Scalars['Boolean']>
}

export type RunEndpointTestsInput = {
  nationalId: Scalars['String']
  recipient: Scalars['String']
  documentId: Scalars['String']
  providerId: Scalars['String']
}

export type CreateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type UpdateUserProfileInput = {
  mobilePhoneNumber?: Maybe<Scalars['String']>
  locale?: Maybe<Scalars['String']>
  email?: Maybe<Scalars['String']>
}

export type CreateSmsVerificationInput = {
  mobilePhoneNumber: Scalars['String']
}

export type ConfirmSmsVerificationInput = {
  code: Scalars['String']
}

export type ConfirmEmailVerificationInput = {
  hash: Scalars['String']
}

export type ContactUsInput = {
  name: Scalars['String']
  phone?: Maybe<Scalars['String']>
  email: Scalars['String']
  subject?: Maybe<Scalars['String']>
  message: Scalars['String']
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

export type UpdateIcelandicNameInput = {
  id: Scalars['Float']
  body: CreateIcelandicNameInput
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

export type DeleteIcelandicNameByIdInput = {
  id: Scalars['Float']
}

export type BulkEndorseListInput = {
  listId: Scalars['String']
  nationalIds: Array<Scalars['String']>
}

export type CreateEndorsementListDto = {
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  endorsementMeta: Array<EndorsementListDtoEndorsementMetaEnum>
  tags: Array<EndorsementListDtoTagsEnum>
  validationRules: Array<ValidationRuleInput>
  meta?: Maybe<Scalars['JSON']>
}

export type EndorsementListDtoEndorsementMetaEnum =
  | 'fullName'
  | 'address'
  | 'signedTags'
  | 'voterRegion'

export type EndorsementListDtoTagsEnum =
  | 'partyLetter2021'
  | 'partyApplicationNordausturkjordaemi2021'
  | 'partyApplicationNordvesturkjordaemi2021'
  | 'partyApplicationReykjavikurkjordaemiNordur2021'
  | 'partyApplicationReykjavikurkjordaemiSudur2021'
  | 'partyApplicationSudurkjordaemi2021'
  | 'partyApplicationSudvesturkjordaemi2021'

export type ValidationRuleInput = {
  type: ValidationRuleDtoTypeEnum
  value?: Maybe<Scalars['JSON']>
}

export type GeneratePkPassInput = {
  licenseType: Scalars['String']
}

export type VerifyPkPassInput = {
  licenseType: Scalars['String']
  data: Scalars['String']
}

export type ActorDelegationsQueryVariables = Exact<{ [key: string]: never }>

export type ActorDelegationsQuery = {
  __typename?: 'Query'
  authActorDelegations: Array<
    | {
        __typename?: 'AuthLegalGuardianDelegation'
        from:
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
      }
    | {
        __typename?: 'AuthProcuringHolderDelegation'
        from:
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
      }
    | {
        __typename?: 'AuthCustomDelegation'
        from:
          | { __typename?: 'IdentityPerson'; nationalId: string; name: string }
          | { __typename?: 'IdentityCompany'; nationalId: string; name: string }
      }
  >
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
