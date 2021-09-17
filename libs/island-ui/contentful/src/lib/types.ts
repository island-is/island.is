import { BoxProps } from '@island.is/island-ui/core'

export interface RenderConfig {
  isInsideUl: boolean
  plainParagraph: boolean
  containerProps: BoxProps
}

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
  DateTime: any
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
}

export type ValidationRule = {
  __typename?: 'ValidationRule'
  type: ValidationRuleDtoTypeEnum
  value?: Maybe<Scalars['JSON']>
}

export enum ValidationRuleDtoTypeEnum {
  MinAge = 'minAge',
  MinAgeAtDate = 'minAgeAtDate',
  UniqueWithinTags = 'uniqueWithinTags',
}

export type EndorsementListOpen = {
  __typename?: 'EndorsementListOpen'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  tags?: Maybe<Array<EndorsementListOpenTagsEnum>>
  closedDate?: Maybe<Scalars['String']>
}

export type Endorsement = {
  __typename?: 'Endorsement'
  id: Scalars['ID']
  endorser: Scalars['String']
  endorsementListId: Scalars['String']
  endorsementList?: Maybe<EndorsementListOpen>
  meta: EndorsementMetadata
  created: Scalars['String']
  modified: Scalars['String']
}

export type EndorsementList = {
  __typename?: 'EndorsementList'
  id: Scalars['ID']
  title: Scalars['String']
  description?: Maybe<Scalars['String']>
  closedDate?: Maybe<Scalars['String']>
  endorsementMeta: Array<EndorsementListEndorsementMetaEnum>
  tags: Array<EndorsementListTagsEnum>
  validationRules: Array<ValidationRule>
  owner: Scalars['String']
  endorsements: Array<Endorsement>
  meta: Scalars['JSON']
  created: Scalars['String']
  modified: Scalars['String']
}

export enum EndorsementListEndorsementMetaEnum {
  FullName = 'fullName',
  Address = 'address',
  SignedTags = 'signedTags',
  VoterRegion = 'voterRegion',
}

export enum EndorsementListTagsEnum {
  PartyLetter2021 = 'partyLetter2021',
}

export enum EndorsementListOpenTagsEnum {
  PartyLetter2021 = 'partyLetter2021',
  PartyApplicationNordausturkjordaemi2021 = 'partyApplicationNordausturkjordaemi2021',
  PartyApplicationNordvesturkjordaemi2021 = 'partyApplicationNordvesturkjordaemi2021',
  PartyApplicationReykjavikurkjordaemiNordur2021 = 'partyApplicationReykjavikurkjordaemiNordur2021',
  PartyApplicationReykjavikurkjordaemiSudur2021 = 'partyApplicationReykjavikurkjordaemiSudur2021',
  PartyApplicationSudurkjordaemi2021 = 'partyApplicationSudurkjordaemi2021',
  PartyApplicationSudvesturkjordaemi2021 = 'partyApplicationSudvesturkjordaemi2021',
}

export type EndorsementMetadata = {
  __typename?: 'EndorsementMetadata'
  fullName?: Maybe<Scalars['String']>
  address?: Maybe<Scalars['JSON']>
  bulkEndorsement?: Maybe<Scalars['Boolean']>
  signedTags?: Maybe<Array<EndorsementMetadataSignedTagsEnum>>
  voterRegion?: Maybe<Scalars['JSON']>
}

export enum EndorsementMetadataSignedTagsEnum {
  PartyLetter2021 = 'partyLetter2021',
}

export type TemporaryVoterRegistry = {
  __typename?: 'TemporaryVoterRegistry'
  id: Scalars['ID']
  nationalId: Scalars['String']
  regionNumber: Scalars['Float']
  regionName: Scalars['String']
}
