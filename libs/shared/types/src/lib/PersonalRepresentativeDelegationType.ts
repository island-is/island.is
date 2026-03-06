import { AuthDelegationType } from './delegation'

export const getPersonalRepresentativeDelegationType = (right: string) =>
  `${AuthDelegationType.PersonalRepresentative}:${right}`

export const isPersonalRepresentativeDelegationType = (type: string): boolean =>
  type === AuthDelegationType.PersonalRepresentative ||
  type.startsWith(`${AuthDelegationType.PersonalRepresentative}:`)
