import template from './lib/SeminarsRegistrationTemplate'

export const getFields = () => import('./fields/')

export type { SeminarAnswersSchema as SeminarAnswers } from './shared/types'

export default template
export * from './lib/messages/externalData'
export * from './lib/messages/application'
export { IndividualOrCompany, RegisterNumber } from './shared/types'
