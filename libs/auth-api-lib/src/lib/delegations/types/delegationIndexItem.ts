import { DelegationType } from './delegationType'
export enum PersonalRepresentativeDelegationType {
  PersonalRepresentativePostholf = 'PersonalRepresentative:postholf',
}

export type DelegationIndexItem =
  | DelegationType
  | PersonalRepresentativeDelegationType
