import { Application, FieldBaseProps } from '@island.is/application/core'
import {
  ExternalData,
  MockData,
  NestedType,
  Override,
} from '@island.is/application/templates/family-matters-core/types'

import { answersSchema } from '../lib/dataSchema'

// We are using mockData that is not defined in the zod schema
export interface Answers extends answersSchema {
  mockData: MockData
}

export type CRCApplication = Override<
  Application,
  { answers: Answers; externalData: ExternalData }
>

type ErrorSchema = NestedType<answersSchema>

export type CRCFieldBaseProps = Override<
  FieldBaseProps,
  { application: CRCApplication; errors: ErrorSchema }
>

export enum DataProviderTypes {
  MockNationalRegistry = 'MockNationalRegistryProvider',
  NationalRegistry = 'NationalRegistryProvider',
  UserProfile = 'UserProfileProvider',
}
