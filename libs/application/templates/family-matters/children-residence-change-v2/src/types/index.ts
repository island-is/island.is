import { Application, FieldBaseProps } from '@island.is/application/types'
import {
  MockData,
  ExternalData,
  Override,
  NestedType,
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
