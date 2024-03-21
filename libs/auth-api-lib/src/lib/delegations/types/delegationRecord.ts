import { AuthDelegationType } from '@island.is/shared/types'

export enum PersonalRepresentativeDelegationType {
  PersonalRepresentativePostholf = 'PersonalRepresentative:postholf',
}

export type DelegationRecordType =
  | AuthDelegationType
  | PersonalRepresentativeDelegationType
