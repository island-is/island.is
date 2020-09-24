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
  /** The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSON: any
}

export type User = {
  nationalId: Scalars['ID']
  name: Scalars['String']
  mobile: Scalars['Int']
  cars: Array<Car>
}

export type Car = {
  id: Scalars['ID']
  name: Scalars['String']
  model: Scalars['String']
  color: Scalars['String']
  year: Scalars['Int']
  recyclable: Scalars['Boolean']
}
