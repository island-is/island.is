import gql from 'graphql-tag'
export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

export type AuthUser = {
  __typename?: 'AuthUser'
  token: Scalars['String']
  userInfo: [UserInfo]
}

export type UserInfo = {
  userInfo: {
    nationalId: Scalars['String']
    availableSubjects: [Subject]
  }
}

export type Subject = {
  name: Scalars['String']
  email: Scalars['String']
  nationalId: Scalars['String']
  scopes: Scalars['String']
}
