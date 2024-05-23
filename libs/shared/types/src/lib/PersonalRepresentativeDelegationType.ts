import { AuthDelegationType } from '..'

export const getPersonalRepresentativeDelegationType = (right: string) =>
  `${AuthDelegationType.PersonalRepresentative}:${right}`
